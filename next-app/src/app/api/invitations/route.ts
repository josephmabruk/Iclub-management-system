import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { ROUTES } from "@/constants";
import type { Invitation, InviteRequest, InviteResult } from "@/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** POST /api/invitations: invite an officeholder to create their login. */
export async function POST(request: Request) {
  const { memberId, email } = (await request.json()) as InviteRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "leadership.manage");
  if (denied) return denied;

  const address = email?.trim().toLowerCase();
  if (!address || !/^\S+@\S+\.\S+$/.test(address))
    return errorResponse("Enter a valid email address", 400);

  const member = (db.members[user.club.id] ?? []).find(
    (m) => m.id === memberId,
  );
  if (!member) return errorResponse("That member does not exist", 404);
  if (db.users.some((u) => u.email.toLowerCase() === address))
    return errorResponse("An account with this email already exists", 409);
  if (db.users.some((u) => u.memberId === memberId))
    return errorResponse("This member already has an account", 409);

  const token = crypto.randomUUID();
  const invitation: Invitation = {
    token,
    email: address,
    memberId,
    clubId: user.club.id,
    expiresAt: new Date(Date.now() + WEEK_MS).toISOString(),
  };
  db.invitations[token] = invitation;

  const result: InviteResult = {
    link: new URL(
      `${ROUTES.acceptInvitation}?token=${token}`,
      request.url,
    ).toString(),
  };
  return NextResponse.json(result, { status: 201 });
}
