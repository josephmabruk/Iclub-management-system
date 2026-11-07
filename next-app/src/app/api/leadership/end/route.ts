import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { EndAppointmentRequest } from "@/types";
import { forbid } from "@/app/api/_mock/db";

/** POST /api/leadership/end: the holder leaves office. The record is kept. */
export async function POST(request: Request) {
  const { positionId } = (await request.json()) as EndAppointmentRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club?.term) return errorResponse("Not signed in", 401);

  const denied = forbid(user, "leadership.manage");
  if (denied) return denied;

  const appointment = (db.appointments[club.id] ?? []).find(
    (a) =>
      a.positionId === positionId &&
      !a.endedAt &&
      a.termName === club.term?.name,
  );
  if (!appointment) return errorResponse("That position has no holder", 404);

  const now = new Date().toISOString();
  appointment.endedAt = now; // nothing is deleted

  const position = club.positions.find((p) => p.id === positionId);
  const member = (db.members[club.id] ?? []).find(
    (m) => m.id === appointment.memberId,
  );
  member?.history.push({
    id: crypto.randomUUID(),
    at: now,
    by: user.name,
    text: `Left office: ${position?.name ?? "a position"}`,
  });

  return NextResponse.json(appointment);
}
