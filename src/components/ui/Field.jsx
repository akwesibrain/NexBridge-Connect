import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn";

export function PasswordInput({ className, ...p }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input type={show ? "text" : "password"} className={cn("nb-input pr-10", className)} {...p} />
      <button type="button" onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"} aria-pressed={show} tabIndex={-1}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-navy-500 transition hover:bg-surface-muted hover:text-navy-700">
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

export function Field({ label, hint, error, required, children, className }) {
  return (
    <div className={className}>
      {label && <label className="nb-label">{label}{required && <span className="text-red-500"> *</span>}</label>}
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p>
        : hint ? <p className="mt-1 text-xs text-navy-500">{hint}</p> : null}
    </div>
  );
}
export function Input({ className, ...p }) { return <input className={cn("nb-input", className)} {...p} />; }
export function Textarea({ className, ...p }) { return <textarea className={cn("nb-input resize-y", className)} {...p} />; }
export function Select({ className, children, ...p }) {
  return <select className={cn("nb-input appearance-none bg-no-repeat pr-9", className)}
    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")", backgroundPosition: "right .7rem center" }} {...p}>{children}</select>;
}
export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={cn("inline-flex h-6 w-11 items-center rounded-full transition", checked ? "bg-brand-600" : "bg-navy-200")}>
      <span className={cn("ml-0.5 h-5 w-5 rounded-full bg-white shadow transition", checked && "translate-x-5")} />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}
