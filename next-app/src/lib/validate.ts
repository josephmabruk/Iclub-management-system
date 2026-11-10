export const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
export const isTime = (value: string) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

/** A light screen so a password or key is never typed into a record (CON-002, NFR-012). */
export const looksLikeSecret = (text: string) =>
  /(password|passwd|pwd|passcode|secret|api[_ -]?key|token|pin)\s*(is|[:=])/i.test(
    text,
  );
