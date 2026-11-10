"use client";

import { useState } from "react";
import StatusChip from "@/components/shared/StatusChip";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StateLoading from "@/components/ui/StateLoading";
import { DOCUMENT_TYPES, RECORD_KINDS } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { formatDateTime } from "@/lib/format";
import { useGetRecordsQuery } from "@/store/api/recordsApi";
import type { CustodyEvent, RecordKind, RecordState } from "@/types";
import RecordActions from "./RecordActions";
import RegisterRecordForm from "./RegisterRecordForm";

const STATE: Record<
  RecordState,
  { label: string; tone: "good" | "bad" | "neutral" }
> = {
  held: { label: "In custody", tone: "good" },
  lost: { label: "Lost", tone: "bad" },
  disposed: { label: "Disposed", tone: "neutral" },
  written_off: { label: "Written off", tone: "neutral" },
};

const SELECT = "rounded-lg border border-gray-300 bg-white p-2.5 text-sm";

const RecordsContent = () => {
  /**VARIABLES (all hooks first) */
  const { user } = useAuth();
  const { can } = usePermissions();
  const { data: items, isLoading, isError } = useGetRecordsQuery();
  const [registering, setRegistering] = useState(false);
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<RecordKind | "all">("all");
  const [docType, setDocType] = useState("all");
  const [onlyOutstanding, setOnlyOutstanding] = useState(false);

  const club = user?.club;
  const units = club?.units ?? [];
  const offices = (club?.positions ?? []).map((p) => ({
    id: p.id,
    label: p.unitId
      ? `${p.name} · ${units.find((u) => u.id === p.unitId)?.name ?? "Unit"}`
      : p.name,
  }));
  const officeLabel = (id: string) =>
    offices.find((o) => o.id === id)?.label ?? "Unknown office";

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading records..." />;
  if (isError || !items) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load records. Refresh to try again.
      </p>
    );
  }

  const canManage = can("records.manage");
  const unheld = items.filter(
    (item) => item.state === "held" && item.custodian === null,
  );

  //   - keep an item when ALL of these are true:
  //   - its name, location, mark or office name contains the search text (ignore capitals)
  //   - kind is "all" or equals item.kind
  //   - docType is "all" or equals item.docType
  //   - onlyOutstanding is off, or the item is outstanding and still held
  const visible = items.filter((item) => {
    const query = search.trim().toLowerCase();
    const searchable = [item.name, item.location, item.mark, item.officeName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = !query || searchable.includes(query);
    const matchesKind = kind === "all" || item.kind === kind;
    const matchesDocType = docType === "all" || item.docType === docType;
    const matchesOutstanding =
       !onlyOutstanding || (!!item.outstanding && item.state === "held");

    return matchesSearch && matchesKind && matchesDocType && matchesOutstanding;
  });

  const describe = (event: CustodyEvent) =>
    event.fromOfficeId &&
    event.toOfficeId &&
    event.fromOfficeId !== event.toOfficeId
      ? `Transferred from ${officeLabel(event.fromOfficeId)} to ${officeLabel(event.toOfficeId)}. Reason: ${event.reason}`
      : event.reason;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Records &amp; custody</h1>
          <p className="muted">
            Where the club&apos;s documents, property and accounts are held.
            Custody belongs to an office and moves with it.
          </p>
        </div>
        {canManage && !registering && (
          <Button onClick={() => setRegistering(true)}>Register an item</Button>
        )}
      </header>

      {registering && (
        <Card title="Register an item">
          <RegisterRecordForm
            offices={offices}
            onDone={() => setRegistering(false)}
          />
        </Card>
      )}

      {unheld.length > 0 && (
        <p className="rounded-lg bg-warn-50 p-3 text-sm text-amber-800">
          {unheld.length} items are held by an office with no current holder.
          Appoint someone to that office on the Leadership page.
        </p>
      )}

      <Card padded={false}>
        <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4">
          <div className="min-w-56 flex-1">
            <Input
              id="record-search"
              placeholder="Search items"
              aria-label="Search items"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            aria-label="Filter by kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as RecordKind | "all")}
            className={SELECT}
          >
            <option value="all">All kinds</option>
            {Object.entries(RECORD_KINDS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by document type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className={SELECT}
          >
            <option value="all">All document types</option>
            {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyOutstanding}
              onChange={(e) => setOnlyOutstanding(e.target.checked)}
              className="accent-brand-600"
            />
            Outstanding only
          </label>
        </div>

        {items.length === 0 ? (
          <p className="muted p-6 text-sm">
            Nothing registered yet.{" "}
            {canManage
              ? "Use “Register an item” to record where your first document or asset is held."
              : "An officeholder can register items."}
          </p>
        ) : visible.length === 0 ? (
          <p className="muted p-6 text-sm">No items match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Holding office</th>
                  <th className="px-4 py-3 font-medium">Custodian</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {visible.map((item) => {
                  const state = STATE[item.state];
                  return (
                    <tr key={item.id} className="align-top">
                      <td className="px-4 py-3">
                        <span className="font-medium">{item.name}</span>
                        <span className="muted block text-xs">
                          {RECORD_KINDS[item.kind]}
                          {item.docType && ` · ${DOCUMENT_TYPES[item.docType]}`}
                          {item.period && ` · ${item.period}`}
                          {item.mark && ` · ${item.mark}`}
                        </span>
                        <details className="mt-1">
                          <summary className="cursor-pointer text-xs text-brand-700">
                            Chain of custody ({item.custodyLog.length})
                          </summary>
                          <ol className="mt-2 flex flex-col gap-2 border-l-2 border-gray-200 pl-3 text-xs">
                            {item.custodyLog.map((event) => (
                              <li key={event.id}>
                                <p>{describe(event)}</p>
                                <p className="muted">
                                  {event.by} · {formatDateTime(event.at)}
                                </p>
                              </li>
                            ))}
                          </ol>
                        </details>
                      </td>
                      <td className="px-4 py-3">{item.officeName}</td>
                      <td className="px-4 py-3">
                        {item.state !== "held"
                          ? "—"
                          : (item.custodian ?? (
                              <StatusChip label="Unheld" tone="warn" />
                            ))}
                      </td>
                      <td className="px-4 py-3">{item.location}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <StatusChip label={state.label} tone={state.tone} />
                          {item.outstanding && item.state === "held" && (
                            <>
                              <StatusChip label="Outstanding" tone="warn" />
                              <span className="muted text-xs">
                                {item.outstanding.note}
                              </span>
                            </>
                          )}
                          {item.stateNote && (
                            <span className="muted text-xs">
                              {item.stateNote}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RecordActions
                          item={item}
                          offices={offices}
                          canManage={canManage}
                          canWriteOff={can("club.manage")}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default RecordsContent;
