// Shared TypeScript types. Keep these in sync with your backend's API responses.

export type User = {
  id: string;
  name: string;
  email: string;
  club?: Club;
};

export type ProjectStatus = "active" | "paused" | "done";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  updatedAt: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  name: string;
  club?: Club;
};

export type Club = {
  id: string;
  name: string;
  readonly shortCode: string;
  purpose: string;
  foundingDate: string;
  institution?: string;
  setupStatus: SetupStatus;
};

export type SetupStatus = "in_progress" | "complete";
