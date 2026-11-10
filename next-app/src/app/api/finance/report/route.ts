import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { isDay } from "@/lib/validate";
import type { BudgetReport, BudgetReportRow } from "@/types";

/** GET /api/finance/report?yearId=&from=&to=: planned against actual per budget line. */
export async function GET(request: Request) {
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.view");
  if (denied) return denied;

  const params = new URL(request.url).searchParams;
  const year = (db.financialYears?.[user.club.id] ?? []).find(
    (y) => y.id === params.get("yearId"),
  );
  if (!year) return errorResponse("That financial year does not exist", 404);

  const from = params.get("from") || year.startDate;
  const to = params.get("to") || year.endDate;
  if (!isDay(from) || !isDay(to))
    return errorResponse("Enter a valid date range", 400);
  if (from > to)
    return errorResponse("The range must start before it ends", 400);
  if (from < year.startDate || to > year.endDate)
    return errorResponse("The range must be inside the financial year", 400);

  const entries = (db.ledger?.[user.club.id] ?? []).filter(
    (e) => e.yearId === year.id && e.date >= from && e.date <= to,
  );

  const rows: BudgetReportRow[] = year.lines.map((line) => {
    // A reversal subtracts, so a cancelled entry nets to zero.
    const actual = entries
      .filter((e) => e.budgetLineId === line.id)
      .reduce((sum, e) => sum + (e.reversesId ? -e.amount : e.amount), 0);
    const variance = actual - line.planned;

    // variancePct = variance as a whole-number percentage of line.planned
    //       (Math.round), or null when line.planned is 0. Replace the null below.
    const variancePct: number | null =
      line.planned === 0 ? null : Math.round((variance / line.planned) * 100);

    return {
      lineId: line.id,
      name: line.name,
      category: line.category,
      direction: line.direction,
      planned: line.planned,
      actual,
      variance,
      variancePct,
      attention:
        line.direction === "expenditure"
          ? actual > line.planned
          : actual < line.planned,
    };
  });

  const report: BudgetReport = { from, to, rows };
  return NextResponse.json(report);
}
