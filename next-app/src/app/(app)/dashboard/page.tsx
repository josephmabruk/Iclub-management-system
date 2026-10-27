import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import WelcomeHeader from "./_components/WelcomeHeader";

export const metadata: Metadata = {
  title: "School dashboard",
};

const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <WelcomeHeader />
      <p className="muted -mt-6 text-sm">
        School overview <span aria-hidden="true">·</span> Sample data
      </p>

      <section aria-label="School summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Enrolled students", value: "1,248", detail: "Across 32 classes" },
          { label: "Present today", value: "1,183", detail: "94.8% attendance" },
          { label: "Teaching staff", value: "62", detail: "Across all departments" },
          { label: "Fees collected", value: "84%", detail: "Current term" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="muted text-sm">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
            <p className="muted mt-1 text-xs">{stat.detail}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card title="Attendance today">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold">94.8%</p>
              <p className="muted mt-1 text-sm">1,183 of 1,248 students present</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              On track
            </span>
          </div>
          <div
            aria-label="Attendance: 94.8 percent"
            className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            role="img"
          >
            <div className="h-full w-[94.8%] rounded-full bg-emerald-600" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              { grade: "Grade 10", present: "228 / 236", percent: "96.6%" },
              { grade: "Grade 9", present: "214 / 229", percent: "93.4%" },
              { grade: "Grade 8", present: "201 / 215", percent: "93.5%" },
            ].map((row) => (
              <div
                key={row.grade}
                className="flex items-center justify-between gap-4 text-sm"
              >
                <span className="font-medium">{row.grade}</span>
                <span className="muted">{row.present}</span>
                <span className="w-14 text-right tabular-nums">{row.percent}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Fee collection">
          <div className="mb-5">
            <p className="text-3xl font-semibold">ETB 2,940,000</p>
            <p className="muted mt-1 text-sm">Collected of ETB 3,500,000 due this term</p>
          </div>
          <div
            aria-label="Fee collection: 84 percent"
            className="h-2.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
            role="img"
          >
            <div className="h-full w-[84%] rounded-full bg-brand-600" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="muted text-xs">Received</p>
              <p className="mt-1 font-semibold">ETB 2.94M</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="muted text-xs">Outstanding</p>
              <p className="mt-1 font-semibold">ETB 560K</p>
            </div>
          </div>
          <p className="muted mt-4 text-xs">
            The dashboard records fee status only; no payments are processed.
          </p>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Recent student records">
          <div className="-mx-5 overflow-x-auto px-5">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead>
                <tr className="muted border-b border-gray-200 text-xs dark:border-gray-800">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Admission no.</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  { name: "Mekdes Bekele", className: "Grade 10A", id: "ST-2026-1248", status: "Active" },
                  { name: "Dawit Alemu", className: "Grade 9B", id: "ST-2026-1247", status: "Active" },
                  { name: "Hana Tesfaye", className: "Grade 8A", id: "ST-2026-1246", status: "Pending" },
                  { name: "Samuel Girma", className: "Grade 7C", id: "ST-2026-1245", status: "Active" },
                ].map((student) => (
                  <tr key={student.id}>
                    <td className="py-3 font-medium">{student.name}</td>
                    <td className="muted py-3">{student.className}</td>
                    <td className="muted py-3 tabular-nums">{student.id}</td>
                    <td className="py-3 text-right">
                      <span
                        className={
                          student.status === "Active"
                            ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Upcoming schedule">
          <ul className="space-y-4">
            {[
              { day: "08:30", title: "Morning assembly", detail: "Main courtyard" },
              { day: "10:00", title: "Science department", detail: "Staff room · Grade 9–10" },
              { day: "13:30", title: "Parent meeting", detail: "Room 12 · Grade 8B" },
              { day: "15:00", title: "Term assessment review", detail: "Academic office" },
            ].map((event) => (
              <li key={event.title} className="flex gap-3">
                <span className="w-12 shrink-0 pt-0.5 text-xs font-semibold tabular-nums text-brand-700 dark:text-brand-500">
                  {event.day}
                </span>
                <div className="min-w-0 border-l border-gray-200 pl-3 dark:border-gray-800">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="muted mt-0.5 text-xs">{event.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
};

export default DashboardPage;
