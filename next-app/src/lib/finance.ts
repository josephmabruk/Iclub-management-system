import type { LedgerEntry } from "@/types";

/** Income, expenditure and balance over a list of entries. A reversal cancels its original. */
export const totals = (entries: LedgerEntry[]) => {
  let income = 0;
  let expenditure = 0;
  for (const entry of entries) {
    const flow = entry.reversesId ? -entry.amount : entry.amount;
    if (entry.direction === "income") income += flow;
    else expenditure += flow;
  }
  return { income, expenditure, balance: income - expenditure };
};

export const isUnevidenced = (entry: LedgerEntry) =>
  !entry.reversesId && !entry.reversed && entry.receiptRefs.length === 0;
