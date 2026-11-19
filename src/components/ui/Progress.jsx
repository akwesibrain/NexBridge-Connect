import { cn } from "../../lib/cn";
export default function Progress({ value = 0, tone = "brand", className }) {
  const tones = { brand: "bg-brand-500", green: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500", navy: "bg-navy-700" };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-sunken", className)}>
      <div className={cn("h-full rounded-full transition-all", tones[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
