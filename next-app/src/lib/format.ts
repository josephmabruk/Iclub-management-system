/** Dates are shown in East Africa Time (SRS), whatever the browser's zone. */
export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date(iso));

/** Today's date in East Africa Time, as YYYY-MM-DD. */
export const todayInNairobi = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: "Africa/Nairobi" });

/** "2026-10-12" shown as "Monday 12 October 2026". */
export const formatDay = (day: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${day}T00:00:00Z`));
