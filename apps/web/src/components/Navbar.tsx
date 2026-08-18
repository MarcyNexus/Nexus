"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Discover", href: "#", active: true },
  { label: "Program", href: "#" },
  { label: "Alumni Stories", href: "#" },
  { label: "Capstones", href: "#" },
  { label: "Media Hub", href: "#" },
];

// Role dashboards live here, not in the main nav — this is how /fellow,
// /alumni, and /partner get reached today, and where /teacher gets added
// once it's built (see docs/08-fellow-dashboard.md,
// docs/09-alumni-dashboard.md, docs/10-partner-portal.md). Each role gets
// its own top-level route, not nested under a shared /dashboard. "#" = not
// built yet.
const COMMUNITY_LINKS = [
  { label: "Fellows", href: "/fellow" },
  { label: "Alumni", href: "/alumni" },
  { label: "Teachers", href: "#" },
  { label: "Partners", href: "/partner" },
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

function CommunityDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        Community
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
          {COMMUNITY_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
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
          <CommunityDropdown />
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
