import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { isDay } from "@/lib/validate";
import type { ChangeStateRequest } from "@/types";

const STATES = ["lost", "disposed", "written_off"];

/** POST /api/records/state: mark lost or disposed, or write off an outstanding item. The item stays on record. */
export async function POST(request: Request) {
  const { id, state, date, reason } =
    (await request.json()) as ChangeStateRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);

  if (!STATES.includes(state))
    return errorResponse("Choose lost, disposed or written off", 400);
  // Writing off needs the administrator's permission set (AC-054.2).
  const denied = forbid(
    user,
    state === "written_off" ? "club.manage" : "records.manage",
  );
  if (denied) return denied;

  const item = (db.records?.[club.id] ?? []).find((r) => r.id === id);
  if (!item) return errorResponse("That item does not exist", 404);
  if (item.state !== "held")
    return errorResponse(
      `This item is already marked ${item.state.replace("_", " ")}`,
      409,
    );
  if (state === "written_off" && !item.outstanding)
    return errorResponse("Only outstanding items can be written off", 409);

  const why = reason?.trim();
  if (!why) return errorResponse("A reason is required", 400);
  if (!isDay(date)) return errorResponse("Enter a valid date", 400);

  item.state = state;
  item.stateNote = why;
  item.stateDate = date;
  item.custodyLog.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    by: user.name,
    fromOfficeId: item.officeId,
    toOfficeId: item.officeId,
    reason: `Marked ${state.replace("_", " ")} on ${date}: ${why}`,
  });
  return NextResponse.json(item);
}
