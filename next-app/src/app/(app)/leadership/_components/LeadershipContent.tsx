"use client";

import { useState } from "react";
import StatusChip from "@/components/shared/StatusChip";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StateLoading from "@/components/ui/StateLoading";
import { useAuth } from "@/hooks/useAuth";
import { downloadCsv } from "@/lib/download";
import { getErrorMessage } from "@/lib/utils";
import {
  useAppointMutation,
  useEndAppointmentMutation,
  useGetLeadershipQuery,
} from "@/store/api/leadershipApi";
import { useGetMembersQuery } from "@/store/api/membersApi";
import type { LeadershipStatus } from "@/types";
import { usePermissions } from "@/hooks/usePermissions";
import InviteHolder from "./InviteHolder";

const STATUS: Record<
  LeadershipStatus,
  { label: string; tone: "good" | "warn" | "bad" }
> = {
  verified: { label: "Verified", tone: "good" },
  vacant: { label: "Vacant", tone: "warn" },
  attention: { label: "Needs review", tone: "bad" },
};

const LeadershipContent = () => {
  /**VARIABLES (all hooks first) */
  const { user } = useAuth();
  const { data: rows, isLoading, isError } = useGetLeadershipQuery();
  const { data: members } = useGetMembersQuery();
  const [appoint, { isLoading: appointing, error: appointError }] =
    useAppointMutation();
  const [endAppointment, { isLoading: ending, error: endError }] =
    useEndAppointmentMutation();
  const [positionId, setPositionId] = useState("");
  const [memberId, setMemberId] = useState("");
  const { can } = usePermissions();

  const club = user?.club;

  /**FUNCTIONS */
  const unitName = (id: string | null) =>
    club?.units.find((unit) => unit.id === id)?.name ?? "Whole club";

  const handleAppoint = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await appoint({ positionId, memberId });
    if (!result.error) {
      setPositionId("");
      setMemberId("");
    }
  };

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading leadership..." />;
  if (isError || !rows) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load leadership. Refresh to try again.
      </p>
    );
  }

  const vacant = rows.filter((row) => !row.holder);
  const activeMembers = (members ?? []).filter((m) => m.status === "active");
  const exceptions = rows.filter(
    (row) => row.inVerifiedRoster && row.status !== "verified",
  );

  const exportRoster = () => {
    const lines = rows
      .filter((row) => row.inVerifiedRoster)
      .map((row) => [
        row.positionName,
        unitName(row.unitId),
        row.holder?.fullName ?? "",
        row.holder?.memberNumber ?? "",

        !row.holder
          ? "Vacant"
          : row.status === "attention"
            ? "Holder is not active"
            : "",
      ]);
    downloadCsv(
      exceptions.length > 0
        ? "leadership-roster-qualified.csv"
        : "leadership-roster.csv",
      [["Position", "Unit", "Holder", "Member number", "Exception"], ...lines],
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Leadership</h1>
          <p className="muted">
            Positions and current officeholders for Term {club?.term?.name}.
          </p>
        </div>
        <Button variant="ghost" onClick={exportRoster}>
          {exceptions.length > 0
            ? "Export with exceptions"
            : "Export verified roster"}
        </Button>
      </header>

      {exceptions.length > 0 && (
        <p className="rounded-lg bg-warn-50 p-3 text-sm text-amber-800">
          {exceptions.length} offices are vacant or need review. They will be
          listed as exceptions in the export.
        </p>
      )}

      {can("leadership.manage") && (
        <Card title="Appoint an officeholder">
          {vacant.length === 0 ? (
            <p className="muted text-sm">Every position has a holder.</p>
          ) : (
            <form onSubmit={handleAppoint} className="flex flex-col gap-4">
              <p className="muted text-sm">
                One holder per position. Only active members can be appointed.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="appoint-position"
                    className="mb-1 block text-sm font-medium"
                  >
                    Position
                  </label>
                  <select
                    id="appoint-position"
                    value={positionId}
                    onChange={(event) => setPositionId(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
                  >
                    <option value="">Choose a vacant position</option>
                    {vacant.map((row) => (
                      <option key={row.positionId} value={row.positionId}>
                        {row.positionName} · {unitName(row.unitId)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="appoint-member"
                    className="mb-1 block text-sm font-medium"
                  >
                    Member
                  </label>
                  <select
                    id="appoint-member"
                    value={memberId}
                    onChange={(event) => setMemberId(event.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
                  >
                    <option value="">Choose an active member</option>
                    {activeMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.fullName} · {member.memberNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {appointError && (
                <p role="alert" className="text-sm text-red-600">
                  {getErrorMessage(appointError)}
                </p>
              )}
              <div>
                <Button type="submit" loading={appointing}>
                  Appoint officeholder
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {endError && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(endError)}
        </p>
      )}

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Position</th>
                <th className="px-4 py-3 font-medium">Unit</th>
                <th className="px-4 py-3 font-medium">Current holder</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((row) => {
                const look = STATUS[row.status];
                return (
                  <tr key={row.positionId}>
                    <td className="px-4 py-3 font-medium">
                      {row.positionName}
                    </td>
                    <td className="px-4 py-3">{unitName(row.unitId)}</td>
                    <td className="px-4 py-3">
                      {row.holder ? row.holder.fullName : "No current holder"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusChip label={look.label} tone={look.tone} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {row.holder && can("leadership.manage") && (
                        <div className="flex flex-wrap items-start justify-end gap-2">
                          {!row.hasAccount && (
                            <InviteHolder
                              memberId={row.holder.memberId}
                              memberName={row.holder.fullName}
                            />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            loading={ending}
                            onClick={() =>
                              endAppointment({ positionId: row.positionId })
                            }
                          >
                            End appointment
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default LeadershipContent;
