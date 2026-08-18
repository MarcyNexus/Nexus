import { ChevronRight, TrainFront, Leaf, DollarSign, Trophy, ExternalLink } from "lucide-react";
import Eyebrow from "./Eyebrow";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
      />
    </svg>
  );
}

const PROJECTS = [
  {
    icon: TrainFront,
    gradient: "from-indigo-500 to-slate-950",
    tag: "Civic Tech",
    title: "MetroTransit Live",
    description:
      "Real-time NYC subway delay tracker with predictive ETA modeling for daily commuters.",
    tech: ["React", "Node.js", "MTA API"],
    achievement: "Selected for the NYC Transit Hackathon Demo Day showcase.",
    people: "Jasmine Rodriguez",
    cohort: "C4",
  },
  {
    icon: Leaf,
    gradient: "from-emerald-500 to-slate-950",
    tag: "Sustainability",
    title: "ShelfLife",
    description:
      "Food expiration tracker that reduces household waste using barcode scanning and reminders.",
    tech: ["React Native", "Express", "PostgreSQL"],
    achievement: "Piloted with 3 Brooklyn food pantries to reduce spoilage.",
    people: "Devon Carter",
    cohort: "C3",
  },
  {
    icon: DollarSign,
    gradient: "from-amber-500 to-slate-950",
    tag: "FinTech",
    title: "GigWise Budget",
    description:
      "Personal finance dashboard for gig workers to track irregular income and savings goals.",
    tech: ["Next.js", "Chart.js", "Supabase"],
    achievement: "Featured in Marcy's Demo Day investor showcase.",
    people: "Amara Johnson, Tiana Brooks",
    cohort: "C5",
  },
];

export default function ProjectsShowcase() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>APPLIED LEARNING</Eyebrow>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
              Fellows ship real products
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
          {PROJECTS.map((project) => (
            <div
              key={project.title}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div
                className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${project.gradient}`}
              >
                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-950">
                  {project.tag}
                </span>
                <project.icon
                  className="h-10 w-10 text-white/40"
                  strokeWidth={1.5}
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-slate-950">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  <Trophy className="mt-0.5 h-4 w-4 shrink-0" />
                  {project.achievement}
                </div>
                <p className="mt-4 text-sm text-slate-500">
                  {project.people} · Cohort {project.cohort}
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href="#"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Demo
                  </a>
                  <a
                    href="#"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <GithubIcon />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
