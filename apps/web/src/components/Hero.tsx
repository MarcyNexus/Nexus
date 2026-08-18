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

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* vignette / glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/20 to-slate-950" />
      <div className="absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-6 py-28 text-center lg:px-8">
        <span className="inline-block rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-sm font-semibold text-amber-300">
          Brooklyn, NY · Tuition-Free Fellowship
        </span>

        <h1 className="mt-8 text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
          Build Your Future.
          <br />
          <span className="text-amber-400">Build the World.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300">
          The Marcy Lab School is a one-year, tuition-free fellowship that
          transforms ambitious young adults from underrepresented communities
          into professional software engineers — through rigor, radical care,
          and a community that lasts a lifetime. We&rsquo;re not just teaching
          people to code. We&rsquo;re building the technologists who will
          shape a world that was once closed to them.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#"
            className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Explore Journey
          </a>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            Apply Now
            <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  );
}
