// `fellowName` is a placeholder — once auth exists (docs/06-cookies-and-auth.md),
// this should read `profiles.full_name` for the logged-in user server-side.
const fellowName = "Fellow";

export default function DashboardHeader() {
  return (
    <div>
      <p className="text-slate-500">Welcome back,</p>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">
        {fellowName}
      </h1>
    </div>
  );
}
