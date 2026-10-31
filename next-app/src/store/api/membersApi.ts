import type { AddMemberRequest, Member } from "@/types";
import { baseApi } from "./baseApi";

export const membersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMembers: build.query<Member[], void>({
      query: () => "/members",
      providesTags: ["Member"],
    }),
    addMember: build.mutation<Member, AddMemberRequest>({
      query: (body) => ({ url: "/members", method: "POST", body }),
      invalidatesTags: ["Member", "Home"],
    }),
  }),
});

export const { useGetMembersQuery, useAddMemberMutation } = membersApi;
