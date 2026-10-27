import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { Club, CreateClubRequest, UpdateClubRequest } from "@/types";

/** POST /api/club: create the signed-in user's club (setup step 1). */
export async function POST(request: Request) {
  const { name, purpose, foundingDate, ...rest } =
    (await request.json()) as CreateClubRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user) return errorResponse("Not signed in!", 401);

  if (user.club) return errorResponse("You already have a club!", 409);

  if (!name || !purpose || !foundingDate || !rest.shortCode)
    return errorResponse("All fields are required!", 400);

  const shortCode = rest.shortCode.trim().toUpperCase();

  if (db.users.some((other) => other.club?.shortCode === shortCode))
    return errorResponse("The shortcode is already taken", 409);

  user.club = {
    id: crypto.randomUUID(),
    name,
    shortCode,
    purpose,
    foundingDate,
    units: [],
    positions: [],
    setupStatus: "in_progress",
  };

  return NextResponse.json(user.club, { status: 201 });
}

/** PATCH /api/club: save a later setup step. Only these fields can change. */
export async function PATCH(request: Request) {
  const body = (await request.json()) as UpdateClubRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Create your club first", 404);

  const { institution, units, membershipSource, positions, term } = body;
  user.club = {
    ...user.club,
    ...(institution !== undefined && { institution }),
    ...(units && { units }),
    ...(membershipSource && { membershipSource }),
    ...(positions && { positions }),
    ...(term && { term }),
  };
  return NextResponse.json(user.club);
}
