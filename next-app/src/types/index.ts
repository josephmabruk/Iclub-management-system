// Shared TypeScript types. Keep these in sync with your backend's API responses.
import { MEMBER_STATUS_LABELS } from "@/constants";

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

export type UpdateClubRequest = Partial<
  Pick<
    Club,
    "institution" | "units" | "membershipSource" | "positions" | "term"
  >
>;

//THE TYPES FOR THE FIELD INSIDE THE CLUB
export type SetupStatus = "in_progress" | "complete";

export type MembershipSource = "import_roster" | "officer_added";

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

//what is shown on the home page
export type HomeSummary = {
  activeMembers: number;
  leadershipVacancies: number;
  upcomingActivities: {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
  }[];
};

export type MemberStatus = keyof typeof MEMBER_STATUS_LABELS;

export type Member = {
  id: string;
  memberNumber: string;
  fullName: string;
  unitId: string | null;
  status: MemberStatus;
  history: MemberEvent[];
};

export type AddMemberRequest = Pick<
  Member,
  "memberNumber" | "fullName" | "unitId"
>;

export type MemberEvent = {
  id: string;
  at: string;
  by: string;
  text: string;
};

export type ImportRowInput = {
  rowNumber: number;
  memberNumber: string;
  fullName: string;
  unit: string;
};

export type ImportIssue = {
  rowNumber: number;
  memberNumber: string;
  fullName: string;
  reason: string;
  kind: "duplicate" | "missing" | "unit";
};

export type ImportAddition = {
  rowNumber: number;
  memberNumber: string;
  fullName: string;
  unitId: string | null;
};

export type ImportDeparture = {
  memberId: string;
  memberNumber: string;
  fullName: string;
};

export type ImportReport = {
  id: string;
  createdAt: string;
  expiresAt: string;
  totalRows: number;
  additions: ImportAddition[];
  departures: ImportDeparture[];
  unchanged: number;
  duplicates: ImportIssue[];
  unmatched: ImportIssue[];
};

export type DryRunRequest = { rows: ImportRowInput[] };

export type RowResolution =
  | { action: "exclude" }
  | { action: "match_unit"; unitId: string };

export type CommitImportRequest = {
  reportId: string;
  resolutions: Record<number, RowResolution>;
};

export type CommitImportResult = {
  added: number;
  departed: number;
  excluded: number;
};
