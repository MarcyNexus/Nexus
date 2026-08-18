import { Trophy } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const TIMELINE = [
  {
    year: "2024",
    title: "Graduated Marcy Lab School",
    subtitle: "Cohort 4 · Capstone: MetroTransit Live",
  },
  {
    year: "2024",
    title: "Software Engineer, Squarespace",
    subtitle: "Frontend Platform team",
  },
  {
    year: "2025",
    title: "Promoted to Software Engineer II",
    subtitle: "Led migration to design system v2",
  },
];

export default function CareerTimeline() {
  return (
    <DashboardCard icon={Trophy} title="Career Timeline">
      {TIMELINE.length === 0 ? (
        <EmptyState message="No career milestones logged yet." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {TIMELINE.map((item, index) => (
            <li
              key={`${item.year}-${index}`}
              className="flex gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="w-12 shrink-0 text-sm font-bold text-indigo-600">
                {item.year}
              </span>
              <div>
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="text-sm text-slate-500">{item.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
