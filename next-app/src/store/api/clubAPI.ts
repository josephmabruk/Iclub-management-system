import type { Club, CreateClubRequest, UpdateClubRequest } from "@/types";
import { baseApi } from "./baseApi";
import { authApi } from "./authApi";

export const clubApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createClub: build.mutation<Club, CreateClubRequest>({
      query: (body) => ({ url: "/club", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    // NEW: add this entry
    updateClub: build.mutation<Club, UpdateClubRequest>({
      query: (body) => ({ url: "/club", method: "PATCH", body }),
      invalidatesTags: ["User"],
    }),

    completeClub: build.mutation<Club, void>({
      query: () => ({ url: "/club/complete", method: "POST" }),
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data: club } = await queryFulfilled;
          dispatch(
            authApi.util.updateQueryData("getMe", undefined, (draft) => {
              draft.club = club;
            }),
          );
        } catch {}
      },
    }),
  }),
});

// CHANGED: export both hooks
export const {
  useCreateClubMutation,
  useUpdateClubMutation,
  useCompleteClubMutation,
} = clubApi;
