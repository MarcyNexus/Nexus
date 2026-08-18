/**
 * Shared "nothing here yet" state for every list-based dashboard widget.
 * None of the mock arrays these widgets render are ever empty today, so this
 * never actually shows on screen right now — it exists so the widgets don't
 * silently render a blank card the day mock data is swapped for a real,
 * possibly-empty Supabase query. See docs/08-fellow-dashboard.md.
 */
export default function EmptyState({ message }: { message: string }) {
  return <p className="py-2 text-sm text-slate-400">{message}</p>;
}
