import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";
const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
  secondary: "bg-navy-800 text-white hover:bg-navy-900 shadow-sm",
  outline: "border border-[#e0d8cf] bg-white text-navy-800 hover:bg-surface-muted",
  ghost: "text-navy-700 hover:bg-surface-sunken",
  danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
};
const sizes = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-11 px-5 text-sm" };
export default function Button({ as: As = "button", variant = "primary", size = "md", icon: Icon, loading = false, className, children, disabled, ...p }) {
  const iconSize = size === "sm" ? 15 : 17;
  return (
    <As
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant], sizes[size], className
      )}
      disabled={As === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...p}
    >
      {loading ? <Loader2 size={iconSize} className="animate-spin" /> : Icon ? <Icon size={iconSize} /> : null}
      {children}
    </As>
  );
}
