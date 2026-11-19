import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
export default function Modal({ open, onClose, title, subtitle, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }[size];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-navy-950/40 p-4 backdrop-blur-sm sm:p-6">
      <div className={cn("nb-scroll mt-10 w-full rounded-2xl bg-white shadow-pop", w)} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between border-b border-[#f3ece3] px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-navy-900">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-navy-600">{subtitle}</p>}
          </div>
          <button aria-label="Close" onClick={onClose} className="rounded-lg p-1.5 text-navy-500 hover:bg-surface-sunken hover:text-navy-800"><X size={18} /></button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-[#f3ece3] px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
