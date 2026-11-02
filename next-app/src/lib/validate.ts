export const isDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
export const isTime = (value: string) =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
