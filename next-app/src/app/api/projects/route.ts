import { NextResponse } from "next/server";
import { db, delay, errorResponse, getSessionUser } from "@/app/api/_mock/db";

/** GET /api/projects */
export async function GET() {
  if (!(await getSessionUser())) return errorResponse("Not authenticated", 401);
  await delay();

  return NextResponse.json(db.projects);
}
