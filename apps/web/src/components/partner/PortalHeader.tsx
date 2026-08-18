import { Calendar, Mail } from "lucide-react";

export default function PortalHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-slate-500">Hiring Partner Portal</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
          Recruit Marcy talent
        </h1>
      </div>

      <div className="flex gap-3">
        <a
          href="#"
          className="flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Calendar className="h-4 w-4" />
          Schedule Session
        </a>
        <a
          href="#"
          className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
        >
          <Mail className="h-4 w-4" />
          Contact Marcy
        </a>
      </div>
    </div>
  );
}
