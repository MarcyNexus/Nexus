import { Mail, MapPin } from "lucide-react";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8.5h4.5V23H.24V8.5ZM8.5 8.5h4.31v1.98h.06c.6-1.14 2.07-2.34 4.26-2.34 4.56 0 5.4 3 5.4 6.9V23h-4.5v-6.14c0-1.46-.03-3.35-2.04-3.35-2.04 0-2.36 1.6-2.36 3.25V23H8.5V8.5Z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22 5.9c-.7.32-1.46.53-2.25.63a3.9 3.9 0 0 0 1.72-2.16 7.86 7.86 0 0 1-2.49.95 3.9 3.9 0 0 0-6.75 2.67c0 .3.04.6.1.89A11.07 11.07 0 0 1 1.64 4.7a3.9 3.9 0 0 0 1.21 5.2 3.87 3.87 0 0 1-1.77-.49v.05a3.9 3.9 0 0 0 3.13 3.82 3.9 3.9 0 0 1-1.76.07 3.9 3.9 0 0 0 3.64 2.71A7.83 7.83 0 0 1 0 17.54a11.05 11.05 0 0 0 5.98 1.75c7.17 0 11.1-5.94 11.1-11.1l-.01-.5A7.9 7.9 0 0 0 22 5.9Z" />
    </svg>
  );
}

const JOURNEY_LINKS = [
  "Discover",
  "Program",
  "Alumni Stories",
  "Capstones",
  "Media Hub",
];

const COMMUNITY_LINKS = ["Fellows", "Alumni", "Hiring Partners"];

function Logomark() {
  return (
    <span className="relative inline-block h-6 w-6 shrink-0">
      <span className="absolute left-1/2 top-1/2 h-[3px] w-6 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-full bg-white" />
      <span className="absolute left-1/2 top-1/2 h-[3px] w-6 -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-white" />
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2">
              <Logomark />
              <span className="text-lg font-bold text-white">
                Marcy Nexus
              </span>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Unlocking economic mobility through rigorous, tuition-free
              software engineering training — and a lifetime community that
              never lets go.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400">
              THE JOURNEY
            </p>
            <ul className="mt-4 space-y-3">
              {JOURNEY_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-300 hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400">
              COMMUNITY
            </p>
            <ul className="mt-4 space-y-3">
              {COMMUNITY_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-slate-300 hover:text-white"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-slate-400">
              CONTACT
            </p>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="h-4 w-4" />
                hello@marcylabschool.org
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="h-4 w-4" />
                Brooklyn, NY
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-4 text-slate-400">
              <a href="#" aria-label="Instagram" className="hover:text-white">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white">
                <LinkedinIcon />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-white">
                <TwitterIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-sm text-slate-400 sm:flex-row sm:justify-between">
          <p>© 2026 Marcy Nexus · Inspired by The Marcy Lab School</p>
          <p>Building the next generation of software engineers, one fellow at a time.</p>
        </div>
      </div>
    </footer>
  );
}
