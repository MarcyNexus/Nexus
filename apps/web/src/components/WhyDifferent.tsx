import { Target, Heart, Users } from "lucide-react";
import Eyebrow from "./Eyebrow";

const PILLARS = [
  {
    icon: Target,
    iconClass: "bg-indigo-600",
    title: "Rigorous Program",
    description:
      "A full-time, project-based curriculum covering modern full-stack engineering — built for people who've never written a line of code.",
  },
  {
    icon: Heart,
    iconClass: "bg-emerald-600",
    title: "Radical Care",
    description:
      "Small cohorts, dedicated instructors, and a culture that treats emotional wellbeing as core infrastructure — not an afterthought.",
  },
  {
    icon: Users,
    iconClass: "bg-amber-500",
    title: "Lifetime Community",
    description:
      "Graduates join a growing network of engineers, mentors, and hiring partners that supports them for the rest of their careers.",
  },
];

export default function WhyDifferent() {
  return (
    <section className="bg-white pb-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Eyebrow>WHY MARCY IS DIFFERENT</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-950">
          Three pillars of the Marcy ecosystem
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-slate-200 p-6"
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl text-white ${pillar.iconClass}`}
              >
                <pillar.icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-slate-950">
                {pillar.title}
              </h3>
              <p className="mt-2 text-slate-600">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
