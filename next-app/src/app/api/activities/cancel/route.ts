import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { CancelRequest } from "@/types";
import { forbid } from "@/app/api/_mock/db";

/** POST /api/activities/cancel: cancel with a reason. The activity stays on record. */
export async function POST(request: Request) {
  const { id, reason } = (await request.json()) as CancelRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);

  const denied = forbid(user, "activities.manage");
  if (denied) return denied;

  const activity = (db.activities[club.id] ?? []).find((a) => a.id === id);
  if (!activity) return errorResponse("That activity does not exist", 404);
  if (activity.status === "cancelled")
    return errorResponse("This activity is already cancelled", 409);

  const why = reason?.trim();
  if (!why) return errorResponse("A reason is required", 400);

  activity.status = "cancelled";
  activity.cancelReason = why;
  activity.history.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    by: user.name,
    text: `Cancelled. Reason: ${why}`,
  });
  return NextResponse.json(activity);
}
