import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { ACCESS_LEVELS } from "@/constants"; // NEW
import type {
  Club,
  CreateClubRequest,
  UpdateClubRequest,
  AccessLevel,
} from "@/types";

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
  user.isOwner = true; // NEW: the person who registers the club is its administrator

  return NextResponse.json(user.club, { status: 201 });
}

/** PATCH /api/club: save a later setup step. Only these fields can change. */
export async function PATCH(request: Request) {
  const body = (await request.json()) as UpdateClubRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Create your club first", 404);

  // NEW: only the administrator may change the club's setup
  if (!user.isOwner)
    return errorResponse("Only the club administrator can change setup", 403);

  const { institution, units, membershipSource, positions, term } = body;

  // NEW: every position must have a valid access level
  if (
    positions?.some(
      (p) => p.accessLevel === undefined || !(p.accessLevel in ACCESS_LEVELS),
    )
  )
    return errorResponse("Choose an access level for every position", 400);

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
