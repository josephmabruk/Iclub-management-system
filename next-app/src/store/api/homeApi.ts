import type { HomeSummary } from "@/types";
import { baseApi } from "./baseApi";

export const homeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHomeSummary: build.query<HomeSummary, void>({
      query: () => "/home",
    }),
  }),
});

export const { useGetHomeSummaryQuery } = homeApi;