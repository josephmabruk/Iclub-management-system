"use client";

import Card from "@/components/ui/Card";
import StateLoading from "@/components/ui/StateLoading";
import { useAuth } from "@/hooks/useAuth";
import { useGetHomeSummaryQuery } from "@/store/api/homeApi";
import StatCard from "./StatCard";

const HomeContent = () => {
  /**VARIABLES */
  const { user } = useAuth();
  const { data, isLoading, isError } = useGetHomeSummaryQuery();
  const firstName = user?.name.split(" ")[0];

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Medi Boiz...." />;

  if (isError || !data) {
    return (
      <p role="alert" className="text-sm text-red-600">
        Could not load the summary. Refresh to try again.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-semibold">Welcome, {firstName}</h1>
        <p className="muted">
          Your committee at a glance for Term {user?.club?.term?.name}.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Active members"
          value={data.activeMembers}
          note="Current term"
        />
        <StatCard
          label="Upcoming activities"
          value={data.upcomingActivities.length}
          note="Scheduled"
        />
        <StatCard
          label="Leadership vacancies"
          value={data.leadershipVacancies}
          note="Offices to be filled"
        />
      </div>

      <Card title="Upcoming activities">
        {data.upcomingActivities.length === 0 ? (
          <p className="muted text-sm">
            No activities yet. They will appear here once you create them.
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {data.upcomingActivities.map((activity) => (
              <li
                key={activity.id}
                className="flex justify-between py-3 text-sm"
              >
                <span className="font-medium">{activity.name}</span>
                <span className="muted">
                  {activity.date} · {activity.startTime}–{activity.endTime}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default HomeContent;