"use client";

import { useState } from "react";
import { Clock, ClipboardCheck, MessageSquareText, Users } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

const ACTIONS = [
  { icon: Clock, iconClass: "bg-indigo-600", label: "Book Office Hours" },
  { icon: ClipboardCheck, iconClass: "bg-emerald-600", label: "Submit Assignment" },
  { icon: MessageSquareText, iconClass: "bg-amber-500", label: "Resume Review" },
  { icon: Users, iconClass: "bg-rose-500", label: "Join Study Group" },
];

export default function QuickActions() {
  // No booking/submission backend exists yet, so a click can't do anything
  // real — this just proves the buttons are wired to something instead of
  // being static markup. Real behavior (open a booking flow, jump to the
  // Assignments card, etc.) replaces this once each action has somewhere to
  // go.
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div>
      <Eyebrow>QUICK ACTIONS</Eyebrow>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
        Jump back in
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => setClicked(action.label)}
            className="rounded-2xl border border-slate-200 p-5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${action.iconClass}`}
            >
              <action.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold text-slate-950">{action.label}</p>
          </button>
        ))}
      </div>

      {clicked && (
        <p className="mt-3 text-sm text-slate-500">
          &ldquo;{clicked}&rdquo; isn&rsquo;t wired to anything yet — no
          booking/submission backend exists to send it to.
        </p>
      )}
    </div>
  );
}
