"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toMinor } from "@/lib/money";
import { getErrorMessage } from "@/lib/utils";
import { useRecordEntryMutation } from "@/store/api/financeApi";
import type { Direction, FinancialYear } from "@/types";

type Props = { year: FinancialYear; onDone: () => void };

const RecordEntryForm = ({ year, onDone }: Props) => {
  /**VARIABLES */
  const [recordEntry, { isLoading, error }] = useRecordEntryMutation();
  const [direction, setDirection] = useState<Direction>("expenditure");
  const [formError, setFormError] = useState("");
  // An entry must use a line of its own type, so the dropdown follows the direction.
  const lines = year.lines.filter((line) => line.direction === direction);

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = toMinor(String(form.get("amount")));

    // Condition: if amount is null or 0, call setFormError("Enter an amount

    if (amount === null || amount === 0) {
      setFormError("Enter an amount greater than zero");
      return;
    }
    setFormError("");

    const result = await recordEntry({
      direction,
      amount,
      date: String(form.get("date")),
      budgetLineId: String(form.get("budgetLineId")),
      counterparty: String(form.get("counterparty")),
      description: String(form.get("description")),
      receiptRef: String(form.get("receiptRef")) || undefined,
    });
    if (!result.error) onDone();
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="entry-direction"
            className="mb-1 block text-sm font-medium"
          >
            Money in or out
          </label>
          <select
            id="entry-direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value as Direction)}
            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
          >
            <option value="expenditure">Expenditure (money out)</option>
            <option value="income">Income (money in)</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="entry-line"
            className="mb-1 block text-sm font-medium"
          >
            Budget line
          </label>
          <select
            key={direction}
            id="entry-line"
            name="budgetLineId"
            required
            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
          >
            {lines.length === 0 && (
              <option value="">No {direction} lines in this year</option>
            )}
            {lines.map((line) => (
              <option key={line.id} value={line.id}>
                {line.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="entry-amount"
          name="amount"
          label="Amount (KES)"
          inputMode="decimal"
          required
        />
        <Input
          id="entry-date"
          name="date"
          label="Date"
          type="date"
          min={year.startDate}
          max={year.endDate}
          required
        />
        <Input
          id="entry-counterparty"
          name="counterparty"
          label="Counterparty"
          required
        />
        <Input
          id="entry-description"
          name="description"
          label="Description"
          required
        />
      </div>
      <Input
        id="entry-receipt"
        name="receiptRef"
        label="Receipt reference (optional)"
        hint="A document number, transaction reference or where the receipt is kept. Files are never uploaded."
      />

      {(formError || error) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(error)}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" loading={isLoading}>
          Post entry
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RecordEntryForm;
