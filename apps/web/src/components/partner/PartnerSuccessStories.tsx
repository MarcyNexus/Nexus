import { Building2, Quote } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const STORIES = [
  {
    company: "Bloomberg",
    quote:
      "Marcy graduates arrive production-ready — we've hired six in the last two years.",
    attribution: "Eng. Talent Team",
  },
  {
    company: "Squarespace",
    quote:
      "The capstone rigor means candidates already think like product engineers.",
    attribution: "Hiring Manager, Platform",
  },
];

export default function PartnerSuccessStories() {
  return (
    <DashboardCard icon={Quote} title="Partner Success Stories">
      {STORIES.length === 0 ? (
        <EmptyState message="No partner stories yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {STORIES.map((story) => (
            <div
              key={story.company}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-indigo-600" />
                <p className="font-semibold text-slate-950">
                  {story.company}
                </p>
              </div>
              <p className="mt-3 text-sm italic text-slate-600">
                &ldquo;{story.quote}&rdquo;
              </p>
              <p className="mt-3 text-sm text-slate-400">
                {story.attribution}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
