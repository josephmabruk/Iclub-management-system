import type {
  ChangeStateRequest,
  RecordItem,
  RecordView,
  RegisterRecordRequest,
  TransferCustodyRequest,
} from "@/types";
import { baseApi } from "./baseApi";

export const recordsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getRecords: build.query<RecordView[], void>({
      query: () => "/records",
      providesTags: ["Record"],
    }),
    registerRecord: build.mutation<RecordItem, RegisterRecordRequest>({
      query: (body) => ({ url: "/records", method: "POST", body }),
      invalidatesTags: ["Record"],
    }),
    transferCustody: build.mutation<RecordItem, TransferCustodyRequest>({
      query: (body) => ({ url: "/records/transfer", method: "POST", body }),
      invalidatesTags: ["Record"],
    }),
    changeRecordState: build.mutation<RecordItem, ChangeStateRequest>({
      query: (body) => ({ url: "/records/state", method: "POST", body }),
      invalidatesTags: ["Record"],
    }),
  }),
});

export const {
  useGetRecordsQuery,
  useRegisterRecordMutation,
  useTransferCustodyMutation,
  useChangeRecordStateMutation,
} = recordsApi;
