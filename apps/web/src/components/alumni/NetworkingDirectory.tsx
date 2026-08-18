import { Users } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import EmptyState from "@/components/dashboard/EmptyState";

const CONTACTS = [
  { name: "Devon Carter", role: "Backend Engineer", company: "Bloomberg" },
  { name: "Amara Johnson", role: "Full-Stack Engineer", company: "Movable Ink" },
  { name: "Kevin Nguyen", role: "Software Engineer", company: "Bloomberg" },
];

export default function NetworkingDirectory() {
  return (
    <DashboardCard
      icon={Users}
      title="Networking Directory"
      action={{ label: "View all", href: "#" }}
    >
      {CONTACTS.length === 0 ? (
        <EmptyState message="No contacts to show yet." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {CONTACTS.map((contact) => (
            <li
              key={contact.name}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-950">{contact.name}</p>
                <p className="text-sm text-slate-500">
                  {contact.role} · {contact.company}
                </p>
              </div>
              <a
                href="#"
                className="shrink-0 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
