import { Bookmark } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const BOOKMARKS = [
  { title: "System Design Fundamentals — Wk 11 slides", type: "Slides" },
  { title: "Async/Await Deep Dive", type: "Article" },
  { title: "Mock Interview Rubric", type: "Doc" },
];

export default function Bookmarks() {
  return (
    <DashboardCard icon={Bookmark} title="Bookmarks">
      {BOOKMARKS.length === 0 ? (
        <EmptyState message="No bookmarks saved yet." />
      ) : (
      <ul className="space-y-4">
        {BOOKMARKS.map((item) => (
          <li key={item.title} className="flex items-start justify-between gap-3">
            <a href="#" className="font-semibold text-slate-950 hover:text-indigo-600">
              {item.title}
            </a>
            <span className="shrink-0 text-sm text-slate-400">{item.type}</span>
          </li>
        ))}
      </ul>
      )}
    </DashboardCard>
  );
}
