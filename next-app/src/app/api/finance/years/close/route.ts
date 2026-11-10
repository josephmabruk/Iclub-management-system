import { NextResponse } from "next/server";
import {
  db,
  delay,
  errorResponse,
  forbid,
  getSessionRecord,
} from "@/app/api/_mock/db";
import type { CloseYearRequest } from "@/types";

/** POST /api/finance/years/close: a closed year accepts no new entries but stays readable. */
export async function POST(request: Request) {
  const { yearId } = (await request.json()) as CloseYearRequest;
  await delay();

  const user = await getSessionRecord();
  if (!user?.club) return errorResponse("Not signed in", 401);
  const denied = forbid(user, "finance.post");
  if (denied) return denied;

  const year = (db.financialYears?.[user.club.id] ?? []).find(
    (y) => y.id === yearId,
  );
  if (!year) return errorResponse("That financial year does not exist", 404);
  if (year.status === "closed")
    return errorResponse("This year is already closed", 409);

  year.status = "closed";
  return NextResponse.json(year);
}
