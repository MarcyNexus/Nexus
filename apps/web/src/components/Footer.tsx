import { Mail, MapPin } from "lucide-react";
import { InstagramIcon, LinkedinIcon, TwitterIcon } from "./icons/BrandIcons";

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
