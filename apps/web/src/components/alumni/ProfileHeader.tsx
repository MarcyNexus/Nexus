import { LinkedinIcon } from "@/components/icons/BrandIcons";

// Placeholder alum — once auth exists (docs/06-cookies-and-auth.md), this
// should read the logged-in user's profiles/alumni_profiles row instead.
const ALUM = {
  initials: "JR",
  name: "Jasmine Rodriguez",
  cohort: "Cohort 4",
  role: "Software Engineer",
  company: "Squarespace",
};

export default function ProfileHeader() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-700">
          {ALUM.initials}
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-lg font-bold text-slate-950">{ALUM.name}</p>
            <span className="rounded-full border border-amber-300 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
              {ALUM.cohort}
            </span>
          </div>
          <p className="text-slate-600">
            {ALUM.role} · {ALUM.company}
          </p>
          <p className="text-sm text-slate-400">
            {ALUM.cohort} · Marcy Lab School
          </p>
        </div>
      </div>

      <a
        href="#"
        className="flex items-center justify-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        <LinkedinIcon className="h-4 w-4 text-indigo-600" />
        Connect LinkedIn
      </a>
    </div>
  );
}
