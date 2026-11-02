import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import type { LeadershipRow } from "@/types";

/** GET /api/leadership: every position with its current holder. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const club = user.club;

  const members = db.members[club.id] ?? [];
  const current = (db.appointments[club.id] ?? []).filter(
    (a) => !a.endedAt && a.termName === club.term?.name,
  );

  const rows: LeadershipRow[] = club.positions.map((position) => {
    const appointment = current.find((a) => a.positionId === position.id);
    const holder = appointment
      ? members.find((m) => m.id === appointment.memberId)
      : undefined;

    return {
      positionId: position.id,
      positionName: position.name,
      unitId: position.unitId,
      requiredOffice: position.requiredOffice,
      inVerifiedRoster: position.inVerifiedRoster,
      holder: holder
        ? {
            memberId: holder.id,
            fullName: holder.fullName,
            memberNumber: holder.memberNumber,
          }
        : null,
      status: !holder
        ? "vacant"
        : holder.status === "active"
          ? "verified"
          : "attention",
    };
  });

  return NextResponse.json(rows);
}
