import Eyebrow from "@/components/Eyebrow";

const MILESTONES = [
  { label: "Years in industry", value: "2" },
  { label: "Promotions", value: "1" },
  { label: "Fellows mentored", value: "4" },
];

export default function CareerMilestones() {
  return (
    <div>
      <Eyebrow>YOUR PROGRESS</Eyebrow>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
        Career milestones
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {MILESTONES.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 p-5"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-extrabold text-slate-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
