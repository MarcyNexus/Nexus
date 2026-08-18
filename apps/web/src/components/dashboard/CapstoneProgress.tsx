import { Trophy } from "lucide-react";
import DashboardCard from "./DashboardCard";

const PROJECT = {
  name: "MetroTransit Live",
  phase: "Build Phase · Wk 3 of 4",
  percent: 63,
  note: "Backend API integration due Friday",
};

export default function CapstoneProgress() {
  return (
    <DashboardCard
      icon={Trophy}
      title="Capstone Progress"
      action={{ label: "View project", href: "#" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-bold text-slate-950">{PROJECT.name}</p>
          <p className="text-sm text-slate-500">{PROJECT.phase}</p>
        </div>
        <span className="text-2xl font-extrabold text-indigo-600">
          {PROJECT.percent}%
        </span>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-indigo-600"
          style={{ width: `${PROJECT.percent}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-slate-500">{PROJECT.note}</p>
    </DashboardCard>
  );
}
