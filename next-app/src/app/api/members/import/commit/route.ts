import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { MEMBERSHIP_SOURCES } from "@/constants";
import type { CommitImportRequest, CommitImportResult } from "@/types";

/** POST /api/members/import/commit: apply the saved dry-run report. */
export async function POST(request: Request) {
  const { reportId, resolutions } = (await request.json()) as CommitImportRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const club = user.club;

  if (club.membershipSource !== MEMBERSHIP_SOURCES.imported)
    return errorResponse("This club does not use roster import", 409);

  // The server applies ITS saved report. The browser only names it.
  const report = db.importReports[club.id];
  if (!report || report.id !== reportId)
    return errorResponse("That report no longer exists. Run the dry run again.", 409);
  if (new Date(report.expiresAt).getTime() < Date.now()) {
    delete db.importReports[club.id];
    return errorResponse("This report has expired. Run the dry run again.", 410);
  }

  const register = (db.members[club.id] ??= []);
  const additions = [...report.additions];
  const taken = new Set(
    [...register, ...additions].map((m) => m.memberNumber.toLowerCase()),
  );
  let excluded = 0;

  // STEP 1: check every problem row. Nothing is written yet.
  for (const issue of [...report.duplicates, ...report.unmatched]) {
    const decision = resolutions?.[issue.rowNumber];
    if (!decision)
      return errorResponse(`Row ${issue.rowNumber} still needs a decision`, 409);

    if (decision.action === "exclude") {
      excluded += 1;
      continue;
    }

    const unit = club.units.find((u) => u.id === decision.unitId);
    if (!unit)
      return errorResponse(`Row ${issue.rowNumber}: that unit does not exist`, 400);
    if (!issue.memberNumber || !issue.fullName)
      return errorResponse(
        `Row ${issue.rowNumber} has no member number or name, so it can only be excluded`,
        400,
      );
    if (taken.has(issue.memberNumber.toLowerCase()))
      return errorResponse(
        `Row ${issue.rowNumber}: member number ${issue.memberNumber} is already in use`,
        409,
      );

    taken.add(issue.memberNumber.toLowerCase());
    additions.push({
      rowNumber: issue.rowNumber,
      memberNumber: issue.memberNumber,
      fullName: issue.fullName,
      unitId: unit.id,
    });
  }

  // STEP 2: everything checked, so now write.
  const now = new Date().toISOString();
  const event = (text: string) => ({
    id: crypto.randomUUID(),
    at: now,
    by: user.name,
    text,
  });

  for (const a of additions) {
    register.push({
      id: crypto.randomUUID(),
      memberNumber: a.memberNumber,
      fullName: a.fullName,
      unitId: a.unitId,
      status: "active",
      history: [event("Added by roster import")],
    });
  }

  const departingIds = new Set(report.departures.map((d) => d.memberId));
  for (const member of register) {
    if (departingIds.has(member.id)) {
      member.status = "departing";
      member.history.push(event("Marked as departing by roster import"));
    }
  }

  delete db.importReports[club.id]; // a report can be used once

  const result: CommitImportResult = {
    added: additions.length,
    departed: departingIds.size,
    excluded,
  };
  return NextResponse.json(result);
}