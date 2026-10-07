/**
 * MOCK BACKEND: an in-memory stand-in for your real API so the template works out of the box.
 * Data resets when the server restarts.
 *
 * When your backend is ready: set NEXT_PUBLIC_API_URL in .env.local and delete the src/app/api folder.
 */
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Project, User } from "@/types";

type StoredUser = User & { password: string };
type MockDb = { users: StoredUser[]; projects: Project[] };

const SESSION_COOKIE = "session";

// Kept on globalThis so every route handler shares the same data during development.
const globalForMock = globalThis as typeof globalThis & { mockDb?: MockDb };

export const db: MockDb = (globalForMock.mockDb ??= {
  users: [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      password: "password",
    },
  ],
  projects: [
    {
      id: "1",
      name: "Website redesign",
      description: "Refresh the marketing site with the new brand.",
      status: "active",
      updatedAt: "2026-09-28T10:00:00.000Z",
    },
    {
      id: "2",
      name: "Mobile app",
      description: "Ship the first version of the iOS and Android apps.",
      status: "active",
      updatedAt: "2026-09-20T10:00:00.000Z",
    },
    {
      id: "3",
      name: "Billing migration",
      description: "Move subscriptions to the new payment provider.",
      status: "paused",
      updatedAt: "2026-08-14T10:00:00.000Z",
    },
    {
      id: "4",
      name: "Onboarding emails",
      description: "A welcome email sequence for new sign-ups.",
      status: "done",
      updatedAt: "2026-07-02T10:00:00.000Z",
    },
  ],
});

/** Remove the password before sending a user to the browser. */
const toPublicUser = ({ id, name, email }: StoredUser): User => ({
  id,
  name,
  email,
});

/** Respond with the user and set the session cookie. The cookie is just the user id, which is fine for a mock only! */
export const startSession = (user: StoredUser) => {
  const response = NextResponse.json(toPublicUser(user));
  response.cookies.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
};

export const endSession = () => {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(SESSION_COOKIE);
  return response;
};

/** The user that owns the current request's session cookie, if any. */
export const getSessionUser = async () => {
  const userId = (await cookies()).get(SESSION_COOKIE)?.value;
  const user = db.users.find((storedUser) => storedUser.id === userId);
  return user && toPublicUser(user);
};

/** Error responses use `{ message }`, which is what `getErrorMessage` in lib/utils expects. */
export const errorResponse = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

/** Fake network latency so loading states are visible. */
export const delay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));
