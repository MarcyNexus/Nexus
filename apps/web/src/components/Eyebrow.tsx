export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-bold tracking-widest text-indigo-600">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      {children}
    </p>
  );
}
