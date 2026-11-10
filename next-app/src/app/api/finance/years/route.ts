import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import { isDay } from "@/lib/validate";
import type { BudgetLine, FinancialYear, OpenYearRequest } from "@/types";

/** GET /api/finance/years: every financial year, newest first. */
export async function GET() {
  await delay();
  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.view");
  if (denied) return denied;

  const years = [...(db.financialYears?.[user.club.id] ?? [])].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
  return NextResponse.json(years);
}

/** POST /api/finance/years: open a financial year with a budget. */
export async function POST(request: Request) {
  const { startDate, endDate, lines } =
    (await request.json()) as OpenYearRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.post");
  if (denied) return denied;

  if (!isDay(startDate) || !isDay(endDate))
    return errorResponse("Enter valid start and end dates", 400);
  if (endDate <= startDate)
    return errorResponse("The year must end after it starts", 400);
  if (!Array.isArray(lines) || lines.length === 0)
    return errorResponse("Add at least one budget line", 400);

  const cleaned: BudgetLine[] = [];
  for (const line of lines) {
    const name = line.name?.trim();
    const category = line.category?.trim();
    if (!name || !category)
      return errorResponse(
        "Every budget line needs a name and a category",
        400,
      );
    if (line.direction !== "income" && line.direction !== "expenditure")
      return errorResponse(`Choose income or expenditure for "${name}"`, 400);
    if (!Number.isSafeInteger(line.planned) || line.planned < 0)
      return errorResponse(`"${name}" needs a valid planned amount`, 400);
    cleaned.push({
      id: crypto.randomUUID(),
      name,
      category,
      direction: line.direction,
      planned: line.planned,
    });
  }
  const names = cleaned.map((line) => line.name.toLowerCase());
  if (new Set(names).size !== names.length)
    return errorResponse("Budget line names must be different", 400);

  const list = ((db.financialYears ??= {})[user.club.id] ??= []);
  // AC-040.2: financial years cannot overlap
  if (list.some((y) => y.startDate <= endDate && startDate <= y.endDate))
    return errorResponse("That year overlaps an existing financial year", 409);

  const first = startDate.slice(0, 4);
  const last = endDate.slice(0, 4);
  const year: FinancialYear = {
    id: crypto.randomUUID(),
    name: first === last ? first : `${first}/${last}`,
    startDate,
    endDate,
    status: "open",
    lines: cleaned,
  };
  list.push(year);
  return NextResponse.json(year, { status: 201 });
}
