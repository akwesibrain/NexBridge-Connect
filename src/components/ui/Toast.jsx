import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "../../lib/cn";
const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);
const icons = { success: CheckCircle2, error: AlertTriangle, info: Info };
const tones = { success: "text-emerald-600", error: "text-red-600", info: "text-brand-600" };
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    setItems((x) => [...x, { id, msg, type }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3800);
  }, []);
  const api = { toast: push, success: (m) => push(m, "success"), error: (m) => push(m, "error"), info: (m) => push(m, "info") };
  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-5 right-5 z-[60] flex w-80 flex-col gap-2">
        {items.map((t) => {
          const Icon = icons[t.type];
          return (
            <div key={t.id} className="flex items-start gap-3 rounded-xl border border-[#efe7dd] bg-white p-3 shadow-pop">
              <Icon size={18} className={cn("mt-0.5 shrink-0", tones[t.type])} />
              <p className="flex-1 text-sm text-navy-800">{t.msg}</p>
              <button onClick={() => setItems((x) => x.filter((i) => i.id !== t.id))} className="text-navy-500 hover:text-navy-700"><X size={15} /></button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
