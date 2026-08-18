import type { LucideIcon } from "lucide-react";

type DashboardCardProps = {
  icon: LucideIcon;
  title: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
};

/**
 * Shared shell for every dashboard widget: icon + title on the left,
 * an optional "View all" / "Full calendar"-style link on the right.
 * Every widget on /dashboard (Announcements, Assignments, Today's Schedule,
 * etc.) is this same header + whatever content it passes as children.
 */
export default function DashboardCard({
  icon: Icon,
  title,
  action,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="font-bold text-slate-950">{title}</h3>
        </div>
        {action && (
          <a
            href={action.href}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            {action.label}
          </a>
        )}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
