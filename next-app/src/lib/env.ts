/**
 * Public environment variables, read in one place.
 *
 * NEXT_PUBLIC_* values are inlined into the browser bundle at build time,
 * so always read them with the full `process.env.NEXT_PUBLIC_...` expression.
 * Never put secrets in NEXT_PUBLIC_* variables.
 */
export const env = {
  /** Base URL of your backend API. Defaults to the mock API in src/app/api. */
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
} as const;
