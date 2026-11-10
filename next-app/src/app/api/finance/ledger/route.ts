import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { isDay } from "@/lib/validate";
import type { LedgerEntry, RecordEntryRequest } from "@/types";

/** GET /api/finance/ledger?yearId=...: a year's entries, newest first. */
export async function GET(request: Request) {
  await delay();
  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.view");
  if (denied) return denied;

  const yearId = new URL(request.url).searchParams.get("yearId");
  const all = db.ledger?.[user.club.id] ?? [];
  const entries = all
    .filter((entry) => entry.yearId === yearId)
    .sort((a, b) => (b.date + b.postedAt).localeCompare(a.date + a.postedAt))
    // "reversed" is worked out, not stored, so the original is never edited.
    .map((entry) => ({
      ...entry,
      reversed: all.some((other) => other.reversesId === entry.id),
    }));
  return NextResponse.json(entries);
}

/** POST /api/finance/ledger: record one entry. */
export async function POST(request: Request) {
  const body = (await request.json()) as RecordEntryRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.post");
  if (denied) return denied;
  const clubId = user.club.id;

  if (body.direction !== "income" && body.direction !== "expenditure")
    return errorResponse("Choose income or expenditure", 400);
  // AMOUNT_INVALID: direction expresses the flow, so the amount is never zero or negative
  if (!Number.isSafeInteger(body.amount) || body.amount <= 0)
    return errorResponse("Enter an amount greater than zero", 400);
  if (!isDay(body.date)) return errorResponse("Enter a valid date", 400);

  const counterparty = body.counterparty?.trim();
  const description = body.description?.trim();
  if (!counterparty || !description)
    return errorResponse("Counterparty and description are required", 400);

  const year = (db.financialYears?.[clubId] ?? []).find(
    (y) => y.startDate <= body.date && body.date <= y.endDate,
  );
  if (!year)
    return errorResponse(
      "No financial year covers that date. Open one first.",
      409,
    );
  // YEAR_CLOSED
  if (year.status === "closed")
    return errorResponse("That date falls in a closed financial year", 409);

  const line = year.lines.find((l) => l.id === body.budgetLineId);
  if (!line) return errorResponse("Choose a budget line", 400);
  if (line.direction !== body.direction)
    return errorResponse(`"${line.name}" is an ${line.direction} line`, 400);

  const receipt = body.receiptRef?.trim();
  const now = new Date().toISOString();
  const entry: LedgerEntry = {
    id: crypto.randomUUID(),
    yearId: year.id,
    direction: body.direction,
    amount: body.amount,
    currency: "KES",
    date: body.date,
    budgetLineId: line.id,
    counterparty,
    description,
    receiptRefs: receipt ? [receipt] : [],
    postedBy: user.name,
    postedAt: now,
    history: [
      { id: crypto.randomUUID(), at: now, by: user.name, text: "Posted" },
    ],
  };
  ((db.ledger ??= {})[clubId] ??= []).push(entry);
  return NextResponse.json(entry, { status: 201 });
}
