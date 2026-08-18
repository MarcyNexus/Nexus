import { Gift } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function ReferralOpportunities() {
  return (
    <DashboardCard icon={Gift} title="Referral Opportunities">
      <p className="text-sm text-slate-600">
        Refer a fellow to an open role at your company and earn a referral
        bonus when they&rsquo;re hired.
      </p>
      <a
        href="#"
        className="mt-4 inline-block rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
      >
        Refer Someone
      </a>
    </DashboardCard>
  );
}
