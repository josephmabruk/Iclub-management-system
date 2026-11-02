"use client";

import Link from "next/link";
import { useState } from "react";
import Button, { buttonStyles } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import {
  useCancelActivityMutation,
  useRescheduleActivityMutation,
} from "@/store/api/activitiesApi";
import type { Activity } from "@/types";

type Panel = "reschedule" | "cancel" | null;

const ActivityActions = ({ activity }: { activity: Activity }) => {
  /**VARIABLES */
  const [panel, setPanel] = useState<Panel>(null);
  const [reschedule, { isLoading: rescheduling, error: rescheduleError }] =
    useRescheduleActivityMutation();
  const [cancel, { isLoading: cancelling, error: cancelError }] =
    useCancelActivityMutation();

  /**FUNCTIONS */
  const handleReschedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await reschedule({
      id: activity.id,
      date: String(form.get("date")),
      startTime: String(form.get("startTime")),
      endTime: String(form.get("endTime")),
      reason: String(form.get("reason")),
    });
    if (!result.error) setPanel(null);
  };

  const handleCancel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    // TODO: call cancel({ id: activity.id, reason: String(form.get("reason")) })
    //       and close the panel with setPanel(null) if it worked,
    //       the same way handleReschedule does.
  };

  /**COMPONENT */
  if (activity.status === "cancelled") {
    return <p className="muted text-sm">Cancelled: {activity.cancelReason}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Link
          href={ROUTES.attendanceFor(activity.id)}
          className={buttonStyles({ size: "sm" })}
        >
          Take attendance
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setPanel("reschedule")}
        >
          Reschedule
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setPanel("cancel")}>
          Cancel activity
        </Button>
      </div>

      {panel === "reschedule" && (
        <form
          onSubmit={handleReschedule}
          className="flex flex-col gap-3 rounded-lg bg-page p-4"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <Input
              id={`r-date-${activity.id}`}
              name="date"
              label="New date"
              type="date"
              defaultValue={activity.date}
              required
            />
            <Input
              id={`r-start-${activity.id}`}
              name="startTime"
              label="Start"
              type="time"
              defaultValue={activity.startTime}
              required
            />
            <Input
              id={`r-end-${activity.id}`}
              name="endTime"
              label="End"
              type="time"
              defaultValue={activity.endTime}
              required
            />
          </div>
          <Input
            id={`r-reason-${activity.id}`}
            name="reason"
            label="Reason (required)"
            required
          />
          {rescheduleError && (
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(rescheduleError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" loading={rescheduling}>
              Confirm reschedule
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

      {panel === "cancel" && (
        <form
          onSubmit={handleCancel}
          className="flex flex-col gap-3 rounded-lg bg-danger-50 p-4"
        >
          <Input
            id={`c-reason-${activity.id}`}
            name="reason"
            label="Reason for cancelling (required)"
            required
          />
          {cancelError && (
            <p role="alert" className="text-sm text-red-600">
              {getErrorMessage(cancelError)}
            </p>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              size="sm"
              variant="danger"
              loading={cancelling}
            >
              Confirm cancellation
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setPanel(null)}
            >
              Keep activity
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ActivityActions;
