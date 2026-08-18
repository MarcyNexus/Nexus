import { ChevronRight } from "lucide-react";
import Eyebrow from "./Eyebrow";

const ALUMNI = [
  {
    initials: "JR",
    name: "Jasmine Rodriguez",
    cohort: "C4",
    role: "Software Engineer",
    company: "Squarespace",
    quote:
      "Marcy didn't just teach me to code — it taught me I belonged in rooms I never thought I'd enter.",
  },
  {
    initials: "DC",
    name: "Devon Carter",
    cohort: "C3",
    role: "Backend Engineer",
    company: "Bloomberg",
    quote:
      "The rigor was real, but so was the care. My cohort became family, and that family got me through it.",
  },
  {
    initials: "AJ",
    name: "Amara Johnson",
    cohort: "C5",
    role: "Full-Stack Engineer",
    company: "Movable Ink",
    quote:
      "I went from working retail to shipping production code in twelve months. Still feels unreal.",
  },
];

export default function AlumniOutcomes() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>REAL OUTCOMES</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
              Alumni building real careers
            </h2>
          </div>
          <a
            href="#"
            className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 sm:flex"
          >
            See all
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {ALUMNI.map((person) => (
            <div
              key={person.name}
              className="overflow-hidden rounded-2xl border border-slate-200"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-indigo-500 to-slate-950">
                <span className="text-3xl font-bold text-white/90">
                  {person.initials}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-950">{person.name}</p>
                  <span className="rounded-full border border-amber-300 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                    {person.cohort}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  {person.role} · {person.company}
                </p>
                <p className="mt-3 text-sm italic text-slate-600">
                  &ldquo;{person.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
