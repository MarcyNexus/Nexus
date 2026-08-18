import { Sparkles } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const FELLOWS = [
  { initials: "JR", name: "Jasmine Rodriguez", project: "MetroTransit Live", cohort: "C4" },
  { initials: "DC", name: "Devon Carter", project: "ShelfLife", cohort: "C3" },
];

export default function FeaturedFellows() {
  return (
    <DashboardCard
      icon={Sparkles}
      title="Featured Fellows"
      action={{ label: "View all", href: "#" }}
    >
      {FELLOWS.length === 0 ? (
        <EmptyState message="No featured fellows right now." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {FELLOWS.map((fellow) => (
            <div key={fellow.name} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-slate-900 text-sm font-semibold text-white">
                {fellow.initials}
              </span>
              <div>
                <p className="font-semibold text-slate-950">{fellow.name}</p>
                <p className="text-sm text-slate-500">
                  {fellow.project} · {fellow.cohort}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
