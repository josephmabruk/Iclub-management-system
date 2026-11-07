// Shared TypeScript types. Keep these in sync with your backend's API responses.
import {
  MEMBER_STATUS_LABELS,
  ATTENDANCE_LABELS,
  MEMBERSHIP_SOURCES,
  ACCESS_LEVELS,
  PERMISSIONS,
} from "@/constants";

export type User = {
  id: string;
  name: string;
  email: string;
  club?: Club;
  permissions?: Permission[];
  offices?: string[];
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
  accessLevel?: AccessLevel;
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

//TYPES FOR MEMBERS PAGE
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

//TYPES FOR THE CASE OF IMPORT ROSTER
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
  { action: "exclude" } | { action: "match_unit"; unitId: string };

export type CommitImportRequest = {
  reportId: string;
  resolutions: Record<number, RowResolution>;
};

export type CommitImportResult = {
  added: number;
  departed: number;
  excluded: number;
};

//TYPES FOR IMPORT ROSTER
export type Appointment = {
  id: string;
  positionId: string;
  memberId: string;
  termName: string;
  appointedAt: string;
  appointedBy: string;
  endedAt?: string;
};

export type LeadershipStatus = "verified" | "vacant" | "attention";

export type LeadershipRow = {
  positionId: string;
  positionName: string;
  unitId: string | null;
  requiredOffice: boolean;
  inVerifiedRoster: boolean;
  status: LeadershipStatus;
  holder: { memberId: string; fullName: string; memberNumber: string } | null;
  hasAccount: boolean;
};

export type AppointRequest = { positionId: string; memberId: string };
export type EndAppointmentRequest = { positionId: string };

//ATTENDANCE TYPES
export type AttendanceStatus = keyof typeof ATTENDANCE_LABELS;
export type ActivityStatus = "scheduled" | "cancelled";

export type Activity = {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  location: string;
  unitId: string | null; // null = the whole club
  status: ActivityStatus;
  cancelReason?: string;
  history: MemberEvent[];
};

export type CreateActivityRequest = Pick<
  Activity,
  "name" | "date" | "startTime" | "endTime" | "location" | "unitId"
>;
export type RescheduleRequest = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
};
export type CancelRequest = { id: string; reason: string };

export type AttendanceMark = {
  status: AttendanceStatus;
  by: string;
  at: string;
};
export type AttendanceRow = {
  memberId: string;
  memberNumber: string;
  fullName: string;
  unitId: string | null;
  mark: AttendanceMark | null;
};
export type AttendanceSheet = { activity: Activity; rows: AttendanceRow[] };
export type MarkRequest = {
  activityId: string;
  memberId: string;
  status: AttendanceStatus;
};

export type ParticipationRow = {
  memberId: string;
  memberNumber: string;
  fullName: string;
  inScope: number;
  present: number;
  excused: number;
  absent: number;
  rate: number | null;
};

export type AccessLevel = keyof typeof ACCESS_LEVELS;

export type Permission = (typeof PERMISSIONS)[number];

export type Invitation = {
  token: string;
  email: string;
  memberId: string;
  clubId: string;
  expiresAt: string;
};

export type InviteRequest = { memberId: string; email: string };

export type InviteResult = { link: string };

export type InvitationInfo = {
  email: string;
  memberName: string;
  clubName: string;
};

export type AcceptInvitationRequest = { token: string; password: string };
