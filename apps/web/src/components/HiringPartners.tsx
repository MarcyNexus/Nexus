import { Building2, ChevronRight } from "lucide-react";
import Eyebrow from "./Eyebrow";

const PARTNERS = [
  "Bloomberg",
  "Squarespace",
  "Justworks",
  "Movable Ink",
  "Blue Owl Capital",
  "Betterment",
  "Compass",
  "Framework Venture Partners",
];

export default function HiringPartners() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        <div className="flex flex-col items-center">
          <Eyebrow>TRUSTED BY</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950">
            Hiring partners who believe in Marcy talent
          </h2>
          <p className="mt-4 max-w-xl text-lg text-slate-600">
            Marcy graduates go on to build careers at mission-aligned
            companies across NYC tech and beyond.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {PARTNERS.map((partner) => (
            <span
              key={partner}
              className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
            >
              <Building2 className="h-4 w-4 text-slate-400" />
              {partner}
            </span>
          ))}
        </div>

        <a
          href="#"
          className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
        >
          Explore the Hiring Partners Portal
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
