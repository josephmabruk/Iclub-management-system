"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/utils";
import {
  useAddReceiptMutation,
  useReverseEntryMutation,
} from "@/store/api/financeApi";
import type { LedgerEntry } from "@/types";

type Panel = "reverse" | "receipt" | null;

type Props = { entry: LedgerEntry; canReverse: boolean };

const EntryActions = ({ entry, canReverse }: Props) => {
  /**VARIABLES */
  const [panel, setPanel] = useState<Panel>(null);
  const [reverse, { isLoading: reversing, error: reverseError }] =
    useReverseEntryMutation();
  const [addReceipt, { isLoading: adding, error: receiptError }] =
    useAddReceiptMutation();

  /**FUNCTIONS */
  const handleReverse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await reverse({
      entryId: entry.id,
      reason: String(form.get("reason")),
    });
    if (!result.error) setPanel(null);
  };

  const handleReceipt = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await addReceipt({
      entryId: entry.id,
      reference: String(form.get("reference")),
    });
    if (!result.error) setPanel(null);
  };

  /**COMPONENT */
  if (entry.reversesId) return null;

  return (
    <div className="flex min-w-56 flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => setPanel("receipt")}>
          Add reference
        </Button>
        {canReverse && !entry.reversed && (
          <Button size="sm" variant="ghost" onClick={() => setPanel("reverse")}>
            Reverse
          </Button>
        )}
      </div>

      {panel === "receipt" && (
        <form
          onSubmit={handleReceipt}
          className="flex w-full flex-col gap-2 rounded-lg bg-page p-3 text-left"
        >
          <Input
            id={`ref-${entry.id}`}
            name="reference"
            label="Receipt reference"
            required
          />
          {receiptError && (
            <p role="alert" className="text-xs text-red-600">
              {getErrorMessage(receiptError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={adding}>
              Add
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPanel(null)}
            >
              Close
            </Button>
          </div>
        </form>
      )}

      {panel === "reverse" && (
        <form
          onSubmit={handleReverse}
          className="flex w-full flex-col gap-2 rounded-lg bg-danger-50 p-3 text-left"
        >
          <p className="text-xs">
            Posts a linked reversing entry. The original stays visible.
          </p>
          <Input
            id={`why-${entry.id}`}
            name="reason"
            label="Reason (required)"
            required
          />
          {reverseError && (
            <p role="alert" className="text-xs text-red-600">
              {getErrorMessage(reverseError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              variant="danger"
              loading={reversing}
            >
              Post reversal
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPanel(null)}
            >
              Close
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EntryActions;
