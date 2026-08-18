import { Quote } from "lucide-react";
import Eyebrow from "./Eyebrow";

const TESTIMONIALS = [
  {
    initials: "MS",
    name: "Miguel Santos",
    role: "Software Engineer",
    company: "Justworks",
    quote:
      "Every instructor knew my name and my story. That kind of care changes how hard you're willing to work.",
  },
  {
    initials: "TB",
    name: "Tiana Brooks",
    role: "Product Engineer",
    company: "Blue Owl Capital",
    quote:
      "Marcy gave me technical skills, but the confidence to negotiate my offer was just as valuable.",
  },
  {
    initials: "KN",
    name: "Kevin Nguyen",
    role: "Software Engineer",
    company: "Bloomberg",
    quote:
      "I walked in knowing nothing about engineering. I walked out with a career and a community for life.",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Eyebrow>IN THEIR WORDS</Eyebrow>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
          Testimonials from the Marcy community
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <Quote className="h-6 w-6 text-amber-400" fill="currentColor" />
              <p className="mt-4 italic text-slate-600">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold text-slate-950">{t.name}</p>
                  <p className="text-sm text-slate-500">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
