import type {
  AppointRequest,
  Appointment,
  EndAppointmentRequest,
  LeadershipRow,
} from "@/types";
import { baseApi } from "./baseApi";

export const leadershipApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeadership: build.query<LeadershipRow[], void>({
      query: () => "/leadership",
      providesTags: ["Leadership"],
    }),
    appoint: build.mutation<Appointment, AppointRequest>({
      query: (body) => ({ url: "/leadership/appoint", method: "POST", body }),
      invalidatesTags: ["Leadership", "Member", "Home"],
    }),
    endAppointment: build.mutation<Appointment, EndAppointmentRequest>({
      query: (body) => ({ url: "/leadership/end", method: "POST", body }),
      invalidatesTags: ["Leadership", "Member", "Home"],
    }),
  }),
});

export const {
  useGetLeadershipQuery,
  useAppointMutation,
  useEndAppointmentMutation,
} = leadershipApi;
