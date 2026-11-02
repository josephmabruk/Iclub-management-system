"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StateLoading from "@/components/ui/StateLoading";
import { ATTENDANCE_LABELS } from "@/constants";
import { formatDay } from "@/lib/format";
import { getErrorMessage } from "@/lib/utils";
import {
  useGetAttendanceSheetQuery,
  useMarkAttendanceMutation,
} from "@/store/api/activitiesApi";
import type { AttendanceStatus } from "@/types";

const STATUSES = Object.keys(ATTENDANCE_LABELS) as AttendanceStatus[];

const TakeAttendance = () => {
  /**VARIABLES (all hooks first) */
  const { activityId } = useParams<{ activityId: string }>();
  const {
    data: sheet,
    isLoading,
    isError,
  } = useGetAttendanceSheetQuery(activityId);
  const [mark, { error }] = useMarkAttendanceMutation();
  const [search, setSearch] = useState("");

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading the register..." />;
  if (isError || !sheet) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load this register. Check that the activity exists.
      </p>
    );
  }

  const { activity, rows } = sheet;
  const marked = rows.filter((row) => row.mark).length;
  const cancelled = activity.status === "cancelled";
  const visible = rows.filter((row) =>
    `${row.fullName} ${row.memberNumber}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <header>
        <h1 className="text-2xl font-semibold">Take attendance</h1>
        <p className="font-medium">{activity.name}</p>
        <p className="muted text-sm">
          {formatDay(activity.date)} · {activity.startTime}–{activity.endTime} ·{" "}
          {activity.location}
        </p>
      </header>

      {cancelled && (
        <p className="rounded-lg bg-danger-50 p-3 text-sm text-red-700">
          This activity was cancelled, so attendance cannot be taken.
        </p>
      )}

      <Card>
        <p className="text-2xl font-semibold">
          {marked} / {rows.length}
          <span className="muted ml-2 text-sm font-normal">
            active members marked
          </span>
        </p>
        <div className="mt-3 h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-brand-600"
            style={{
              width: `${rows.length ? (marked / rows.length) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="muted mt-2 text-xs">
          Tap Present, Absent or Excused. Each choice saves immediately.
        </p>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      {rows.length === 0 ? (
        <p className="muted text-sm">
          There are no active members in scope for this activity.
        </p>
      ) : (
        <>
          <Input
            id="attendance-search"
            placeholder="Find a member"
            aria-label="Find a member"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <ul className="flex flex-col gap-3">
            {visible.map((row) => (
              <li
                key={row.memberId}
                className="rounded-xl border border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{row.fullName}</p>
                    <p className="muted text-xs">{row.memberNumber}</p>
                  </div>
                  {row.mark && (
                    <span className="text-xs font-medium text-brand-700">
                      ✓ Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {STATUSES.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      className="flex-1"
                      variant={
                        row.mark?.status === status ? "primary" : "ghost"
                      }
                      aria-pressed={row.mark?.status === status}
                      disabled={cancelled}
                      onClick={() =>
                        mark({ activityId, memberId: row.memberId, status })
                      }
                    >
                      {ATTENDANCE_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TakeAttendance;
