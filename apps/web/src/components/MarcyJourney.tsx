"use client";

import { useState } from "react";
import {
  Compass,
  FileEdit,
  Code2,
  Rocket,
  Briefcase,
  Users,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import Eyebrow from "./Eyebrow";

type Step = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    icon: Compass,
    title: "Discover",
    description:
      "Every journey starts with a question: could this be for me? Explore Marcy's mission, meet the community, and see what a career in software engineering could actually look like — no experience required.",
  },
  {
    icon: FileEdit,
    title: "Apply",
    description:
      "A rolling application and interview process built to find grit and potential, not credentials. No degree or coding background required — just a willingness to work.",
  },
  {
    icon: Code2,
    title: "Program",
    description:
      "One year, full-time. Fellows go from zero to full-stack through project-based learning, small-group instruction, and constant real-world practice.",
  },
  {
    icon: Rocket,
    title: "Capstone",
    description:
      "Fellows ship a real product end-to-end — design, build, and demo it to engineers, funders, and hiring partners at Demo Day.",
  },
  {
    icon: Briefcase,
    title: "Hired",
    description:
      "Career support and a hiring-partner network help every fellow land their first engineering role — with an average starting salary increase of $25k+.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Graduation isn't the end. Alumni stay connected as mentors, speakers, and hiring referrals for the next cohort coming up behind them.",
  },
];

export default function MarcyJourney() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <Eyebrow>YOUR PATH</Eyebrow>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
          The Marcy Journey
        </h2>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Tap each stage to see how a Marcy fellow moves from curiosity to
          career — and eventually, back to community.
        </p>

        <div className="mt-10 space-y-4">
          {STEPS.map((step, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={step.title} className="relative flex gap-5">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                      isOpen
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <step.icon className="h-6 w-6" strokeWidth={2} />
                  </span>
                  {index < STEPS.length - 1 && (
                    <span className="mt-2 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-5 py-4 text-left"
                  >
                    <div>
                      <p className="text-sm text-slate-400">
                        Step {index + 1} of {STEPS.length}
                      </p>
                      <p className="text-lg font-bold text-indigo-600">
                        {step.title}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                      <div
                        className="relative flex h-40 items-center justify-center bg-gradient-to-br from-indigo-500 to-slate-950"
                        style={{
                          backgroundImage:
                            "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom right, var(--tw-gradient-stops))",
                          backgroundSize: "18px 18px, auto",
                        }}
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/40">
                          <step.icon
                            className="h-6 w-6 text-white/70"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                      <p className="p-5 text-slate-600">{step.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
