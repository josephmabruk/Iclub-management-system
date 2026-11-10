import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import type { AddReceiptRequest } from "@/types";

/** POST /api/finance/ledger/receipt: add evidence. Financial values never change (AC-042.2). */
export async function POST(request: Request) {
  const { entryId, reference } = (await request.json()) as AddReceiptRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.post");
  if (denied) return denied;

  const entry = (db.ledger?.[user.club.id] ?? []).find((e) => e.id === entryId);
  if (!entry) return errorResponse("That entry does not exist", 404);
  if (entry.reversesId)
    return errorResponse("A reversal does not need a receipt", 409);

  const ref = reference?.trim();
  if (!ref) return errorResponse("Enter a receipt reference", 400);
  if (ref.length > 200) return errorResponse("That reference is too long", 400);
  if (entry.receiptRefs.some((r) => r.toLowerCase() === ref.toLowerCase()))
    return errorResponse("That reference is already on this entry", 409);

  entry.receiptRefs.push(ref);
  entry.history.push({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    by: user.name,
    text: `Receipt reference added: ${ref}`,
  });
  return NextResponse.json(entry);
}
