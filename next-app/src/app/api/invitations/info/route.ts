import { NextResponse } from "next/server";
import { db, delay, errorResponse } from "@/app/api/_mock/db";
import type { InvitationInfo } from "@/types";

/** GET /api/invitations/info?token=...: what the accept page needs to show. */
export async function GET(request: Request) {
  await delay();
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const invitation = db.invitations[token];
  if (!invitation || new Date(invitation.expiresAt).getTime() < Date.now())
    return errorResponse("This invitation is invalid or has expired", 404);

  const owner = db.users.find(
    (u) => u.isOwner && u.club?.id === invitation.clubId,
  );
  const member = (db.members[invitation.clubId] ?? []).find(
    (m) => m.id === invitation.memberId,
  );
  const info: InvitationInfo = {
    email: invitation.email,
    memberName: member?.fullName ?? "",
    clubName: owner?.club?.name ?? "",
  };
  return NextResponse.json(info);
}
