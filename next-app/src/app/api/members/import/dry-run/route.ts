import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { MEMBERSHIP_SOURCES } from "@/constants";
import type { DryRunRequest, ImportReport } from "@/types";

const MAX_ROWS = 5000;
const REPORT_LIFETIME_MS = 24 * 60 * 60 * 1000;

/** POST /api/members/import/dry-run: compare a roster with the register. Changes nothing. */
export async function POST(request: Request) {
  const { rows } = (await request.json()) as DryRunRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const club = user.club;

  if (club.membershipSource !== MEMBERSHIP_SOURCES.imported)
    return errorResponse("This club does not use roster import", 409);
  if (!Array.isArray(rows) || rows.length === 0)
    return errorResponse("The roster has no rows", 400);
  if (rows.length > MAX_ROWS)
    return errorResponse(`A roster can have at most ${MAX_ROWS} rows`, 400);

  const register = db.members[club.id] ?? [];
  const unitByName = new Map(
    club.units.map((unit) => [unit.name.toLowerCase(), unit.id]),
  );

  const now = Date.now();
  const report: ImportReport = {
    id: crypto.randomUUID(),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + REPORT_LIFETIME_MS).toISOString(),
    totalRows: rows.length,
    additions: [],
    departures: [],
    unchanged: 0,
    duplicates: [],
    unmatched: [],
  };

  const registered = new Set(register.map((m) => m.memberNumber.toLowerCase()));
  const firstSeen = new Map<string, number>(); // member number -> first row
  const inFile = new Set<string>();

  for (const row of rows) {
    const memberNumber = (row.memberNumber ?? "").trim();
    const fullName = (row.fullName ?? "").trim();
    const unit = (row.unit ?? "").trim();
    const base = { rowNumber: row.rowNumber, memberNumber, fullName };

    if (!memberNumber || !fullName) {
      report.unmatched.push({
        ...base,
        kind: "missing",
        reason: "Missing member number or full name",
      });
      continue;
    }

    const key = memberNumber.toLowerCase();
    inFile.add(key);

    const first = firstSeen.get(key);
    if (first !== undefined) {
      report.duplicates.push({
        ...base,
        reason: `Repeats row ${first}`,
        kind: "duplicate",
      });
      continue;
    }
    firstSeen.set(key, row.rowNumber);

    let unitId: string | null = null;
    if (unit) {
      unitId = unitByName.get(unit.toLowerCase()) ?? null;
      if (!unitId) {
        report.unmatched.push({
          ...base,
          kind: "missing",
          reason: `"${unit}" is not one of your club's units`,
        });
        continue;
      }
    }

    if (registered.has(key)) report.unchanged += 1;
    else report.additions.push({ ...base, unitId });
  }

  for (const member of register) {
    if (
      member.status === "active" &&
      !inFile.has(member.memberNumber.toLowerCase())
    ) {
      report.departures.push({
        memberId: member.id,
        memberNumber: member.memberNumber,
        fullName: member.fullName,
      });
    }
  }

  db.importReports[club.id] = report;
  return NextResponse.json(report);
}
