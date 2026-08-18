import { BookOpen } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const GITBOOKS = [
  { title: "Git Branching Strategies", updated: "Updated 2h ago" },
  { title: "Capstone Proposal Template", updated: "Updated yesterday" },
  { title: "Interview Prep Playbook", updated: "Updated 3 days ago" },
];

export default function RecentGitbooks() {
  return (
    <DashboardCard
      icon={BookOpen}
      title="Recent GitBooks"
      action={{ label: "View all", href: "#" }}
    >
      {GITBOOKS.length === 0 ? (
        <EmptyState message="No recent GitBooks." />
      ) : (
      <ul className="space-y-4">
        {GITBOOKS.map((doc) => (
          <li key={doc.title}>
            <a href="#" className="font-semibold text-slate-950 hover:text-indigo-600">
              {doc.title}
            </a>
            <p className="text-sm text-slate-500">{doc.updated}</p>
          </li>
        ))}
      </ul>
      )}
    </DashboardCard>
  );
}
