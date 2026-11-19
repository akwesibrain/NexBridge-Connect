import { cn } from "../../lib/cn";
const tones = {
  gray: "bg-surface-sunken text-navy-800 ring-[#efe7dd]",
  blue: "bg-brand-50 text-brand-700 ring-brand-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  navy: "bg-navy-50 text-navy-700 ring-navy-200",
};
export const statusTone = {
  delivered: "green", approved: "green", active: "green", completed: "green", success: "green", paid: "green",
  pending: "amber", scheduled: "amber", processing: "amber", queued: "amber", draft: "gray",
  failed: "red", rejected: "red", cancelled: "red", revoked: "red", suspended: "red",
};
export default function Badge({ tone, status, children, className }) {
  const t = tone || statusTone[String(status || children).toLowerCase()] || "gray";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset", tones[t], className)}>
      {children || status}
    </span>
  );
}
