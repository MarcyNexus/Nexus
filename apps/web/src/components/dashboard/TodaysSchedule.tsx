import { Calendar } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const SCHEDULE = [
  { time: "9:00a", title: "Standup — Cohort 6", subtitle: "Daily sync · Room 2B" },
  {
    time: "11:00a",
    title: "React Patterns Workshop",
    subtitle: "Core Engineering · Wk 9",
  },
  {
    time: "2:00p",
    title: "1:1 Office Hours w/ Instructor Lee",
    subtitle: "Capstone architecture review",
  },
  {
    time: "4:30p",
    title: "Study Group — Data Structures",
    subtitle: "Self-organized · Library",
  },
];

export default function TodaysSchedule() {
  return (
    <DashboardCard
      icon={Calendar}
      title="Today's Schedule"
      action={{ label: "Full calendar", href: "#" }}
    >
      {SCHEDULE.length === 0 ? (
        <EmptyState message="Nothing on your schedule today." />
      ) : (
      <ul className="divide-y divide-slate-100">
        {SCHEDULE.map((event) => (
          <li key={event.title} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <span className="w-14 shrink-0 text-sm font-semibold text-indigo-600">
              {event.time}
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold text-slate-950">{event.title}</p>
              <p className="text-sm text-slate-500">{event.subtitle}</p>
            </div>
          </li>
        ))}
      </ul>
      )}
    </DashboardCard>
  );
}
