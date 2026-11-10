import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import type { LedgerEntry, ReverseRequest } from "@/types";

/** POST /api/finance/ledger/reverse: cancel an entry with a linked reversing entry. */
export async function POST(request: Request) {
  const { entryId, reason } = (await request.json()) as ReverseRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.post");
  if (denied) return denied;
  const clubId = user.club.id;

  const ledger = db.ledger?.[clubId] ?? [];
  const original = ledger.find((e) => e.id === entryId);
  if (!original) return errorResponse("That entry does not exist", 404);
  if (original.reversesId)
    return errorResponse(
      "A reversal cannot be reversed. Post a new entry instead.",
      409,
    );
  if (ledger.some((e) => e.reversesId === original.id))
    return errorResponse("This entry has already been reversed", 409);

  const year = (db.financialYears?.[clubId] ?? []).find(
    (y) => y.id === original.yearId,
  );
  if (!year || year.status === "closed")
    return errorResponse("That financial year is closed", 409); // YEAR_CLOSED

  const why = reason?.trim();
  if (!why) return errorResponse("A reason is required", 400);

  const now = new Date().toISOString();
  const reversal: LedgerEntry = {
    id: crypto.randomUUID(),
    yearId: original.yearId,
    direction: original.direction,
    amount: original.amount, // direction and reversesId carry the meaning, never a negative sign
    currency: "KES",
    date: original.date,
    budgetLineId: original.budgetLineId,
    counterparty: original.counterparty,
    description: `Reversal: ${original.description}`,
    receiptRefs: [],
    postedBy: user.name,
    postedAt: now,
    reversesId: original.id,
    history: [
      {
        id: crypto.randomUUID(),
        at: now,
        by: user.name,
        text: `Reversal posted. Reason: ${why}`,
      },
    ],
  };
  ledger.push(reversal);
  return NextResponse.json(reversal, { status: 201 });
}
