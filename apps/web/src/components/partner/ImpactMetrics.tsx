import { Trophy } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";

const METRICS = [
  { label: "Fellows hired", value: "37" },
  { label: "Avg. income increase", value: "2.5x" },
  { label: "Years partnered", value: "5" },
];

export default function ImpactMetrics() {
  return (
    <DashboardCard icon={Trophy} title="Impact Metrics">
      <ul className="divide-y divide-slate-100">
        {METRICS.map((metric) => (
          <li
            key={metric.label}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <p className="text-slate-600">{metric.label}</p>
            <p className="font-bold text-slate-950">{metric.value}</p>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
}
