import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu, X, Search, Bell, ChevronDown, LogOut, PanelLeftClose, PanelLeft, Wallet, LifeBuoy, User, CheckCheck,
} from "lucide-react";
import { Logo, BrandMark } from "../brand/Logo";
import { cn } from "../lib/cn";
import { useAuth } from "../lib/auth.jsx";
import { fmtInt, relTime } from "../lib/format";
import { ORG, ACTIVITY } from "../data/mock";

function SidebarNav({ nav, collapsed, onNavigate, dark }) {
  return (
    <nav className="nb-scroll flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {nav.map((section) => (
        <div key={section.group}>
          {!collapsed && (
            <p className={cn("mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider", dark ? "text-white/55" : "text-navy-500")}>{section.group}</p>
          )}
          <div className="space-y-0.5">
            {section.items.map((it) => (
              <NavLink key={it.to} to={it.to} end={it.end} onClick={onNavigate}
                title={collapsed ? it.label : undefined}
                className={({ isActive }) => cn(
                  "group flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-sm font-medium transition",
                  collapsed && "justify-center",
                  isActive
                    ? (dark ? "bg-white/10 text-white" : "bg-brand-50 text-brand-700")
                    : (dark ? "text-white/70 hover:bg-white/5 hover:text-white" : "text-navy-600 hover:bg-surface-muted hover:text-navy-900")
                )}>
                {({ isActive }) => (
                  <>
                    <it.icon size={18} strokeWidth={1.8} className={cn("shrink-0",
                      isActive ? (dark ? "text-brand-300" : "text-brand-600")
                               : (dark ? "text-white/55" : "text-navy-400 group-hover:text-navy-600"))} />
                    {!collapsed && <span className="truncate">{it.label}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export default function DashboardShell({ nav, variant = "customer", children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(18);
    const t1 = setTimeout(() => setProgress(72), 90);
    const t2 = setTimeout(() => setProgress(100), 380);
    const t3 = setTimeout(() => setProgress(0), 720);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [location.pathname]);
  const isAdmin = variant === "admin";
  const dark = isAdmin; // admin console gets the warm "evening" sidebar

  const Sidebar = (
    <div className={cn("flex h-full flex-col", collapsed ? "w-[72px]" : "w-[248px]",
      dark ? "bg-navy-900 text-white" : "bg-white border-r border-[#efe7dd]")}>
      <div className={cn("flex h-16 items-center px-4", dark ? "border-b border-white/10" : "border-b border-[#efe7dd]", collapsed && "justify-center px-0")}>
        {collapsed ? <BrandMark className={dark ? "text-white" : "text-brand-500"} size={30} />
          : <Logo markClass="text-brand-500" invert={dark} />}
      </div>
      {isAdmin && !collapsed && (
        <div className="mx-3 mt-3 rounded-[10px] bg-brand-500/15 px-3 py-2 text-xs font-semibold text-brand-200 ring-1 ring-brand-400/30">
          Admin console
        </div>
      )}
      <SidebarNav nav={nav} collapsed={collapsed} dark={dark} onNavigate={() => setMobileOpen(false)} />
      <div className={cn("p-3", dark ? "border-t border-white/10" : "border-t border-[#efe7dd]")}>
        <button onClick={() => setCollapsed((c) => !c)}
          className={cn("hidden w-full items-center gap-3 rounded-[10px] border border-transparent px-2.5 py-2 text-sm font-medium lg:flex",
            dark ? "text-white/70 hover:bg-white/5 hover:text-white" : "text-navy-600 hover:bg-surface-muted hover:text-navy-900")}>
          {collapsed ? <PanelLeft size={18} /> : <><PanelLeftClose size={18} /> Collapse</>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-surface-muted">
      {/* route progress bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5" aria-hidden="true">
        <div className="nb-bar-fill h-full bg-brand-500 transition-[width,opacity] duration-300 ease-out"
          style={{ width: `${progress}%`, opacity: progress === 0 ? 0 : 1 }} />
      </div>
      <aside className="hidden lg:block">{Sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full shadow-pop">{Sidebar}</div>
          <button onClick={() => setMobileOpen(false)} className="absolute right-4 top-4 rounded-lg bg-white/90 p-2 text-navy-800 shadow-card"><X size={18} /></button>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[#efe7dd] bg-white/85 px-4 backdrop-blur lg:px-6">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="rounded-lg p-2 text-navy-700 hover:bg-surface-muted lg:hidden"><Menu size={20} /></button>
          {/* search fills the space left of the cluster and centres within it */}
          <div className="hidden min-w-0 flex-1 md:block">
            <form onSubmit={(e) => { e.preventDefault(); navigate(isAdmin ? "/admin/customers" : "/app/history"); }} className="relative mx-auto w-full max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
              <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} aria-label="Search" placeholder={isAdmin ? "Search customers, transactions…" : "Search messages, contacts…"} className="nb-input pl-9" />
            </form>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            {!isAdmin && (
              <div className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-[10px] bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700 sm:flex">
                <Wallet size={15} /> <span className="font-mono">{fmtInt(ORG.credits)}</span> <span className="font-normal text-brand-700">credits</span>
              </div>
            )}
            <div className="relative">
              <button aria-label="Notifications" onClick={() => setNotifOpen((o) => !o)} className="relative rounded-lg border border-transparent p-2 text-navy-600 hover:bg-surface-muted">
                <Bell size={19} />{unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-80 rounded-xl border border-[#efe7dd] bg-white shadow-pop">
                    <div className="flex items-center justify-between border-b border-[#efe7dd] px-4 py-2.5">
                      <p className="text-sm font-semibold text-navy-900">Notifications</p>
                      <button onClick={() => setUnread(false)} className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"><CheckCheck size={13} /> Mark all read</button>
                    </div>
                    <div className="nb-scroll max-h-80 divide-y divide-[#f3ece3] overflow-y-auto">
                      {ACTIVITY.map((a) => (
                        <div key={a.id} className="flex gap-3 px-4 py-3">
                          <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", unread ? "bg-brand-500" : "bg-navy-200")} />
                          <div className="min-w-0"><p className="text-[13px] leading-snug text-navy-700">{a.text}</p><p className="mt-0.5 font-mono text-[11px] text-navy-400">{relTime(a.time)}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} aria-label="Account menu" className="flex shrink-0 items-center gap-2 rounded-lg border border-transparent p-1 pr-2 hover:bg-surface-muted">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white font-display">{user?.initials || "KM"}</span>
                <span className="hidden whitespace-nowrap text-left sm:block">
                  <span className="block text-xs font-semibold leading-tight text-navy-900">{user?.name}</span>
                  <span className="block text-[11px] leading-tight text-navy-500">{isAdmin ? "Administrator" : ORG.user.role}</span>
                </span>
                <ChevronDown size={15} className="text-navy-400" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 z-40 mt-2 w-52 rounded-xl border border-[#efe7dd] bg-white py-1.5 shadow-pop">
                    <div className="border-b border-[#efe7dd] px-3 py-2">
                      <p className="truncate text-sm font-semibold text-navy-900">{user?.name}</p>
                      <p className="truncate text-xs text-navy-400">{user?.email}</p>
                    </div>
                    {!isAdmin && <button onClick={() => { navigate("/app/profile"); setMenuOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-surface-muted"><User size={15} /> Profile</button>}
                    <a href="mailto:support@nexbridge.tech" className="flex w-full items-center gap-2 px-3 py-2 text-sm text-navy-700 hover:bg-surface-muted"><LifeBuoy size={15} /> Help &amp; support</a>
                    <button onClick={() => { logout(); navigate("/login"); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-brand-700 hover:bg-brand-50"><LogOut size={15} /> Sign out</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="nb-scroll flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
