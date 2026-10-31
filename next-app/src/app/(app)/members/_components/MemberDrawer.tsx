"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";
import type { Member } from "@/types";
import MemberStatusChip from "./MemberStatusChip";

type MemberDrawerProps = {
  member: Member;
  unitName: string;
  onClose: () => void;
};

const MemberDrawer = ({ member, unitName, onClose }: MemberDrawerProps) => {
  /**VARIABLES */
  // Newest first. Copy before reversing, because reverse() changes the original.
  const history = [...member.history].reverse();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /**COMPONENT */
  return (
    <>
      <button
        aria-label="Close member record"
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-drawer-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col gap-6 overflow-y-auto bg-white p-6 shadow-xl"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="muted text-sm">Member record</p>
            <h2 id="member-drawer-title" className="text-2xl font-semibold">
              {member.fullName}
            </h2>
            <div className="mt-2">
              <MemberStatusChip status={member.status} />
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </Button>
        </header>

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 rounded-lg bg-page p-4 text-sm">
          <dt className="muted">Member number</dt>
          <dd className="font-medium">{member.memberNumber}</dd>
          <dt className="muted">Unit</dt>
          <dd className="font-medium">{unitName}</dd>
        </dl>

        <section>
          <h3 className="mb-3 text-lg font-semibold">Record history</h3>
          <ol className="flex flex-col gap-4 border-l-2 border-gray-200 pl-4">
            {history.map((event) => (
              <li key={event.id}>
                {
                  <>
                    <p className="text-sm font-semibold">{event.text}</p>
                    <p className="muted text-xs">
                      {event.by} . {formatDateTime(event.at)}
                    </p>
                  </>
                }
              </li>
            ))}
          </ol>
          <p className="muted mt-4 text-xs">
            History stays with the member. Changes keep the earlier record
            visible.
          </p>
        </section>
      </aside>
    </>
  );
};

export default MemberDrawer;
