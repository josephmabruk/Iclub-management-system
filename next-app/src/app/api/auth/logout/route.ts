import { endSession } from "@/app/api/_mock/db";

/** POST /api/auth/logout */
export async function POST() {
  return endSession();
}
