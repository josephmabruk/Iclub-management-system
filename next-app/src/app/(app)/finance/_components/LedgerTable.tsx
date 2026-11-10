import StatusChip from "@/components/shared/StatusChip";
import { formatDay } from "@/lib/format";
import { formatMoney } from "@/lib/money";
import type { BudgetLine, LedgerEntry } from "@/types";
import EntryActions from "./EntryActions";

type Props = {
  entries: LedgerEntry[];
  lines: BudgetLine[];
  canPost: boolean;
  yearOpen: boolean;
};

const LedgerTable = ({ entries, lines, canPost, yearOpen }: Props) => {
  const lineName = (id: string) =>
    lines.find((l) => l.id === id)?.name ?? "Unknown line";

  if (entries.length === 0)
    return <p className="muted p-5 text-sm">No entries to show.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Budget line</th>
            <th className="px-4 py-3 font-medium">State</th>
            <th className="px-4 py-3 text-right font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Evidence</th>
            <th className="px-4 py-3 font-medium">Posted by</th>
            {canPost && (
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-4 py-3 whitespace-nowrap">
                {formatDay(entry.date)}
              </td>
              <td className="px-4 py-3">
                <span className="font-medium">{entry.description}</span>
                <span className="muted block text-xs">
                  {entry.counterparty}
                </span>
              </td>
              <td className="px-4 py-3">{lineName(entry.budgetLineId)}</td>
              <td className="px-4 py-3">
                {entry.reversesId ? (
                  <StatusChip label="Reversal" tone="neutral" />
                ) : entry.reversed ? (
                  <StatusChip label="Reversed" tone="bad" />
                ) : (
                  <StatusChip
                    label={
                      entry.direction === "income" ? "Income" : "Expenditure"
                    }
                    tone={entry.direction === "income" ? "good" : "neutral"}
                  />
                )}
              </td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap">
                {entry.reversesId ? "−" : ""}
                {formatMoney(entry.amount)}
              </td>
              <td className="px-4 py-3">
                {entry.reversesId || entry.reversed ? (
                  "—"
                ) : entry.receiptRefs.length > 0 ? (
                  entry.receiptRefs.join(", ")
                ) : (
                  <StatusChip label="Evidence missing" tone="warn" />
                )}
              </td>
              <td className="px-4 py-3">{entry.postedBy}</td>
              {canPost && (
                <td className="px-4 py-3 text-right">
                  <EntryActions entry={entry} canReverse={yearOpen} />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LedgerTable;
