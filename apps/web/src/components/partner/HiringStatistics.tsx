import Eyebrow from "@/components/Eyebrow";

const STATS = [
  { label: "Graduate hire rate", value: "94%", delta: "+3% YoY" },
  { label: "Avg. time to hire", value: "18 days", delta: "-5 days YoY" },
  { label: "Retention at 12mo", value: "91%", delta: "+2% YoY" },
];

export default function HiringStatistics() {
  return (
    <div>
      <Eyebrow>HIRING STATISTICS</Eyebrow>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
        Track record with Marcy graduates
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 p-5"
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-emerald-600">
              {stat.delta}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
