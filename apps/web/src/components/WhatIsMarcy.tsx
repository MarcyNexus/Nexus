import Eyebrow from "./Eyebrow";

export default function WhatIsMarcy() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow>WHAT IS MARCY?</Eyebrow>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">
            A career transformation, not just a coding class.
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Marcy Lab School exists to unlock economic mobility for young
            adults in NYC by training them as software engineers — free of
            cost, and free of the gatekeeping that keeps talented people out
            of tech. We combine rigorous technical training with radical
            care, so fellows don&rsquo;t just learn to code — they build the
            confidence, network, and identity of an engineer.
          </p>
        </div>
      </div>
    </section>
  );
}
