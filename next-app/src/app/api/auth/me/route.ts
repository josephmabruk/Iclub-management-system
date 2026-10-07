import { NextResponse } from "next/server";
import { errorResponse, getSessionUser } from "@/app/api/_mock/db";

/** GET /api/auth/me: the signed-in user, or 401. */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return errorResponse("Not authenticated", 401);

  return NextResponse.json(user);
}
