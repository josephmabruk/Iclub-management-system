"use client";

import { useState } from "react";
import StatusChip from "@/components/shared/StatusChip";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StateLoading from "@/components/ui/StateLoading";
import { usePermissions } from "@/hooks/usePermissions";
import { isUnevidenced, totals } from "@/lib/finance";
import { formatDay } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import { useGetLedgerQuery, useGetYearsQuery } from "@/store/api/financeApi";
import BudgetReport from "./BudgetReport";
import CloseYearPanel from "./CloseYearPanel";
import LedgerTable from "./LedgerTable";
import OpenYearForm from "./OpenYearForm";
import RecordEntryForm from "./RecordEntryForm";

const Figure = ({ label, value }: { label: string; value: number }) => (
  <Card>
    <p className="muted text-sm">{label}</p>
    <p className="mt-2 text-2xl font-semibold">{formatMoney(value)}</p>
  </Card>
);

const FinanceContent = () => {
  /**VARIABLES (all hooks first) */
  const { can } = usePermissions();
  const { data: years, isLoading, isError } = useGetYearsQuery();
  const [pickedId, setPickedId] = useState("");
  const [opening, setOpening] = useState(false);
  const [recording, setRecording] = useState(false);
  const [onlyMissing, setOnlyMissing] = useState(false);

  const year = years?.find((y) => y.id === pickedId) ?? years?.[0];
  const { data: entries } = useGetLedgerQuery(year?.id ?? "", { skip: !year });

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading finance..." />;
  if (isError || !years) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load finance. Refresh to try again.
      </p>
    );
  }

  const canPost = can("finance.post");
  const list = entries ?? [];
  const sum = totals(list);
  const missing = list.filter(isUnevidenced);
  const shown = onlyMissing ? missing : list;
  const isOpen = year?.status === "open";
  const showOpenForm = canPost && (opening || years.length === 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Finance</h1>
          <p className="muted">
            A record of club finances, not a bank balance. iClub never receives,
            holds or transfers money.
          </p>
        </div>
        {canPost && !showOpenForm && (
          <Button variant="ghost" onClick={() => setOpening(true)}>
            Open a new financial year
          </Button>
        )}
      </header>

      {showOpenForm && (
        <Card title="Open a financial year">
          <OpenYearForm
            onDone={() => {
              setOpening(false);
              setPickedId("");
            }}
          />
        </Card>
      )}

      {years.length === 0 && !canPost && (
        <p className="muted text-sm">
          The treasurer has not opened a financial year yet.
        </p>
      )}

      {year && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="year-picker" className="text-sm font-medium">
              Financial year
            </label>
            <select
              id="year-picker"
              value={year.id}
              onChange={(e) => setPickedId(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white p-2 text-sm"
            >
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name} ({y.status === "open" ? "Open" : "Closed"})
                </option>
              ))}
            </select>
            <span className="muted text-sm">
              {formatDay(year.startDate)} to {formatDay(year.endDate)}
            </span>
            <StatusChip
              label={isOpen ? "Open" : "Closed"}
              tone={isOpen ? "good" : "neutral"}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Figure label="Recorded position" value={sum.balance} />
            <Figure label="Income recorded" value={sum.income} />
            <Figure label="Expenditure recorded" value={sum.expenditure} />
          </div>

          {canPost && isOpen && (
            <div>
              {recording ? (
                <Card title="Record an entry">
                  <RecordEntryForm
                    year={year}
                    onDone={() => setRecording(false)}
                  />
                </Card>
              ) : (
                <Button onClick={() => setRecording(true)}>Record entry</Button>
              )}
            </div>
          )}

          <BudgetReport key={year.id} year={year} />

          <Card title="Ledger" padded={false}>
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4 text-sm">
              {missing.length > 0 ? (
                <StatusChip
                  label={`${missing.length} without evidence`}
                  tone="warn"
                />
              ) : (
                <StatusChip label="All entries have evidence" tone="good" />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={onlyMissing}
                  onChange={(e) => setOnlyMissing(e.target.checked)}
                  className="accent-brand-600"
                />
                Show only entries without evidence
              </label>
            </div>
            <LedgerTable
              entries={shown}
              lines={year.lines}
              canPost={canPost}
              yearOpen={isOpen}
            />
          </Card>

          {canPost && isOpen && (
            <CloseYearPanel
              year={year}
              entryCount={list.length}
              unevidenced={missing.length}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FinanceContent;
