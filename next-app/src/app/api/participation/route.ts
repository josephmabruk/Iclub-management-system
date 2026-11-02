import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { todayInNairobi } from "@/lib/format";
import type { ParticipationRow } from "@/types";

/** GET /api/participation: per-member attendance counts for the term so far. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  const club = user?.club;
  if (!club) return errorResponse("Not signed in", 401);

  const today = todayInNairobi();
  const held = (db.activities[club.id] ?? []).filter(
    (a) => a.status === "scheduled" && a.date <= today,
  );

  const rows: ParticipationRow[] = (db.members[club.id] ?? [])
    .filter((m) => m.status === "active")
    .map((m) => {
      const scope = held.filter((a) => !a.unitId || a.unitId === m.unitId);
      const statuses = scope.map((a) => db.attendance[a.id]?.[m.id]?.status);
      const present = statuses.filter((s) => s === "present").length;
      return {
        memberId: m.id,
        memberNumber: m.memberNumber,
        fullName: m.fullName,
        inScope: scope.length,
        present,
        excused: statuses.filter((s) => s === "excused").length,
        absent: statuses.filter((s) => s === "absent").length,
        rate: scope.length ? Math.round((present / scope.length) * 100) : null,
      };
    })
    .sort((a, b) => a.fullName.localeCompare(b.fullName));

  return NextResponse.json(rows);
}
