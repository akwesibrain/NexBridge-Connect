import { useEffect, useState } from "react";

// Whether to show the entry splash for a page reached by client-side navigation
// (e.g. landing/login opened from inside the app). On the first hard load the
// static splash in index.html already covers things (window.__BOOT_DONE is not
// yet set), so this returns false then and avoids a double splash.
export function useEntrySplash(hold = 850) {
  const [splashing, setSplashing] = useState(
    () => typeof window !== "undefined" && !!window.__BOOT_DONE
  );
  useEffect(() => {
    if (!splashing) return;
    const t = setTimeout(() => setSplashing(false), hold);
    return () => clearTimeout(t);
  }, [splashing, hold]);
  return splashing;
}

// Full-screen brand splash. Rendered on its own (the page is gated behind it),
// so no page content sits focusable underneath while it shows.
export default function BootSplash() {
  return (
    <div className="nb-splash" role="status" aria-label="Loading Nexbridge Connect">
      <svg className="m" width="76" height="76" viewBox="0 0 48 48" aria-hidden="true">
        <rect width="48" height="48" rx="13" fill="#ef6a43" />
        <path className="arc" d="M15 24 C26 24 30 15 40 13" fill="none" stroke="#ffd8c4" strokeWidth="3" strokeLinecap="round" />
        <path className="arc arc2" d="M15 24 C26 24 30 33 40 35" fill="none" stroke="#ffe4d0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="13" r="2.6" fill="#fff" />
        <circle cx="40" cy="35" r="2.6" fill="#fff" />
        <circle className="src" cx="15" cy="24" r="4.4" fill="#fff" />
      </svg>
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <div className="word">Nexbridge <b>Connect</b></div>
        <div className="bar"><i /></div>
      </div>
    </div>
  );
}
