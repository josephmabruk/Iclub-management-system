// Shared TypeScript types. Keep these in sync with your backend's API responses.
import type { MEMBER_STATUS_LABELS, MEMBERSHIP_SOURCES } from "@/constants";


export type User = {
  id: string;
  name: string;
  email: string;
  club?: Club;
};

export type ProjectStatus = "active" | "paused" | "done";

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignupRequest = LoginRequest & {
  name: string;
};

export type Club = {
  id: string;
  name: string;
  readonly shortCode: string;
  purpose: string;
  foundingDate: string;
  institution?: string;
  units: Unit[];
  membershipSource?: MembershipSource;
  positions: PositionDraft[];
  term?: Term;
  setupStatus: SetupStatus;
};

export type CreateClubRequest = Pick<
  Club,
  "name" | "shortCode" | "purpose" | "foundingDate"
>;
//Partial makes every field in the list optional, so one request can carry just the institution, and another just the units.
export type UpdateClubRequest = Partial<
 Pick<Club, "institution" | "units" | "membershipSource" | "positions" | "term">
>;

//THE TYPES FOR THE FIELD INSIDE THE CLUB
export type SetupStatus = "in_progress" | "complete";

export type MembershipSource =
  (typeof MEMBERSHIP_SOURCES)[keyof typeof MEMBERSHIP_SOURCES];

export type Unit = {
  id: string;
  name: string;
};

export type PositionDraft = {
  id: string;
  name: string;
  unitId: string | null;
  requiredOffice: boolean;
  inVerifiedRoster: boolean;
};

export type Term = {
  name: string;
  startDate: string;
  endDate: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  updatedAt: string;
};
