/** Dates are shown in East Africa Time (SRS), whatever the browser's zone. */
export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  }).format(new Date(iso));
