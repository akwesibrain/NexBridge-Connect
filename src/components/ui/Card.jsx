import { cn } from "../../lib/cn";
export function Card({ className, children, ...p }) {
  return <div className={cn("nb-card", className)} {...p}>{children}</div>;
}
export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-[#f3ece3] px-5 py-4", className)}>
      <div>
        <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-navy-600">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function CardBody({ className, children }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}
