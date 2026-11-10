import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import type { TransferCustodyRequest } from "@/types";

/** POST /api/records/transfer: move an item to another office. The log is append-only. */
export async function POST(request: Request) {
  const { id, toOfficeId, reason } =
    (await request.json()) as TransferCustodyRequest;
  await delay();

  const user = await getSessionRecord();
  const club = user?.club;
  if (!user || !club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "records.manage");
  if (denied) return denied;

  const item = (db.records?.[club.id] ?? []).find((r) => r.id === id);
  if (!item) return errorResponse("That item does not exist", 404);
  if (item.state !== "held")
    return errorResponse("Only items in custody can be transferred", 409);
  if (!club.positions.some((p) => p.id === toOfficeId))
    return errorResponse("Choose the receiving office", 400);
  if (toOfficeId === item.officeId)
    return errorResponse("That office already holds this item", 409);

  const why = reason?.trim();
  if (!why) return errorResponse("A reason is required", 400);

  item.custodyLog.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    by: user.name,
    fromOfficeId: item.officeId,
    toOfficeId,
    reason: why,
  });
  item.officeId = toOfficeId; // an item has exactly one office at a time (AC-052.2)
  return NextResponse.json(item);
}
