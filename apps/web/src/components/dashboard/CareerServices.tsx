import { Sparkles } from "lucide-react";
import DashboardCard from "./DashboardCard";

export default function CareerServices() {
  return (
    <DashboardCard
      icon={Sparkles}
      title="Career Services"
      action={{ label: "Alumni outcomes", href: "#" }}
    >
      <p className="text-sm text-slate-600">
        Book resume reviews, mock interviews, and 1:1s with career coaches as
        you approach Career Launch.
      </p>
      <a
        href="#"
        className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Book a Session
      </a>
    </DashboardCard>
  );
}
