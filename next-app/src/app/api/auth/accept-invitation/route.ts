import { db, delay, errorResponse, startSession } from "@/app/api/_mock/db";
import { PASSWORD_MIN_LENGTH } from "@/constants";
import type { AcceptInvitationRequest } from "@/types";

/** POST /api/auth/accept-invitation: create the account and sign in. */
export async function POST(request: Request) {
  const { token, password } = (await request.json()) as AcceptInvitationRequest;
  await delay();

  const invitation = db.invitations[token];
  if (!invitation || new Date(invitation.expiresAt).getTime() < Date.now())
    return errorResponse("This invitation is invalid or has expired", 404);
  if (!password || password.length < PASSWORD_MIN_LENGTH)
    return errorResponse(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      400,
    );
  if (db.users.some((u) => u.email.toLowerCase() === invitation.email))
    return errorResponse("An account with this email already exists", 409);

  const owner = db.users.find(
    (u) => u.isOwner && u.club?.id === invitation.clubId,
  );
  const member = (db.members[invitation.clubId] ?? []).find(
    (m) => m.id === invitation.memberId,
  );
  if (!owner?.club || !member)
    return errorResponse("This invitation is no longer valid", 410);

  // Mock shortcut: the invited user shares the owner's club object. A real backend uses a foreign key.
  const user = {
    id: crypto.randomUUID(),
    name: member.fullName,
    email: invitation.email,
    password,
    memberId: member.id,
    club: owner.club,
  };
  db.users.push(user);
  delete db.invitations[token]; // an invitation works once
  return startSession(user);
}
