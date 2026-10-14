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
  project: (id: string) => `/projects/${id}`,
} as const;

/** Links shown in the public site header. The logo links home. */
export const MAIN_NAV = [
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact },
] as const;

/** Links shown in the signed-in app sidebar. */
export const APP_NAV = [
  { label: "Dashboard", href: ROUTES.dashboard },
  { label: "Settings", href: ROUTES.settings },
] as const;
