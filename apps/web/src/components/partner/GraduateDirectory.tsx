import { Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function GraduateDirectory() {
  return (
    <DashboardCard
      icon={Users}
      title="Graduate Directory"
      action={{ label: "Full directory", href: "#" }}
    >
      <p className="text-sm text-slate-600">
        Browse the full directory of job-ready graduates filtered by stack,
        cohort, and availability.
      </p>
      <a
        href="#"
        className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Browse Directory
      </a>
    </DashboardCard>
  );
}
