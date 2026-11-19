import { cn } from "../../lib/cn";

// Warm shimmer skeleton. Compose these to mirror the real layout.
export default function Skeleton({ className, rounded = "rounded-lg", ...rest }) {
  return <span className={cn("nb-skel block", rounded, className)} aria-hidden="true" {...rest} />;
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <span className={cn("block space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-3" style={i === lines - 1 ? { width: "65%" } : undefined} />
      ))}
    </span>
  );
}

export function SkeletonRow({ cols = 4 }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5" aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3.5", i === 0 ? "w-2/5" : "flex-1")} />
      ))}
    </div>
  );
}

export function SkeletonCircle({ size = 36, className }) {
  return <span className={cn("nb-skel block rounded-full", className)} style={{ width: size, height: size }} aria-hidden="true" />;
}
