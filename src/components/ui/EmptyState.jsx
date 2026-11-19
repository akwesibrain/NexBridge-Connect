import { cn } from "../../lib/cn";
export default function EmptyState({ icon: Icon, title, message, action, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0d8cf] bg-surface-muted/50 px-6 py-14 text-center", className)}>
      {Icon && <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-white text-navy-500 shadow-card"><Icon size={22} /></span>}
      <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-navy-600">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
