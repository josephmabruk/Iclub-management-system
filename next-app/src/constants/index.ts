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
  attendanceFor: (id: string) => `/attendance/${id}`,
  project: (id: string) => `/projects/${id}`,
} as const;

/** Links shown in the public site header. The logo links home. */
export const MAIN_NAV = [
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

/** Links shown in the signed-in app sidebar. */
export const APP_NAV = [
  { label: "Home", href: ROUTES.home, ready: true },
  { label: "Members", href: ROUTES.members, ready: true },
  { label: "Leadership", href: ROUTES.leadership, ready: true },
  { label: "Activities", href: ROUTES.activities, ready: true },
  { label: "Attendance", href: ROUTES.attendance, ready: true },
  { label: "Finance", href: ROUTES.finance, ready: false },
  { label: "Records & custody", href: ROUTES.records, ready: false },
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
