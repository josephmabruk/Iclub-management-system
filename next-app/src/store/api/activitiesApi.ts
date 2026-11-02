import type {
  Activity,
  AttendanceMark,
  AttendanceSheet,
  CancelRequest,
  CreateActivityRequest,
  MarkRequest,
  ParticipationRow,
  RescheduleRequest,
} from "@/types";
import { baseApi } from "./baseApi";

export const activitiesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivities: build.query<Activity[], void>({
      query: () => "/activities",
      providesTags: ["Activity"],
    }),
    createActivity: build.mutation<Activity, CreateActivityRequest>({
      query: (body) => ({ url: "/activities", method: "POST", body }),
      invalidatesTags: ["Activity", "Home"],
    }),
    rescheduleActivity: build.mutation<Activity, RescheduleRequest>({
      query: (body) => ({
        url: "/activities/reschedule",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Activity", "Attendance", "Home"],
    }),
    cancelActivity: build.mutation<Activity, CancelRequest>({
      query: (body) => ({ url: "/activities/cancel", method: "POST", body }),
      invalidatesTags: ["Activity", "Attendance", "Home"],
    }),
    getAttendanceSheet: build.query<AttendanceSheet, string>({
      query: (activityId) =>
        `/attendance?activityId=${encodeURIComponent(activityId)}`,
      providesTags: ["Attendance"],
    }),
    markAttendance: build.mutation<AttendanceMark, MarkRequest>({
      query: (body) => ({ url: "/attendance/mark", method: "POST", body }),
      // Optimistic: show the tap at once, undo it if the server refuses.
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const patch = dispatch(
          activitiesApi.util.updateQueryData(
            "getAttendanceSheet",
            arg.activityId,
            (draft) => {
              const row = draft.rows.find((r) => r.memberId === arg.memberId);
              if (row)
                row.mark = {
                  status: arg.status,
                  by: "You",
                  at: new Date().toISOString(),
                };
            },
          ),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Attendance"],
    }),
    getParticipation: build.query<ParticipationRow[], void>({
      query: () => "/participation",
      providesTags: ["Attendance", "Activity"],
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useCreateActivityMutation,
  useRescheduleActivityMutation,
  useCancelActivityMutation,
  useGetAttendanceSheetQuery,
  useMarkAttendanceMutation,
  useGetParticipationQuery,
} = activitiesApi;
