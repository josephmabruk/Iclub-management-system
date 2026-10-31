"use client";

import Papa from "papaparse";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

type Row = Record<string, string>;
type Mapping = { memberNumber: string; fullName: string; unit: string };

const guessColumn = (headers: string[], words: string[]) =>
  headers.find((header) =>
    words.some((word) => header.toLowerCase().includes(word)),
  ) ?? "";

const cell = (row: Row, column: string) => (column ? (row[column] ?? "") : "");

type ColumnSelectProps = {
  id: string;
  label: string;
  value: string;
  headers: string[];
  emptyLabel: string;
  onChange: (value: string) => void;
};

const ColumnSelect = ({
  id,
  label,
  value,
  headers,
  emptyLabel,
  onChange,
}: ColumnSelectProps) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm font-medium">
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
    >
      <option value="">{emptyLabel}</option>
      {headers.map((header) => (
        <option key={header} value={header}>
          {header}
        </option>
      ))}
    </select>
  </div>
);

const ImportWizard = () => {
  /**VARIABLES */
  const { user } = useAuth();
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [mapping, setMapping] = useState<Mapping>({
    memberNumber: "",
    fullName: "",
    unit: "",
  });
  const [parseError, setParseError] = useState("");

  let mappingError = "";
  if (!mapping.memberNumber || !mapping.fullName) {
    mappingError = "Choose the member number and full name columns.";
  } else if (mapping.memberNumber === mapping.fullName) {
    mappingError = "Member number and full name need two different columns.";
  }

  /**FUNCTIONS */
  const handleFile = (file: File) => {
    setParseError("");
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const found = result.meta.fields ?? [];
        if (found.length === 0 || result.data.length === 0) {
          setHeaders([]);
          setRows([]);
          setParseError(
            "That file has no data rows. Check that it is a CSV with a header row.",
          );
          return;
        }
        setFileName(file.name);
        setHeaders(found);
        setRows(result.data);
        setMapping({
          memberNumber: guessColumn(found, ["number", "_no", "reg"]),
          fullName: guessColumn(found, ["name"]),
          unit: guessColumn(found, ["unit", "section", "group"]),
        });
      },
      error: () => setParseError("Could not read that file."),
    });
  };

  const changeMapping = (field: keyof Mapping, value: string) =>
    setMapping((current) => ({ ...current, [field]: value }));

  /**COMPONENT */
  if (user?.club?.membershipSource !== "import_roster") {
    return (
      <Card title="Roster import is not available">
        <p className="muted text-sm">
          This club adds members by hand. Roster import is only for clubs whose
          membership follows an imported roster.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Roster import</h1>
        <p className="muted">
          Bring a current roster into the member register. Nothing changes until
          you review and commit.
        </p>
      </header>

      <Card title="1. Upload your roster CSV">
        <label htmlFor="roster-file" className="sr-only">
          Roster CSV file
        </label>
        <input
          id="roster-file"
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="block text-sm"
        />
        <p className="muted mt-2 text-xs">
          A CSV with a header row. Only member number, full name and unit are
          read. This step reads the file in your browser.
        </p>
        {parseError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {parseError}
          </p>
        )}
      </Card>

      {headers.length > 0 && (
        <Card title="2. Map the columns">
          <p className="muted mb-4 text-sm">
            {rows.length} rows found in {fileName}.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            <ColumnSelect
              id="map-number"
              label="Member number (required)"
              value={mapping.memberNumber}
              headers={headers}
              emptyLabel="Choose a column"
              onChange={(value) => changeMapping("memberNumber", value)}
            />
            <ColumnSelect
              id="map-name"
              label="Full name (required)"
              value={mapping.fullName}
              headers={headers}
              emptyLabel="Choose a column"
              onChange={(value) => changeMapping("fullName", value)}
            />
            <ColumnSelect
              id="map-unit"
              label="Unit (optional)"
              value={mapping.unit}
              headers={headers}
              emptyLabel="No unit column"
              onChange={(value) => changeMapping("unit", value)}
            />
          </div>

          <p className="mt-6 mb-2 text-sm font-medium">
            Preview: how the first rows will be read
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Member number</th>
                  <th className="px-3 py-2 font-medium">Full name</th>
                  <th className="px-3 py-2 font-medium">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      {cell(row, mapping.memberNumber)}
                    </td>
                    <td className="px-3 py-2">{cell(row, mapping.fullName)}</td>
                    <td className="px-3 py-2">{cell(row, mapping.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {mappingError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              {mappingError}
            </p>
          )}
          <div className="mt-6 flex justify-end">
            {/* Wired up in part 2, when the server can run the dry run. */}
            <Button disabled={Boolean(mappingError)}>
              Continue to dry run
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImportWizard;
