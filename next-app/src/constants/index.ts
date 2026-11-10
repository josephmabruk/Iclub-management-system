import type { Permission } from "@/types";

export const SITE = {
  name: "iClub",
  description: "A records system for student club committees.",
  owner: "Info-Space Meta",
} as const;

export const ROUTES = {
  root: "/",
  home: "/home",
  login: "/login",
  register: "/register",
  setup: "/setup",
  about: "/about",
  contact: "/contact",
  dashboard: "/dashboard",
  settings: "/settings",
  members: "/members",
  leadership: "/leadership",
  activities: "/activities",
  attendance: "/attendance",
  records: "/records",
  handovers: "/handovers",
  finance: "/finance",
  membersImport: "/members/import",
  acceptInvitation: "/accept-invitation",
  attendanceFor: (id: string) => `/attendance/${id}`,
  project: (id: string) => `/projects/${id}`,
} as const;

/** Links shown in the public site header. The logo links home. */
export const MAIN_NAV = [
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

/** Links shown in the signed-in app sidebar. */
type NavItem = {
  label: string;
  href: string;
  ready: boolean;
  needs?: Permission;
};

export const APP_NAV: readonly NavItem[] = [
  { label: "Home", href: ROUTES.home, ready: true },
  { label: "Members", href: ROUTES.members, ready: true },
  { label: "Leadership", href: ROUTES.leadership, ready: true },
  { label: "Activities", href: ROUTES.activities, ready: true },
  { label: "Attendance", href: ROUTES.attendance, ready: true },
  {
    label: "Finance",
    href: ROUTES.finance,
    ready: true,
    needs: "finance.view",
  },
  { label: "Records & custody", href: ROUTES.records, ready: true },
  { label: "Handovers", href: ROUTES.handovers, ready: false },
] as const;

export const SETUP_STEPS = [
  { key: "profile", label: "Profile", href: "/setup/profile" },
  { key: "institution", label: "Institution", href: "/setup/institution" },
  { key: "units", label: "Units", href: "/setup/units" },
  { key: "membership", label: "Membership", href: "/setup/membership" },
  { key: "positions", label: "Positions", href: "/setup/positions" },
  { key: "term", label: "Term setup", href: "/setup/term" },
] as const;

//Member data labels
export const MEMBER_STATUS_LABELS = {
  active: "Active",
  departing: "Departing",
  inactive: "Inactive",
} as const;

export const MEMBERSHIP_SOURCES = {
  imported: "import_roster",
  officer: "officer_added",
} as const;

//ATTENDANCE STATUS LABELS
export const ATTENDANCE_LABELS = {
  present: "Present",
  absent: "Absent",
  excused: "Excused",
} as const;

export const ACCESS_LEVELS = {
  administrator: "Administrator",
  treasurer: "Treasurer",
  officeholder: "Officeholder",
  patron: "Patron (read-only)",
} as const;

export const PERMISSIONS = [
  "club.manage",
  "members.manage",
  "members.import",
  "leadership.manage",
  "activities.manage",
  "attendance.record",
  "finance.view",
  "finance.post",
  "records.manage",
  "handover.manage",
] as const;

export const PASSWORD_MIN_LENGTH = 10;

export const DOCUMENT_TYPES = {
  constitution: "Constitution",
  budget: "Budget",
  audit: "Audit",
  minutes: "Minutes",
  brand_file: "Brand file",
  other: "Other",
} as const;

export const RECORD_KINDS = {
  document: "Document",
  asset: "Physical asset",
  account: "Online account",
} as const;
