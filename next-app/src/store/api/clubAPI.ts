import type { Club, CreateClubRequest } from "@/types";
import { baseApi } from "./baseApi";

export const clubApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createClub: build.mutation<Club, CreateClubRequest>({
      query: (body) => ({ url: "/club", method: "POST", body }),
      // TODO: tell the cache the "User" data is now out of date
    }),
  }),
});

export const { useCreateClubMutation } = clubApi;
