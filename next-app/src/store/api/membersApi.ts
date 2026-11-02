import type {
  AddMemberRequest,
  Member,
  ImportReport,
  DryRunRequest,
  CommitImportRequest,
  CommitImportResult,
} from "@/types";
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
    dryRunImport: build.mutation<ImportReport, DryRunRequest>({
      query: (body) => ({
        url: "/members/import/dry-run",
        method: "POST",
        body,
      }),
    }),
    commitImport: build.mutation<CommitImportResult, CommitImportRequest>({
      query: (body) => ({
        url: "/members/import/commit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Member", "Home"],
    }),
  }),
});

export const {
  useGetMembersQuery,
  useAddMemberMutation,
  useDryRunImportMutation,
  useCommitImportMutation,
} = membersApi;
