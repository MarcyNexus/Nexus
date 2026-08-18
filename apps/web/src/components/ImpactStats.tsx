const STATS = [
  { value: "94%", label: "Graduates employed in tech" },
  { value: "250+", label: "Engineers in our alumni network" },
  { value: "$0", label: "Cost to every fellow" },
  { value: "25k+", label: "Avg. starting salary increase" },
];

export default function ImpactStats() {
  return (
    <section className="bg-slate-950 py-16">
      <div className="mx-auto max-w-6xl px-6 text-center lg:px-8">
        <p className="text-sm font-semibold tracking-widest text-slate-400">
          IMPACT, BY THE NUMBERS
        </p>
        <div className="mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
