"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StateLoading from "@/components/ui/StateLoading";
import { ROUTES } from "@/constants";
import { formatDay } from "@/lib/format";
import {
  useGetActivitiesQuery,
  useGetParticipationQuery,
} from "@/store/api/activitiesApi";

const AttendanceContent = () => {
  /**VARIABLES */
  const { data: activities, isLoading: loadingActivities } =
    useGetActivitiesQuery();
  const {
    data: rows,
    isLoading: loadingRows,
    isError,
  } = useGetParticipationQuery();

  /**COMPONENT */
  if (loadingActivities || loadingRows)
    return <StateLoading label="Loading attendance..." />;
  if (isError || !rows || !activities) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load attendance. Refresh to try again.
      </p>
    );
  }

  const recent = activities
    .filter((a) => a.status === "scheduled")
    .reverse()
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Attendance</h1>
        <p className="muted">Take attendance and see who is taking part.</p>
      </header>

      <Card title="Take attendance for an activity">
        {recent.length === 0 ? (
          <p className="muted text-sm">
            Create an activity first, then take its attendance here.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recent.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="muted text-sm">{formatDay(a.date)}</p>
                </div>
                <Link
                  href={ROUTES.attendanceFor(a.id)}
                  className={buttonStyles({ size: "sm", variant: "ghost" })}
                >
                  Open register
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Participation report" padded={false}>
        {rows.length === 0 ? (
          <p className="muted p-5 text-sm">No active members yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Member number</th>
                  <th className="px-4 py-3 font-medium">Full name</th>
                  <th className="px-4 py-3 font-medium">Activities</th>
                  <th className="px-4 py-3 font-medium">Present</th>
                  <th className="px-4 py-3 font-medium">Excused</th>
                  <th className="px-4 py-3 font-medium">Absent</th>
                  <th className="px-4 py-3 font-medium">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((row) => (
                  <tr key={row.memberId}>
                    <td className="px-4 py-3">{row.memberNumber}</td>
                    <td className="px-4 py-3 font-medium">{row.fullName}</td>
                    <td className="px-4 py-3">{row.inScope}</td>
                    <td className="px-4 py-3">{row.present}</td>
                    <td className="px-4 py-3">{row.excused}</td>
                    <td className="px-4 py-3">{row.absent}</td>
                    <td className="px-4 py-3">
                      {row.rate === null ? "—" : `${row.rate}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="muted p-4 text-xs">
          Counts include recorded marks only. A missing mark is not counted as
          absent.
        </p>
      </Card>
    </div>
  );
};

export default AttendanceContent;
