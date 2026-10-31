"use client";

import Link from "next/link";
import { useState } from "react";
import Button, { buttonStyles } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StateLoading from "@/components/ui/StateLoading";
import { MEMBER_STATUS_LABELS, ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useGetMembersQuery } from "@/store/api/membersApi";
import type { MemberStatus } from "@/types";
import AddMemberForm from "./AddMemberForm";
import MemberStatusChip from "./MemberStatusChip";
import MemberDrawer from "./MemberDrawer";

const MembersContent = () => {
  /**VARIABLES (all hooks first, before any early return) */
  const { user } = useAuth();
  const { data: members, isLoading, isError } = useGetMembersQuery();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<MemberStatus | "all">("all");
  const [adding, setAdding] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const club = user?.club;
  const units = club?.units ?? [];
  const canAdd = club?.membershipSource === "officer_added";

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading members..." />;
  if (isError || !members) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load members. Refresh to try again.
      </p>
    );
  }

  const unitName = (id: string | null) =>
    units.find((unit) => unit.id === id)?.name ?? "—";

  //to find the selected member
  const selected = members.find((member) => member.id === selectedId);

  const visible = members.filter((member) => {
    const text = `${member.fullName} ${member.memberNumber}`.toLowerCase();
    return (
      text.includes(search.trim().toLowerCase()) &&
      (status === "all" || member.status === status)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Members</h1>
          <p className="muted">
            {members.length} {members.length === 1 ? "person" : "people"} in
            your club register.
          </p>
        </div>
        {canAdd && !adding && (
          <Button onClick={() => setAdding(true)}>Add member</Button>
        )}

        {club?.membershipSource === "import_roster" && (
          <Link href = {ROUTES.membersImport} className = {buttonStyles()}>
            Import Roster
          </Link>
        )}

      </header>

      {adding && (
        <Card title="Add a member">
          <AddMemberForm onDone={() => setAdding(false)} />
        </Card>
      )}

      <Card padded={false}>
        <div className="flex flex-wrap gap-3 border-b border-gray-200 p-4">
          <div className="min-w-60 flex-1">
            <Input
              id="member-search"
              placeholder="Search by name or member number"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search members"
            />
          </div>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as MemberStatus | "all")
            }
            className="rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
          >
            <option value="all">All statuses</option>
            {Object.entries(MEMBER_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {members.length === 0 ? (
          <p className="muted p-6 text-sm">
            {canAdd
              ? "No members yet. Use “Add member” to enter your first one."
              : "No members yet. This club's membership follows an imported roster, so members arrive when you import one."}
          </p>
        ) : visible.length === 0 ? (
          <p className="muted p-6 text-sm">No members match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Member number</th>
                  <th className="px-4 py-3 font-medium">Full name</th>
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visible.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3">{member.memberNumber}</td>
                    <td className="px-4 py-3 font-medium">{member.fullName}</td>
                    <td className="px-4 py-3">{unitName(member.unitId)}</td>
                    <td className="px-4 py-3">
                      <MemberStatusChip status={member.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setSelectedId(member.id)}
                        className="hover-underline font-medium text-brand-700"
                      >
                        {member.fullName}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {selected && (
        <MemberDrawer
          member={selected}
          unitName={unitName(selected.unitId)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};

export default MembersContent;
