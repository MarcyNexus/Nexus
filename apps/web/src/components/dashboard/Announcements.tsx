import { Megaphone } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const ANNOUNCEMENTS = [
  {
    title: "Demo Day is 3 weeks out",
    time: "1h ago",
    body: "Capstone check-ins move to twice weekly starting Monday.",
    tag: "Cohort 6",
  },
  {
    title: "New office hours slot added",
    time: "Yesterday",
    body: "Instructor Lee added Thursday 3–5pm for architecture reviews.",
    tag: "Career Services",
  },
  {
    title: "Resume review sign-ups open",
    time: "2 days ago",
    body: "Book a 1:1 resume review with a career coach before Career Launch.",
    tag: "Career Services",
  },
];

export default function Announcements() {
  return (
    <DashboardCard icon={Megaphone} title="Announcements">
      {ANNOUNCEMENTS.length === 0 ? (
        <EmptyState message="No announcements yet." />
      ) : (
      <ul className="space-y-5">
        {ANNOUNCEMENTS.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
            <div>
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-semibold text-slate-950">{item.title}</p>
                <span className="shrink-0 text-xs text-slate-400">
                  {item.time}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {item.tag}
              </span>
            </div>
          </li>
        ))}
      </ul>
      )}
    </DashboardCard>
  );
}
