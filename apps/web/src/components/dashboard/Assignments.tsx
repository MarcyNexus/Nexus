"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";
import DashboardCard from "./DashboardCard";
import EmptyState from "./EmptyState";

const STATUS_STYLES = {
  "in progress": "bg-indigo-100 text-indigo-700",
  "not started": "bg-slate-100 text-slate-600",
  done: "bg-emerald-100 text-emerald-700",
} as const;

type Status = keyof typeof STATUS_STYLES;

// Cycling not started → in progress → done → not started, so clicking a
// pill is a real (if client-only) state change instead of a static label.
const NEXT_STATUS: Record<Status, Status> = {
  "not started": "in progress",
  "in progress": "done",
  done: "not started",
};

const INITIAL_ASSIGNMENTS: { title: string; due: string; status: Status }[] = [
  {
    title: "Capstone Architecture Doc",
    due: "Due tomorrow",
    status: "in progress",
  },
  { title: "Data Structures PS-6", due: "Due Fri", status: "not started" },
  { title: "Portfolio Site — Draft 1", due: "Submitted", status: "done" },
];

export default function Assignments() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);

  function cycleStatus(title: string) {
    setAssignments((current) =>
      current.map((item) =>
        item.title === title
          ? { ...item, status: NEXT_STATUS[item.status] }
          : item
      )
    );
  }

  return (
    <DashboardCard
      icon={ClipboardList}
      title="Assignments"
      action={{ label: "View all", href: "#" }}
    >
      {assignments.length === 0 ? (
        <EmptyState message="No assignments due." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {assignments.map((item) => (
            <li
              key={item.title}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-semibold text-slate-950">{item.title}</p>
                <p className="text-sm text-slate-500">{item.due}</p>
              </div>
              <button
                type="button"
                onClick={() => cycleStatus(item.title)}
                title="Click to update status"
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-75 ${STATUS_STYLES[item.status]}`}
              >
                {item.status}
              </button>
            </li>
          ))}
        </ul>
      )}
    </DashboardCard>
  );
}
