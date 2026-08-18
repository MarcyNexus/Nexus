import { Sparkles } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const FEATURED = [
  { initials: "TB", name: "Tiana Brooks", role: "Product Engineer", company: "Blue Owl Capital" },
  { initials: "MS", name: "Miguel Santos", role: "Software Engineer", company: "Justworks" },
];

export default function FeaturedAlumni() {
  return (
    <DashboardCard icon={Sparkles} title="Featured Alumni">
      {FEATURED.length === 0 ? (
        <EmptyState message="No featured alumni right now." />
      ) : (
        <ul className="space-y-4">
          {FEATURED.map((alum) => (
            <li key={alum.name} className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-900 text-sm font-semibold text-white">
                {alum.initials}
              </span>
              <div>
                <p className="font-semibold text-slate-950">{alum.name}</p>
                <p className="text-sm text-slate-500">
                  {alum.role} · {alum.company}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
