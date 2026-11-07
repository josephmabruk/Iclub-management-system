"use client";

import { useState } from "react";
import StatusChip from "@/components/shared/StatusChip";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StateLoading from "@/components/ui/StateLoading";
import { useAuth } from "@/hooks/useAuth";
import { formatDay, todayInNairobi } from "@/lib/format";
import { useGetActivitiesQuery } from "@/store/api/activitiesApi";
import type { Activity } from "@/types";
import ActivityActions from "./ActivityActions";
import CreateActivityForm from "./CreateActivityForm";
import { usePermissions } from "@/hooks/usePermissions";

type SectionProps = {
  title: string;
  items: Activity[];
  empty: string;
  unitName: (id: string | null) => string;
};

const Section = ({ title, items, empty, unitName }: SectionProps) => (
  <Card title={title} padded={false}>
    {items.length === 0 ? (
      <p className="muted p-5 text-sm">{empty}</p>
    ) : (
      <ul className="divide-y divide-gray-200">
        {items.map((a) => (
          <li key={a.id} className="flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="muted text-sm">
                  {formatDay(a.date)} · {a.startTime}–{a.endTime} · {a.location}
                </p>
                <p className="muted text-xs">{unitName(a.unitId)}</p>
              </div>
              <StatusChip
                label={a.status === "cancelled" ? "Cancelled" : "Scheduled"}
                tone={a.status === "cancelled" ? "bad" : "good"}
              />
            </div>
            <ActivityActions activity={a} />
          </li>
        ))}
      </ul>
    )}
  </Card>
);

const ActivitiesContent = () => {
  /**VARIABLES */
  const { user } = useAuth();
  const { data: activities, isLoading, isError } = useGetActivitiesQuery();
  const [creating, setCreating] = useState(false);
  const { can } = usePermissions();

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Loading activities..." />;
  if (isError || !activities) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load activities. Refresh to try again.
      </p>
    );
  }

  const units = user?.club?.units ?? [];
  const unitName = (id: string | null) =>
    id
      ? `${units.find((u) => u.id === id)?.name ?? "Unit"} only`
      : "Whole club";

  const today = todayInNairobi();
  const upcoming = activities.filter((a) => a.date >= today);
  const past = activities.filter((a) => a.date < today).reverse();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Activities</h1>
          <p className="muted">
            Plan your club&apos;s activities for Term {user?.club?.term?.name}.
          </p>
        </div>
        {!creating && (
          <Button
            onClick={() => setCreating(!creating && can("activities.manage"))}
          >
            Create activity
          </Button>
        )}
      </header>

      {creating && (
        <Card title="New activity">
          <CreateActivityForm onDone={() => setCreating(false)} />
        </Card>
      )}

      <Section
        title="Upcoming"
        items={upcoming}
        empty="No upcoming activities."
        unitName={unitName}
      />
      <Section
        title="Past"
        items={past}
        empty="No past activities yet."
        unitName={unitName}
      />
    </div>
  );
};

export default ActivitiesContent;
