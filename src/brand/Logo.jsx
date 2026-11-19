import { cn } from "../lib/cn";

// Daybreak mark: a sunrise node with a delivery arc fanning to two mouths.
export function BrandMark({ className, size = 34 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="13" fill="currentColor" />
      <circle cx="15" cy="24" r="4.4" fill="#fff" />
      <path d="M15 24 C26 24 30 15 40 13" fill="none" stroke="#ffd8c4" strokeWidth="3" strokeLinecap="round" />
      <path d="M15 24 C26 24 30 33 40 35" fill="none" stroke="#ffe4d0" strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="13" r="2.6" fill="#fff" />
      <circle cx="40" cy="35" r="2.6" fill="#fff" />
    </svg>
  );
}

export function Logo({ className, markClass = "text-brand-500", compact = false, invert = false }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <BrandMark className={markClass} size={compact ? 30 : 34} />
      {!compact && (
        <span className="leading-none font-display">
          <span className={cn("block text-[16px] font-bold tracking-tight", invert ? "text-white" : "text-navy-900")}>
            Nexbridge <span className={invert ? "text-brand-300" : "text-brand-700"}>Connect</span>
          </span>
          <span className={cn("block text-[11px] font-medium tracking-wide font-sans", invert ? "text-navy-200" : "text-navy-600")}>
            by Nexbridge Technology
          </span>
        </span>
      )}
    </span>
  );
}
