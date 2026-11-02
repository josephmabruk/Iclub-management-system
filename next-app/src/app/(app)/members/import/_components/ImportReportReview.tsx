import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format";
import type { ImportReport, RowResolution, Unit } from "@/types";

type Props = {
  report: ImportReport;
  units: Unit[];
  resolutions: Record<number, RowResolution>;
  onResolve: (rowNumber: number, decision: RowResolution) => void;
};

const Count = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="muted text-xs">{label}</p>
    <p className="mt-1 text-2xl font-semibold">{value}</p>
  </div>
);

const ImportReportView = ({ report, units, resolutions, onResolve }: Props) => {
  /**VARIABLES */
  const { additions, departures, duplicates, unmatched, unchanged, totalRows } =
    report;
  const accounted =
    unchanged + additions.length + duplicates.length + unmatched.length;
  const issues = [...duplicates, ...unmatched].sort(
    (a, b) => a.rowNumber - b.rowNumber,
  );
  const unitName = (id: string | null) =>
    units.find((unit) => unit.id === id)?.name ?? "No unit";

  /**COMPONENT */
  return (
    <Card title="3. Dry run result">
      <div className="flex flex-col gap-5">
        <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
          Nothing has been written. This is a preview of what an import would
          change.
        </p>

        <div className="grid gap-3 sm:grid-cols-5">
          <Count label="Additions" value={additions.length} />
          <Count label="Departures" value={departures.length} />
          <Count label="Unchanged" value={unchanged} />
          <Count label="Duplicates" value={duplicates.length} />
          <Count label="Unmatched rows" value={unmatched.length} />
        </div>

        <p className="text-sm">
          {totalRows} source rows = {unchanged} unchanged + {additions.length}{" "}
          additions + {duplicates.length} duplicates + {unmatched.length}{" "}
          unmatched
          {accounted === totalRows
            ? " ✓"
            : " — these do not add up, so do not commit"}
        </p>

        {issues.length > 0 ? (
          <p className="rounded-lg bg-warn-50 p-3 text-sm text-amber-800">
            {issues.length} rows must be resolved before you can commit.
          </p>
        ) : (
          <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
            No problems found in this roster.
          </p>
        )}

        {issues.length > 0 && (
          <section>
            <h3 className="mb-2 font-semibold">Rows that need attention</h3>
            <ul className="divide-y divide-gray-200 text-sm">
              {issues.map((issue) => {
                const decision = resolutions[issue.rowNumber];
                return (
                  <li key={issue.rowNumber} className="py-3">
                    <span className="font-medium">Row {issue.rowNumber}</span>
                    {" · "}
                    {issue.memberNumber || "no number"} {issue.fullName}
                    <span className="block text-red-700">{issue.reason}</span>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {issue.kind === "unit" && (
                        <select
                          aria-label={`Match row ${issue.rowNumber} to a unit`}
                          value={
                            decision?.action === "match_unit"
                              ? decision.unitId
                              : ""
                          }
                          onChange={(event) => {
                            if (event.target.value)
                              onResolve(issue.rowNumber, {
                                action: "match_unit",
                                unitId: event.target.value,
                              });
                          }}
                          className="rounded-lg border border-gray-300 bg-white p-2 text-sm"
                        >
                          <option value="">Match to a unit…</option>
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          decision?.action === "exclude" ? "primary" : "ghost"
                        }
                        onClick={() =>
                          onResolve(issue.rowNumber, { action: "exclude" })
                        }
                      >
                        Exclude row
                      </Button>
                      {decision && (
                        <span className="text-xs font-medium text-brand-700">
                          {decision.action === "exclude"
                            ? "✓ Excluded from the import"
                            : `✓ Will be added to ${unitName(decision.unitId)}`}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {additions.length > 0 && (
          <section>
            <h3 className="mb-2 font-semibold">Would be added as Active</h3>
            <ul className="max-h-56 divide-y divide-gray-200 overflow-y-auto text-sm">
              {additions.map((a) => (
                <li key={a.rowNumber} className="flex justify-between py-2">
                  <span>
                    {a.memberNumber} · {a.fullName}
                  </span>
                  <span className="muted">{unitName(a.unitId)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {departures.length > 0 && (
          <section>
            <h3 className="mb-2 font-semibold">
              Would be proposed as Departing
            </h3>
            <p className="muted mb-2 text-xs">
              Active members missing from this roster. Nothing is deleted, and
              their history is kept.
            </p>
            <ul className="divide-y divide-gray-200 text-sm">
              {departures.map((d) => (
                <li key={d.memberId} className="py-2">
                  {d.memberNumber} · {d.fullName}
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="muted text-xs">
          This report expires {formatDateTime(report.expiresAt)} (24 hours).
        </p>
      </div>
    </Card>
  );
};

export default ImportReportView;
