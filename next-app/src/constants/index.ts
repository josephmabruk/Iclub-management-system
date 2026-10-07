// Application-wide constants

export const SITE = {
  name: "Next Template",
  description:
    "A Next.js + Redux starter for apps that talk to a separate backend.",
  owner: "Info-Space Meta",
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
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
