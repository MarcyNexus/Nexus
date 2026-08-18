import { TrendingUp, Handshake, LineChart, ArrowRight } from "lucide-react";

const STATS = [
  { icon: TrendingUp, value: "2.5x", label: "Income increase" },
  { icon: Handshake, value: "30+", label: "Funding & hiring partners" },
  { icon: LineChart, value: "5 yrs", label: "Track record of outcomes" },
];

export default function FundersInvestors() {
  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <span className="inline-block rounded-full bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-400">
          For Funders & Investors
        </span>
        <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white">
          Invest in economic mobility that compounds
        </h2>
        <p className="mt-6 text-lg leading-8 text-slate-300">
          Every fellow we train represents a measurable shift in generational
          income, a new engineer in the workforce, and stronger proof that
          talent is universal — even when opportunity isn&rsquo;t. Marcy
          partners with funders and mission-aligned companies to keep this
          fellowship tuition-free, forever.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-6">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <stat.icon className="mx-auto h-5 w-5 text-emerald-400" />
              <p className="mt-3 text-3xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
        >
          Partner With Us
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
