import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { AddMemberRequest, Member } from "@/types";

/** GET /api/members: the signed-in user's club register. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);

  return NextResponse.json(db.members[user.club.id] ?? []);
}

/** POST /api/members: add one member by hand (officer-added clubs only). */
export async function POST(request: Request) {
  const { memberNumber, fullName, unitId } =
    (await request.json()) as AddMemberRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const club = user.club;

  if (club.membershipSource !== "officer_added") {
    return errorResponse(
      "This club's membership follows an imported roster. Add members by importing a roster.",
      409,
    );
  }

  const number = memberNumber?.trim();
  const name = fullName?.trim();
  if (!number || !name)
    return errorResponse("Member number and full name are required", 400);

  if (unitId && !club.units.some((unit) => unit.id === unitId))
    return errorResponse("That unit does not exist", 400);

  const list = (db.members[club.id] ??= []);

  // TODO: if a member in `list` already has this number (ignore capitals),
  //       return a 409 error: "A member with this number already exists"
  if (list.some((m) => m.memberNumber.toLowerCase() === number.toLowerCase()))
    return errorResponse("A member with this number already exists", 409);

  const member: Member = {
    id: crypto.randomUUID(),
    memberNumber: number,
    fullName: name,
    unitId: unitId || null,
    status: "active",
    history: [
      {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        by: user.name,
        text: "Added to the register",
      },
    ],
  };
  list.push(member);
  return NextResponse.json(member, { status: 201 });
}
