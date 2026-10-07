import { db, delay, errorResponse, startSession } from "@/app/api/_mock/db";
import type { LoginRequest } from "@/types";

/** POST /api/auth/login */
export async function POST(request: Request) {
  const { email, password } = (await request.json()) as LoginRequest;
  await delay();

  const user = db.users.find(
    (storedUser) =>
      storedUser.email === email && storedUser.password === password,
  );
  if (!user) return errorResponse("Invalid email or password", 401);

  return startSession(user);
}
