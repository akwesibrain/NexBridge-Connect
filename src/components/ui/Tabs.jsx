import { cn } from "../../lib/cn";
export default function Tabs({ tabs, value, onChange, className }) {
  return (
    <div className={cn("flex gap-1 overflow-x-auto border-b border-[#efe7dd]", className)}>
      {tabs.map((t) => {
        const id = t.id ?? t;
        const label = t.label ?? t;
        const active = value === id;
        return (
          <button key={id} onClick={() => onChange(id)}
            className={cn("relative whitespace-nowrap px-3.5 py-2.5 text-sm font-medium transition",
              active ? "text-brand-700" : "text-navy-600 hover:text-navy-800")}>
            {label}{t.count != null && <span className="ml-1.5 rounded-full bg-surface-sunken px-1.5 py-0.5 text-xs">{t.count}</span>}
            {active && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        );
      })}
    </div>
  );
}
