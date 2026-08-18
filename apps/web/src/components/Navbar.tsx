"use client";

const NAV_LINKS = [
  { label: "Discover", href: "#", active: true },
  { label: "Program", href: "#" },
  { label: "Alumni Stories", href: "#" },
  { label: "Capstones", href: "#" },
  { label: "Media Hub", href: "#" },
];

function Logomark() {
  return (
    <span className="relative inline-block h-6 w-6 shrink-0">
      <span className="absolute left-1/2 top-1/2 h-[3px] w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-slate-950" />
      <span className="absolute left-1/2 top-1/2 h-[3px] w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-slate-950" />
    </span>
  );
}

function ChevronDown() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#" className="flex items-center gap-2">
          <Logomark />
          <span className="text-lg font-bold tracking-tight text-slate-950">
            Marcy Nexus
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={
                link.active
                  ? "rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600"
                  : "rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              }
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
          >
            Community
            <ChevronDown />
          </button>
        </nav>

        <a
          href="#"
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          Apply
          <ArrowRight />
        </a>
      </div>
    </header>
  );
}
