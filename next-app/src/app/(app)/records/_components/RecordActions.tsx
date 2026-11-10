"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { todayInNairobi } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import {
  useChangeRecordStateMutation,
  useTransferCustodyMutation,
} from "@/store/api/recordsApi";
import type { RecordView } from "@/types";

type Panel = "transfer" | "state" | "writeoff" | null;
type Props = {
  item: RecordView;
  offices: { id: string; label: string }[];
  canManage: boolean;
  canWriteOff: boolean;
};

const SELECT =
  "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm";

const RecordActions = ({ item, offices, canManage, canWriteOff }: Props) => {
  /**VARIABLES */
  const [panel, setPanel] = useState<Panel>(null);
  const [transfer, { isLoading: transferring, error: transferError }] =
    useTransferCustodyMutation();
  const [changeState, { isLoading: changing, error: stateError }] =
    useChangeRecordStateMutation();

  /**FUNCTIONS */
  const handleTransfer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await transfer({
      id: item.id,
      toOfficeId: String(form.get("toOfficeId")),
      reason: String(form.get("reason")),
    });
    if (!result.error) setPanel(null);
  };

  const handleState = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await changeState({
      id: item.id,
      state:
        panel === "writeoff"
          ? "written_off"
          : (String(form.get("state")) as "lost" | "disposed"),
      date: panel === "writeoff" ? todayInNairobi() : String(form.get("date")),
      reason: String(form.get("reason")),
    });
    if (!result.error) setPanel(null);
  };

  /**COMPONENT */
  if (item.state !== "held") return null;

  return (
    <div className="flex min-w-60 flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        {canManage && (
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPanel("transfer")}
            >
              Transfer
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setPanel("state")}>
              Lost or disposed
            </Button>
          </>
        )}
        {canWriteOff && item.outstanding && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPanel("writeoff")}
          >
            Write off
          </Button>
        )}
      </div>

      {panel === "transfer" && (
        <form
          onSubmit={handleTransfer}
          className="flex w-full flex-col gap-2 rounded-lg bg-page p-3 text-left"
        >
          <label htmlFor={`to-${item.id}`} className="text-sm font-medium">
            Receiving office
          </label>
          <select
            id={`to-${item.id}`}
            name="toOfficeId"
            required
            className={SELECT}
          >
            {offices
              .filter((o) => o.id !== item.officeId)
              .map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
          </select>
          <Input
            id={`tr-${item.id}`}
            name="reason"
            label="Reason (required)"
            required
          />
          {transferError && (
            <p role="alert" className="text-xs text-red-600">
              {getErrorMessage(transferError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={transferring}>
              Transfer
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

      {(panel === "state" || panel === "writeoff") && (
        <form
          onSubmit={handleState}
          className="flex w-full flex-col gap-2 rounded-lg bg-danger-50 p-3 text-left"
        >
          {panel === "state" ? (
            <>
              <label htmlFor={`st-${item.id}`} className="text-sm font-medium">
                What happened?
              </label>
              <select id={`st-${item.id}`} name="state" className={SELECT}>
                <option value="lost">Lost</option>
                <option value="disposed">Disposed of</option>
              </select>
              <Input
                id={`dt-${item.id}`}
                name="date"
                label="Date"
                type="date"
                defaultValue={todayInNairobi()}
                required
              />
            </>
          ) : (
            <p className="text-xs">
              Writing off keeps the item in the register, marked as written off.
            </p>
          )}
          <Input
            id={`why-${item.id}`}
            name="reason"
            label="Reason (required)"
            required
          />
          {stateError && (
            <p role="alert" className="text-xs text-red-600">
              {getErrorMessage(stateError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" variant="danger" loading={changing}>
              Confirm
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

export default RecordActions;
