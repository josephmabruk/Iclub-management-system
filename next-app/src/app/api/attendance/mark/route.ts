import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { ATTENDANCE_LABELS } from "@/constants";
import type { AttendanceMark, MarkRequest } from "@/types";
import { forbid } from "@/app/api/_mock/db";

/** POST /api/attendance/mark: record one member's attendance. Saved on every tap. */
export async function POST(request: Request) {
  const { activityId, memberId, status } =
    (await request.json()) as MarkRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);

  const denied = forbid(user, "members.manage");
  if (denied) return denied;

  if (!(status in ATTENDANCE_LABELS))
    return errorResponse("Choose present, absent or excused", 400);

  const activity = (db.activities[club.id] ?? []).find(
    (a) => a.id === activityId,
  );
  if (!activity) return errorResponse("That activity does not exist", 404);
  if (activity.status === "cancelled")
    return errorResponse("A cancelled activity cannot take attendance", 409);

  const member = (db.members[club.id] ?? []).find((m) => m.id === memberId);
  if (!member || member.status !== "active")
    return errorResponse("Only active members can be marked", 409);
  if (activity.unitId && member.unitId !== activity.unitId)
    return errorResponse("This member is not in the activity's unit", 409);

  const mark: AttendanceMark = {
    status,
    by: user.name,
    at: new Date().toISOString(),
  };
  (db.attendance[activityId] ??= {})[memberId] = mark;
  return NextResponse.json(mark);
}
