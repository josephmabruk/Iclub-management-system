import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { AppointRequest, Appointment } from "@/types";
import { forbid } from "@/app/api/_mock/db";

/** POST /api/leadership/appoint: put an active member into an office. */
export async function POST(request: Request) {
  const { positionId, memberId } = (await request.json()) as AppointRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club?.term)
    return errorResponse("Finish club setup first", 409);
  const termName = club.term.name;

  const denied = forbid(user, "leadership.manage");
  if (denied) return denied;

  const position = club.positions.find((p) => p.id === positionId);
  if (!position) return errorResponse("That position does not exist", 404);

  const members = db.members[club.id] ?? [];
  const member = members.find((m) => m.id === memberId);
  if (!member) return errorResponse("That member does not exist", 404);
  if (member.status !== "active")
    return errorResponse(
      `${member.fullName} is ${member.status}. Choose an active member to fill this office.`,
      409,
    );

  const list = (db.appointments[club.id] ??= []);
  const taken = list.find(
    (a) => a.positionId === positionId && !a.endedAt && a.termName === termName,
  );
  if (taken) {
    const holder = members.find((m) => m.id === taken.memberId);
    return errorResponse(
      `${holder?.fullName ?? "Someone"} already holds ${position.name} for Term ${termName}. Choose a vacant position.`,
      409,
    );
  }

  const now = new Date().toISOString();
  const appointment: Appointment = {
    id: crypto.randomUUID(),
    positionId,
    memberId,
    termName,
    appointedAt: now,
    appointedBy: user.name,
  };
  list.push(appointment);

  member.history.push({
    id: crypto.randomUUID(),
    at: now,
    by: user.name,
    text: `Appointed ${position.name}, Term ${termName}`,
  });

  return NextResponse.json(appointment, { status: 201 });
}
