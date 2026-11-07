import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { isDay, isTime } from "@/lib/validate";
import type { Activity, CreateActivityRequest } from "@/types";
import { forbid } from "@/app/api/_mock/db";

/** GET /api/activities: the club's activities, soonest first. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);

  const list = [...(db.activities[user.club.id] ?? [])].sort((a, b) =>
    (a.date + a.startTime).localeCompare(b.date + b.startTime),
  );
  return NextResponse.json(list);
}

/** POST /api/activities: schedule an activity. */
export async function POST(request: Request) {
  const body = (await request.json()) as CreateActivityRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);

  const denied = forbid(user, "activities.manage");
  if (denied) return denied;

  const name = body.name?.trim();
  const location = body.location?.trim();
  if (!name || !location)
    return errorResponse("Name and location are required", 400);
  if (!isDay(body.date) || !isTime(body.startTime) || !isTime(body.endTime))
    return errorResponse("Enter a valid date and times", 400);
  if (body.endTime <= body.startTime)
    return errorResponse("The activity must end after it starts", 400);
  if (body.unitId && !club.units.some((u) => u.id === body.unitId))
    return errorResponse("That unit does not exist", 400);

  const activity: Activity = {
    id: crypto.randomUUID(),
    name,
    date: body.date,
    startTime: body.startTime,
    endTime: body.endTime,
    location,
    unitId: body.unitId || null,
    status: "scheduled",
    history: [
      {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        by: user.name,
        text: "Scheduled",
      },
    ],
  };
  (db.activities[club.id] ??= []).push(activity);
  return NextResponse.json(activity, { status: 201 });
}
