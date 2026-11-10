import type {
  LoginRequest,
  SignupRequest,
  User,
  InvitationInfo,
  AcceptInvitationRequest,
} from "@/types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    login: build.mutation<User, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      // Put the returned user straight into the `getMe` cache so guarded pages render immediately.
      onQueryStarted: async (_body, { dispatch, queryFulfilled }) => {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(authApi.util.upsertQueryData("getMe", undefined, user));
        } catch {
          // The error is exposed through the mutation hook.
        }
      },
    }),
    signup: build.mutation<User, SignupRequest>({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
      onQueryStarted: async (_body, { dispatch, queryFulfilled }) => {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(authApi.util.upsertQueryData("getMe", undefined, user));
        } catch {
          // The error is exposed through the mutation hook.
        }
      },
    }),
    acceptInvitation: build.mutation<User, AcceptInvitationRequest>({
      query: (body) => ({
        url: "/auth/accept-invitation",
        method: "POST",
        body,
      }),
      onQueryStarted: async (_body, { dispatch, queryFulfilled }) => {
        try {
          const { data: user } = await queryFulfilled;
          dispatch(authApi.util.upsertQueryData("getMe", undefined, user));
        } catch {
          // The error is exposed through the mutation hook
        }
      },
    }),
    getInvitationInfo: build.query<InvitationInfo, string>({
      query: (token) => `/invitations/info?token=${encodeURIComponent(token)}`,
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useAcceptInvitationMutation,
  useGetInvitationInfoQuery,
} = authApi;
