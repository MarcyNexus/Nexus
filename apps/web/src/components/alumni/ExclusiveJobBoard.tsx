import { Briefcase } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const JOBS = [
  {
    title: "Frontend Engineer",
    company: "Betterment",
    posted: "2d ago",
    tag: "Exclusive",
  },
  {
    title: "Backend Engineer, Payments",
    company: "Justworks",
    posted: "4d ago",
    tag: "Exclusive",
  },
  {
    title: "Full-Stack Engineer",
    company: "Compass",
    posted: "1w ago",
    tag: "Referral bonus",
  },
];

export default function ExclusiveJobBoard() {
  return (
    <DashboardCard
      icon={Briefcase}
      title="Exclusive Job Board"
      action={{ label: "See all roles", href: "#" }}
    >
      {JOBS.length === 0 ? (
        <EmptyState message="No open roles right now." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {JOBS.map((job) => (
            <li
              key={job.title}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-950">{job.title}</p>
                <p className="text-sm text-slate-500">
                  {job.company} · {job.posted}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {job.tag}
              </span>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
