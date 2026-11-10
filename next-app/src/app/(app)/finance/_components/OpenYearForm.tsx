"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toMinor } from "@/lib/money";
import { getErrorMessage } from "@/lib/utils";
import { useOpenYearMutation } from "@/store/api/financeApi";
import type { Direction } from "@/types";

type LineDraft = {
  id: string;
  name: string;
  category: string;
  direction: Direction;
  planned: string; // what the user typed, converted on submit
};

const newLine = (): LineDraft => ({
  id: crypto.randomUUID(),
  name: "",
  category: "",
  direction: "expenditure",
  planned: "",
});

const OpenYearForm = ({ onDone }: { onDone: () => void }) => {
  /**VARIABLES */
  const [openYear, { isLoading, error }] = useOpenYearMutation();
  const [lines, setLines] = useState<LineDraft[]>([newLine()]);
  const [formError, setFormError] = useState("");

  /**FUNCTIONS */
  const updateLine = (id: string, changes: Partial<LineDraft>) =>
    setLines((current) =>
      current.map((l) => (l.id === id ? { ...l, ...changes } : l)),
    );

  const removeLine = (id: string) =>
    setLines((current) => current.filter((l) => l.id !== id));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const startDate = String(form.get("startDate"));
    const endDate = String(form.get("endDate"));

    if (endDate <= startDate) {
      setFormError("The year must end after it starts");
      return;
    }
    const filled = lines.filter((l) => l.name.trim());
    if (filled.length === 0) {
      setFormError("Add at least one budget line");
      return;
    }
    const converted = filled.map((l) => ({
      ...l,
      cents: toMinor(l.planned || "0"),
    }));
    const bad = converted.find((l) => l.cents === null);
    if (bad) {
      setFormError(
        `"${bad.name}" needs a valid planned amount, like 15000 or 15000.50`,
      );
      return;
    }
    setFormError("");

    const result = await openYear({
      startDate,
      endDate,
      lines: converted.map((l) => ({
        name: l.name,
        category: l.category,
        direction: l.direction,
        planned: l.cents ?? 0,
      })),
    });
    if (!result.error) onDone();
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          id="year-start"
          name="startDate"
          label="Start date"
          type="date"
          required
        />
        <Input
          id="year-end"
          name="endDate"
          label="End date"
          type="date"
          required
        />
      </div>

      <p className="text-sm font-medium">Budget lines</p>
      {lines.map((line, index) => (
        <div
          key={line.id}
          className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] sm:items-end"
        >
          <Input
            id={`line-name-${index}`}
            label="Name"
            value={line.name}
            onChange={(e) => updateLine(line.id, { name: e.target.value })}
          />
          <Input
            id={`line-category-${index}`}
            label="Category"
            value={line.category}
            onChange={(e) => updateLine(line.id, { category: e.target.value })}
          />
          <div>
            <label
              htmlFor={`line-direction-${index}`}
              className="mb-1 block text-sm font-medium"
            >
              Type
            </label>
            <select
              id={`line-direction-${index}`}
              value={line.direction}
              onChange={(e) =>
                updateLine(line.id, { direction: e.target.value as Direction })
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
            >
              <option value="expenditure">Expenditure</option>
              <option value="income">Income</option>
            </select>
          </div>
          <Input
            id={`line-planned-${index}`}
            label="Planned (KES)"
            inputMode="decimal"
            value={line.planned}
            onChange={(e) => updateLine(line.id, { planned: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeLine(line.id)}
          >
            Remove
          </Button>
        </div>
      ))}

      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => setLines((c) => [...c, newLine()])}
        >
          Add budget line
        </Button>
      </div>

      {(formError || error) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(error)}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" loading={isLoading}>
          Open financial year
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default OpenYearForm;
