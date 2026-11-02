import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionRecord } from "@/app/api/_mock/db";
import { todayInNairobi } from "@/lib/format";
import type { HomeSummary } from "@/types";

/** GET /api/home: the numbers shown on the Home screen. */
export async function GET() {
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const club = user.club;

  const members = db.members[club.id] ?? [];
  const current = (db.appointments?.[club.id] ?? []).filter(
    (a) => !a.endedAt && a.termName === club.term?.name,
  );
  const today = todayInNairobi();

  const summary: HomeSummary = {
    activeMembers: members.filter((m) => m.status === "active").length,
    // A position is vacant when it has no current appointment.
    leadershipVacancies: club.positions.filter(
      (p) => !current.some((a) => a.positionId === p.id),
    ).length,
    upcomingActivities: (db.activities?.[club.id] ?? [])
      .filter((a) => a.status === "scheduled" && a.date >= today)
      .sort((a, b) =>
        (a.date + a.startTime).localeCompare(b.date + b.startTime),
      )
      .slice(0, 5)
      .map(({ id, name, date, startTime, endTime }) => ({
        id,
        name,
        date,
        startTime,
        endTime,
      })),
  };
  return NextResponse.json(summary);
}
