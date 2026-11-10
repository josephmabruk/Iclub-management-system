import type {
  FinancialYear,
  LedgerEntry,
  OpenYearRequest,
  RecordEntryRequest,
  ReverseRequest,
  AddReceiptRequest,
  CloseYearRequest,
  BudgetReport,
} from "@/types";
import { baseApi } from "./baseApi";

export const financeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getYears: build.query<FinancialYear[], void>({
      query: () => "/finance/years",
      providesTags: ["Finance"],
    }),
    openYear: build.mutation<FinancialYear, OpenYearRequest>({
      query: (body) => ({ url: "/finance/years", method: "POST", body }),
      invalidatesTags: ["Finance"],
    }),
    getLedger: build.query<LedgerEntry[], string>({
      query: (yearId) => `/finance/ledger?yearId=${encodeURIComponent(yearId)}`,
      providesTags: ["Finance"],
    }),
    recordEntry: build.mutation<LedgerEntry, RecordEntryRequest>({
      query: (body) => ({ url: "/finance/ledger", method: "POST", body }),
      invalidatesTags: ["Finance"],
    }),
    reverseEntry: build.mutation<LedgerEntry, ReverseRequest>({
      query: (body) => ({
        url: "/finance/ledger/reverse",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Finance"],
    }),
    addReceipt: build.mutation<LedgerEntry, AddReceiptRequest>({
      query: (body) => ({
        url: "/finance/ledger/receipt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Finance"],
    }),
    closeYear: build.mutation<FinancialYear, CloseYearRequest>({
      query: (body) => ({ url: "/finance/year/close", method: "POST", body }),
      invalidatesTags: ["Finance"],
    }),
    getBudgetReport: build.query<
      BudgetReport,
      { yearId: string; from: string; to: string }
    >({
      query: ({ yearId, from, to }) =>
        `/finance/report?yearId=${encodeURIComponent(yearId)}&from=${from}&to=${to}`,
      providesTags: ["Finance"],
    }),
  }),
});

export const {
  useGetYearsQuery,
  useOpenYearMutation,
  useGetLedgerQuery,
  useRecordEntryMutation,
  useReverseEntryMutation,
  useAddReceiptMutation,
  useCloseYearMutation,
  useGetBudgetReportQuery,
} = financeApi;
