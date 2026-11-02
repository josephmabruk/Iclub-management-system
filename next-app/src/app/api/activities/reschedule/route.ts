import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { isDay, isTime } from "@/lib/validate";
import type { RescheduleRequest } from "@/types";

/** POST /api/activities/reschedule: move an activity. The original time stays in its history. */
export async function POST(request: Request) {
  const { id, date, startTime, endTime, reason } =
    (await request.json()) as RescheduleRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);

  const activity = (db.activities[club.id] ?? []).find((a) => a.id === id);
  if (!activity) return errorResponse("That activity does not exist", 404);
  if (activity.status === "cancelled")
    return errorResponse("A cancelled activity cannot be rescheduled", 409);

  const why = reason?.trim();
  if (!why) return errorResponse("A reason is required", 400);
  if (!isDay(date) || !isTime(startTime) || !isTime(endTime))
    return errorResponse("Enter a valid date and times", 400);
  if (endTime <= startTime)
    return errorResponse("The activity must end after it starts", 400);

  const was = `${activity.date} ${activity.startTime}–${activity.endTime}`;
  activity.date = date;
  activity.startTime = startTime;
  activity.endTime = endTime;
  activity.history.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    by: user.name,
    text: `Rescheduled from ${was}. Reason: ${why}`,
  });
  return NextResponse.json(activity);
}
