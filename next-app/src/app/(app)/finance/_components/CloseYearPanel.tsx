"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { getErrorMessage } from "@/lib/utils";
import { useCloseYearMutation } from "@/store/api/financeApi";
import type { FinancialYear } from "@/types";

type Props = { year: FinancialYear; entryCount: number; unevidenced: number };

const CloseYearPanel = ({ year, entryCount, unevidenced }: Props) => {
  const [open, setOpen] = useState(false);
  const [closeYear, { isLoading, error }] = useCloseYearMutation();

  if (!open) {
    return (
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Close this financial year
      </Button>
    );
  }

  return (
    <Card title={`Close ${year.name}?`}>
      <div className="flex flex-col gap-3 text-sm">
        <p>Closing will:</p>
        <ul className="list-disc pl-5">
          <li>Stop any new entry or reversal in this year</li>
          <li>Keep all {entryCount} entries readable, unchanged</li>
        </ul>
        {unevidenced > 0 && (
          <p className="rounded-lg bg-warn-50 p-3 text-amber-800">
            {unevidenced} entries have no receipt reference. You can still add
            references afterwards.
          </p>
        )}
        <p className="font-medium">This cannot be undone.</p>
        {error && (
          <p role="alert" className="text-red-600">
            {getErrorMessage(error)}
          </p>
        )}
        <div className="flex gap-2">
          <Button
            variant="danger"
            loading={isLoading}
            onClick={() => closeYear({ yearId: year.id })}
          >
            Close year
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Keep it open
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CloseYearPanel;
