import { Code2 } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const MODULES = [
  {
    percent: 72,
    track: "Core Engineering · Module 6",
    title: "Building REST APIs with Express",
  },
  {
    percent: 40,
    track: "Core Engineering · Module 7",
    title: "React State Management Patterns",
  },
  {
    percent: 100,
    track: "Core Engineering · Module 5",
    title: "SQL Joins & Data Modeling",
  },
];

export default function ContinueLearning() {
  return (
    <DashboardCard
      icon={Code2}
      title="Continue Learning"
      action={{ label: "All modules", href: "#" }}
    >
      {MODULES.length === 0 ? (
        <EmptyState message="No modules in progress." />
      ) : (
      <div className="grid gap-4 sm:grid-cols-3">
        {MODULES.map((mod) => (
          <div
            key={mod.title}
            className="rounded-xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-slate-950 text-white">
                <Code2 className="h-4 w-4" />
              </span>
              <span className="text-sm font-bold text-slate-950">
                {mod.percent}%
              </span>
            </div>
            <p className="mt-3 text-xs text-slate-500">{mod.track}</p>
            <p className="mt-1 text-sm font-semibold text-slate-950">
              {mod.title}
            </p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-indigo-600"
                style={{ width: `${mod.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      )}
    </DashboardCard>
  );
}
