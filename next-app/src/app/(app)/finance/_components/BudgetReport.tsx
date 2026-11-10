"use client";

import { useState } from "react";
import StatusChip from "@/components/shared/StatusChip";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/utils";
import { formatMoney } from "@/lib/money";
import { useGetBudgetReportQuery } from "@/store/api/financeApi";
import type { BudgetReportRow, FinancialYear } from "@/types";

const statusOf = (row: BudgetReportRow) => {
  if (row.direction === "expenditure")
    return row.attention
      ? { label: "Over budget", tone: "bad" as const }
      : { label: "Within budget", tone: "good" as const };
  return row.attention
    ? { label: "Below target", tone: "warn" as const }
    : { label: "Target met", tone: "good" as const };
};

const sum = (rows: BudgetReportRow[], key: "planned" | "actual") =>
  rows.reduce((total, row) => total + row[key], 0);

const BudgetReport = ({ year }: { year: FinancialYear }) => {
  /**VARIABLES */
  const [from, setFrom] = useState(year.startDate);
  const [to, setTo] = useState(year.endDate);
  const { data, isFetching, error } = useGetBudgetReportQuery({
    yearId: year.id,
    from,
    to,
  });

  const groups = [
    {
      title: "Income lines",
      rows: data?.rows.filter((r) => r.direction === "income") ?? [],
    },
    {
      title: "Expenditure lines",
      rows: data?.rows.filter((r) => r.direction === "expenditure") ?? [],
    },
  ];

  /**COMPONENT */
  return (
    <Card title="Budget against actual">
      <div className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="report-from"
            label="From"
            type="date"
            value={from}
            min={year.startDate}
            max={year.endDate}
            onChange={(e) => setFrom(e.target.value)}
          />
          <Input
            id="report-to"
            label="To"
            type="date"
            value={to}
            min={year.startDate}
            max={year.endDate}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <p className="muted text-xs">
          Actuals cover the dates chosen. Planned amounts are the full-year
          budget.
          {isFetching && " Updating..."}
        </p>
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        )}

        {groups.map(({ title, rows }) =>
          rows.length === 0 ? null : (
            <div key={title} className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="mb-2 text-left font-semibold">
                  {title}
                </caption>
                <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                  <tr>
                    <th className="px-3 py-2 font-medium">Line</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Planned
                    </th>
                    <th className="px-3 py-2 text-right font-medium">Actual</th>
                    <th className="px-3 py-2 text-right font-medium">
                      Variance
                    </th>
                    <th className="px-3 py-2 text-right font-medium">
                      Variance %
                    </th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rows.map((row) => {
                    const status = statusOf(row);
                    return (
                      <tr key={row.lineId}>
                        <td className="px-3 py-2">
                          <span className="font-medium">{row.name}</span>
                          <span className="muted block text-xs">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatMoney(row.planned)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatMoney(row.actual)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {formatMoney(row.variance)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {row.variancePct === null
                            ? "—"
                            : `${row.variancePct}%`}
                        </td>
                        <td className="px-3 py-2">
                          <StatusChip label={status.label} tone={status.tone} />
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-gray-50 font-semibold">
                    <td className="px-3 py-2">Total</td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(sum(rows, "planned"))}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(sum(rows, "actual"))}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {formatMoney(sum(rows, "actual") - sum(rows, "planned"))}
                    </td>
                    <td className="px-3 py-2" colSpan={2} />
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        )}
      </div>
    </Card>
  );
};

export default BudgetReport;
