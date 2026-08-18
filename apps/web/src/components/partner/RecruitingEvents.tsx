import { Calendar } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const EVENTS = [
  {
    date: "Jul 22",
    title: "Demo Day — Cohort 6",
    subtitle: "Capstone showcase · RSVP to attend",
  },
  {
    date: "Aug 5",
    title: "Mock Interview Panel",
    subtitle: "Volunteer interviewers needed",
  },
];

export default function RecruitingEvents() {
  return (
    <DashboardCard icon={Calendar} title="Recruiting Events">
      {EVENTS.length === 0 ? (
        <EmptyState message="No recruiting events scheduled." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {EVENTS.map((event) => (
            <li
              key={event.title}
              className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="w-14 shrink-0 text-sm font-semibold text-indigo-600">
                {event.date}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Calendar className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-slate-950">{event.title}</p>
                <p className="text-sm text-slate-500">{event.subtitle}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
