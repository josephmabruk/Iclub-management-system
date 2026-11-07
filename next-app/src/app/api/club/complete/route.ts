import { NextResponse } from "next/server";
import { delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";

/** POST /api/club/complete: finish setup once the required steps are saved. */
export async function POST() {
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Create your club first", 404);
  // NEW: only the club administrator may finish setup
  if (!user.isOwner)
    return errorResponse("Only the club administrator can change setup", 403);

  const { membershipSource, term } = user.club;
  if (!membershipSource || !term)
    return errorResponse("Choose a membership source and set the term first", 400);

  user.club = { ...user.club, setupStatus: "complete" };
  return NextResponse.json(user.club);
}