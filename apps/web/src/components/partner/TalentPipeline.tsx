import { Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const STATUS_STYLES = {
  Available: "bg-emerald-100 text-emerald-700",
  Interviewing: "bg-indigo-100 text-indigo-700",
} as const;

const CANDIDATES = [
  {
    initials: "AJ",
    name: "Amara Johnson",
    stack: "React · Node · Postgres · C5",
    status: "Available",
  },
  {
    initials: "KN",
    name: "Kevin Nguyen",
    stack: "TypeScript · GraphQL · C3",
    status: "Interviewing",
  },
  {
    initials: "MS",
    name: "Miguel Santos",
    stack: "Node · Express · AWS · C2",
    status: "Available",
  },
] satisfies { initials: string; name: string; stack: string; status: keyof typeof STATUS_STYLES }[];

export default function TalentPipeline() {
  return (
    <DashboardCard
      icon={Users}
      title="Talent Pipeline"
      action={{ label: "Explore capstones", href: "#" }}
    >
      {CANDIDATES.length === 0 ? (
        <EmptyState message="No candidates in the pipeline right now." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {CANDIDATES.map((candidate) => (
            <li
              key={candidate.name}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {candidate.initials}
                </span>
                <div>
                  <p className="font-semibold text-slate-950">
                    {candidate.name}
                  </p>
                  <p className="text-sm text-slate-500">{candidate.stack}</p>
                </div>
              </div>
              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[candidate.status]}`}
              >
                {candidate.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
