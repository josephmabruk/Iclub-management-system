import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { AttendanceSheet } from "@/types";

/** GET /api/attendance?activityId=...: the register for one activity. */
export async function GET(request: Request) {
  await delay();
  const user = await getSessionRecord();
  const club = user?.club;
  if (!club) return errorResponse("Not signed in", 401);

  const activityId = new URL(request.url).searchParams.get("activityId");
  const activity = (db.activities[club.id] ?? []).find(
    (a) => a.id === activityId,
  );
  if (!activity) return errorResponse("That activity does not exist", 404);

  const marks = db.attendance[activity.id] ?? {};
  // Only active members, and only the activity's unit if it has one.
  const rows = (db.members[club.id] ?? [])
    .filter(
      (m) =>
        m.status === "active" &&
        (!activity.unitId || m.unitId === activity.unitId),
    )
    .sort((a, b) => a.fullName.localeCompare(b.fullName))
    .map((m) => ({
      memberId: m.id,
      memberNumber: m.memberNumber,
      fullName: m.fullName,
      unitId: m.unitId,
      mark: marks[m.id] ?? null,
    }));

  const sheet: AttendanceSheet = { activity, rows };
  return NextResponse.json(sheet);
}
