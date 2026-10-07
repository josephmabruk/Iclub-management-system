import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { env } from "@/lib/env";

/**
 * The single RTK Query API that talks to your backend.
 * Each feature adds its endpoints with `baseApi.injectEndpoints` (see authApi.ts, projectsApi.ts).
 */
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: env.apiUrl,
    // Send cookies with every request (session/cookie auth).
    // A backend on another origin must allow credentials in its CORS settings.
    credentials: "include",
    // Using bearer tokens instead? Attach them here:
    // prepareHeaders: (headers) => {
    //   headers.set("Authorization", `Bearer ${token}`);
    //   return headers;
    // },
  }),
  tagTypes: ["User", "Project"],
  endpoints: () => ({}),
});
