/** "12,500.50" becomes 1250050 cents. Returns null for anything that is not a plain amount. */
export const toMinor = (text: string): number | null => {
  const cleaned = text.replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, fraction = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
};

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(
    cents / 100,
  );
