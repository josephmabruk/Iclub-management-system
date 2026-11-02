// A cell starting with = + - or @ can run as a formula in Excel. Neutralise it.
const safe = (value: string) => (/^[=+\-@]/.test(value) ? `'${value}` : value);
const quote = (value: string) => `"${safe(value).replaceAll('"', '""')}"`;

/** Build a CSV in the browser and save it as a file. */
export const downloadCsv = (filename: string, rows: string[][]) => {
  const text = rows.map((row) => row.map(quote).join(",")).join("\r\n");
  const url = URL.createObjectURL(
    new Blob([text], { type: "text/csv;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
