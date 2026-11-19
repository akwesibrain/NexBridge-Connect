import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "../../lib/cn";
import { Card } from "./Card";
export default function StatCard({ label, value, icon: Icon, trend, tone = "brand", hint }) {
  const tones = {
    brand: "bg-brand-50 text-brand-600", green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600", navy: "bg-navy-50 text-navy-700",
  };
  const up = (trend ?? 0) >= 0;
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-navy-600">{label}</span>
        {Icon && <span className={cn("grid h-9 w-9 place-items-center rounded-lg", tones[tone])}><Icon size={18} /></span>}
      </div>
      <div className="mt-3 font-mono text-2xl font-semibold tracking-tight text-navy-900">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-xs">
        {trend != null && (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", up ? "text-emerald-700" : "text-red-700")}>
            {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{Math.abs(trend)}%
          </span>
        )}
        {hint && <span className="text-navy-500">{hint}</span>}
      </div>
    </Card>
  );
}
