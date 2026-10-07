import { db, delay, errorResponse, startSession } from "@/app/api/_mock/db";
import type { SignupRequest } from "@/types";

/** POST /api/auth/signup */
export async function POST(request: Request) {
  const { name, email, password } = (await request.json()) as SignupRequest;
  await delay();

  if (!name || !email || !password)
    return errorResponse("Name, email and password are required", 400);
  if (db.users.some((storedUser) => storedUser.email === email)) {
    return errorResponse("An account with this email already exists", 409);
  }

  const user = { id: crypto.randomUUID(), name, email, password };
  db.users.push(user);

  return startSession(user);
}
