import { ArrowRight } from "lucide-react";

export default function FinalCta() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-slate-950 px-8 py-16 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Could this change your career?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-200">
            Applications are reviewed on a rolling basis. Your next chapter
            could start with one application.
          </p>
          <a
            href="#"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition-colors hover:bg-slate-100"
          >
            See How to Apply
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
