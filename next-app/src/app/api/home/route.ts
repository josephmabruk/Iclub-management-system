import { NextResponse } from "next/server";
import { delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { HomeSummary } from "@/types";

/** GET /api/home: the numbers shown on the Home screen. */
export async function GET() {
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);

  const summary: HomeSummary = {
    activeMembers: 0,
    // Nobody is appointed yet, so every defined position is vacant.
    leadershipVacancies: user.club.positions.length,
    upcomingActivities: [],
  };
  return NextResponse.json(summary);
}