import { MessageSquare } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const POSTS = [
  {
    initials: "AJ",
    name: "Amara Johnson",
    time: "3h ago",
    body: "Just shipped a feature that shaved 30% off our page load — Marcy fundamentals still paying off 3 years in.",
  },
  {
    initials: "DC",
    name: "Devon Carter",
    time: "1d ago",
    body: "Hosting an informal system design study group for anyone prepping for senior interviews — DM me.",
  },
];

export default function CommunityFeed() {
  return (
    <DashboardCard icon={MessageSquare} title="Community Feed">
      {POSTS.length === 0 ? (
        <EmptyState message="No posts yet." />
      ) : (
        <ul className="space-y-5">
          {POSTS.map((post) => (
            <li key={post.name} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {post.initials}
              </span>
              <div>
                <p className="text-sm">
                  <span className="font-semibold text-slate-950">
                    {post.name}
                  </span>{" "}
                  <span className="text-slate-400">{post.time}</span>
                </p>
                <p className="mt-1 text-sm text-slate-600">{post.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
