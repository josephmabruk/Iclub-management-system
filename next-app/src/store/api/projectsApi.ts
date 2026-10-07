import type { Project } from "@/types";
import { baseApi } from "./baseApi";

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
    getProject: build.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectsQuery, useGetProjectQuery } = projectsApi;
