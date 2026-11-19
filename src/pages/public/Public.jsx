import { Link } from "react-router-dom";
import {
  ArrowRight, Send, ShieldCheck, Code2, BarChart3, Users2, Check, Globe2,
  Building2, Hospital, GraduationCap, Landmark, ShoppingBag, CircleDollarSign,
  Layers, CalendarClock, Webhook, MessageSquare,
} from "lucide-react";
import { Logo } from "../../brand/Logo";
import BootSplash, { useEntrySplash } from "../../components/BootSplash";
import DeltaFlow from "../../components/DeltaFlow";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/cn";
import { PACKAGES } from "../../data/mock";
import { fmtGhs, fmtInt } from "../../lib/format";

function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#efe7dd] bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" aria-label="Nexbridge Connect home"><Logo /></Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-navy-700 md:flex">
          <a href="#product" className="hover:text-brand-700">Product</a>
          <a href="#developers" className="hover:text-brand-700">Developers</a>
          <Link to="/pricing" className="hover:text-brand-700">Pricing</Link>
          <a href="#industries" className="hover:text-brand-700">Industries</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">Sign in</Button>
          <Button as={Link} to="/register" size="sm" icon={ArrowRight} className="whitespace-nowrap">
            <span className="sm:hidden">Sign up</span><span className="hidden sm:inline">Get started</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function BrowserFrame({ url = "app.nexbridge.tech", className, children }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[#e7ddd1] bg-white shadow-pop", className)}>
      <div className="flex items-center gap-2 border-b border-[#f0e8dd] bg-surface-muted px-3.5 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e4b7a6]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ecd39b]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#bcd9ba]" />
        <div className="ml-2 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-navy-500 ring-1 ring-[#efe7dd]">{url}</div>
      </div>
      {children}
    </div>
  );
}

// The hero's product visual: a compact, real slice of the dashboard.
function HeroProduct() {
  return (
    <BrowserFrame className="mx-auto max-w-xl">
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(104deg,#ffe4d0,#ffd8c4 55%,#ffe0e6)" }}>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[58%]"><DeltaFlow className="h-full w-full" labels={false} /></div>
        <div className="relative z-10 p-5">
          <p className="font-display text-lg font-bold leading-tight text-[#3a2318]">1.21M delivered today</p>
          <p className="mt-0.5 text-xs text-[#7a4726]">94.2% of 1.28M, across every network</p>
          <div className="mt-4 flex gap-6">
            {[["Delivered", "1.21M"], ["In transit", "40,000"], ["Credits", "48,250"]].map(([k, v]) => (
              <div key={k}><p className="font-mono text-sm font-semibold text-[#3a2318]">{v}</p><p className="text-[11px] text-[#7a4726]">{k}</p></div>
            ))}
          </div>
        </div>
      </div>
      <div className="divide-y divide-[#f3ece3]">
        {[["+233 24 118 2204", "HRZ-OTP", "Delivered"], ["+233 20 554 9031", "HORIZON", "Delivered"], ["+233 27 740 1180", "HRZ-PROMO", "Sending"]].map(([to, from, st]) => (
          <div key={to} className="flex items-center gap-3 px-5 py-2.5">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-muted text-[11px] font-semibold text-navy-700">{from.slice(0, 2)}</span>
            <div className="min-w-0 flex-1"><p className="truncate text-[12px] font-medium text-navy-900">{to} <span className="text-navy-500">· {from}</span></p></div>
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", st === "Delivered" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700")}>{st}</span>
          </div>
        ))}
      </div>
    </BrowserFrame>
  );
}

// A small, real compose panel used in the first feature row.
function ComposePanel() {
  return (
    <BrowserFrame url="app.nexbridge.tech/quick-sms" className="max-w-md">
      <div className="space-y-3 p-5">
        <div>
          <p className="mb-1 text-[11px] font-medium text-navy-700">Sender ID</p>
          <div className="flex items-center justify-between rounded-lg border border-[#e7ddd1] px-3 py-2 text-sm text-navy-900">HORIZON <span className="text-navy-400">▾</span></div>
        </div>
        <div>
          <p className="mb-1 text-[11px] font-medium text-navy-700">Message</p>
          <div className="rounded-lg border border-[#e7ddd1] p-3 text-sm text-navy-800">Your order #HR-4471 has shipped and arrives in 2-3 days.</div>
          <p className="mt-1 text-[11px] text-navy-500">58 chars · 1 segment · GSM-7</p>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-navy-500">18,420 recipients</span>
          <span className="inline-flex items-center gap-1.5 rounded-[11px] bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white"><Send size={13} /> Send</span>
        </div>
      </div>
    </BrowserFrame>
  );
}

// A small delivery-report panel for the second feature row.
function DeliveryPanel() {
  const rows = [["HRZ-OTP", 98], ["HORIZON", 95], ["HRZ-PROMO", 88]];
  return (
    <BrowserFrame url="app.nexbridge.tech/reports" className="max-w-md">
      <div className="p-5">
        <div className="flex items-end justify-between">
          <div><p className="font-mono text-2xl font-semibold text-navy-900">94.2%</p><p className="text-[11px] text-navy-500">average delivery · last 30 days</p></div>
          <div className="text-right"><p className="font-mono text-sm font-semibold text-emerald-700">1.21M</p><p className="text-[11px] text-navy-500">delivered</p></div>
        </div>
        <div className="mt-4 space-y-2.5">
          {rows.map(([name, pct]) => (
            <div key={name} className="flex items-center gap-3">
              <span className="w-24 shrink-0 font-mono text-[11px] text-navy-700">{name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-sunken"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
              <span className="w-8 text-right font-mono text-[11px] text-navy-800">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

const SECONDARY = [
  { icon: ShieldCheck, title: "Sender ID management", text: "Register branded sender IDs with clear approval status." },
  { icon: CalendarClock, title: "Scheduled campaigns", text: "Queue sends for the right hour and let them run." },
  { icon: Users2, title: "Contacts & groups", text: "Import from CSV or Excel and target audiences." },
  { icon: Webhook, title: "Delivery webhooks", text: "Get real-time callbacks for every message event." },
];

const INDUSTRIES = [
  { icon: Building2, t: "Businesses" }, { icon: CircleDollarSign, t: "Financial institutions" },
  { icon: GraduationCap, t: "Schools & universities" }, { icon: Hospital, t: "Healthcare" },
  { icon: ShoppingBag, t: "Retail" }, { icon: Landmark, t: "Government" },
];

const METRICS = [
  ["3", "networks, one API", "MTN, Telecel and AirtelTigo"],
  ["94%+", "average delivery", "measured across all routes"],
  ["1–3 days", "sender ID approval", "with status you can track"],
  [fmtGhs(PACKAGES[0].perSms), "per SMS", "pay only for what you send"],
];

function FeatureRow({ eyebrow, title, text, points, visual, reverse }) {
  return (
    <div className={cn("grid items-center gap-10 lg:grid-cols-2", reverse && "lg:[&>*:first-child]:order-2")}>
      <div>
        <span className="text-sm font-semibold text-brand-700">{eyebrow}</span>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-[28px]">{title}</h3>
        <p className="mt-3 max-w-md text-navy-600">{text}</p>
        <ul className="mt-5 space-y-2.5">
          {points.map((p) => <li key={p} className="flex items-start gap-2 text-sm text-navy-800"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" /> {p}</li>)}
        </ul>
      </div>
      <div className="flex justify-center">{visual}</div>
    </div>
  );
}

function Footer() {
  const cols = [
    { h: "Product", l: [["Quick SMS", "/register"], ["Bulk campaigns", "/register"], ["Sender IDs", "/register"], ["Pricing", "/pricing"]] },
    { h: "Developers", l: [["API overview", "/login"], ["Documentation", "/login"], ["API keys", "/login"], ["Webhooks", "/login"]] },
    { h: "Company", l: [["Pricing", "/pricing"], ["Sign in", "/login"], ["Get started", "/register"], ["Support", "mailto:support@nexbridge.tech"]] },
  ];
  return (
    <footer className="border-t border-[#efe7dd] bg-navy-900 text-navy-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo markClass="text-brand-500" invert />
          <p className="mt-4 max-w-xs text-sm text-navy-300">Enterprise messaging that reaches customers across MTN, Telecel and AirtelTigo in Ghana.</p>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-sm font-semibold text-white">{c.h}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {c.l.map(([label, to]) => (
                <li key={label}>
                  {to.startsWith("mailto") ? <a href={to} className="text-navy-300 hover:text-white">{label}</a>
                    : <Link to={to} className="text-navy-300 hover:text-white">{label}</Link>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright &copy; 2026 Nexbridge Technology. Nexbridge Connect. All rights reserved.</p>
          <p>Connect. Communicate. Deliver.</p>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  if (useEntrySplash()) return <BootSplash />;
  return (
    <div className="min-h-screen bg-white">
      <TopBar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#efe7dd] bg-gradient-to-b from-[#fff8f1] to-white">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
              <Globe2 size={15} strokeWidth={1.8} /> Built for Ghana. Ready for the world.
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.08] tracking-tight text-navy-900 sm:text-[52px]">
              Reach every customer, on every network.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-navy-600">
              Nexbridge Connect is the SMS platform businesses, institutions and developers use to send OTPs,
              alerts and campaigns across MTN, Telecel and AirtelTigo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/register" size="lg" icon={ArrowRight}>Create free account</Button>
              <Button as={Link} to="/pricing" size="lg" variant="outline">See pricing</Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-navy-700">
              {["No setup fees", "Pay per SMS", "Live in minutes"].map((x) => (
                <span key={x} className="inline-flex items-center gap-2"><Check size={16} className="text-emerald-600" /> {x}</span>
              ))}
            </div>
          </div>
          <HeroProduct />
        </div>
      </section>

      {/* Metrics */}
      <section className="border-b border-[#efe7dd] bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden bg-[#efe7dd] lg:grid-cols-4">
          {METRICS.map(([big, label, sub]) => (
            <div key={label} className="bg-white px-5 py-7 text-center">
              <p className="font-display text-3xl font-bold text-navy-900">{big}</p>
              <p className="mt-1 text-sm font-semibold text-navy-800">{label}</p>
              <p className="mt-0.5 text-xs text-navy-500">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product feature rows */}
      <section id="product" className="mx-auto max-w-6xl space-y-24 px-5 py-24">
        <FeatureRow
          eyebrow="Messaging"
          title="Send to one person or millions"
          text="Compose a quick message or build a personalized campaign to your contact groups. See the character count, segments and credit cost before you send."
          points={["Quick SMS and bulk campaigns", "Personalization variables and templates", "Correct GSM-7 and Unicode segment counting"]}
          visual={<ComposePanel />}
        />
        <FeatureRow
          reverse
          eyebrow="Analytics"
          title="Know exactly what landed"
          text="Track delivery rates by sender ID and campaign in real time. Export reports or have them emailed to your team."
          points={["Delivery, failed and in-transit breakdowns", "Per-campaign and per-sender performance", "CSV and emailed reports"]}
          visual={<DeliveryPanel />}
        />
      </section>

      {/* Secondary features */}
      <section className="border-y border-[#efe7dd] bg-surface-muted">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold tracking-tight text-navy-900">Everything the team needs</h2>
            <p className="mt-3 text-navy-600">One workspace for sending, contacts, sender IDs and reporting.</p>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {SECONDARY.map((f) => (
              <div key={f.title} className="flex gap-3.5 border-t border-[#e7ddd1] pt-5">
                <f.icon size={20} strokeWidth={1.8} className="mt-0.5 shrink-0 text-brand-700" />
                <div>
                  <h3 className="text-sm font-semibold text-navy-900">{f.title}</h3>
                  <p className="mt-0.5 text-sm text-navy-600">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Developers */}
      <section id="developers" className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 lg:grid-cols-2">
        <div>
          <span className="text-sm font-semibold text-brand-700">Developer center</span>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-navy-900">Ship messaging in minutes</h2>
          <p className="mt-3 text-navy-600">Authenticate with an API key and send your first message in a single request. Manage keys, inspect logs and configure webhooks from the dashboard.</p>
          <ul className="mt-6 space-y-3">
            {["REST API with predictable responses", "API keys with scoped access", "Delivery webhooks and request logs", "Examples in cURL, JavaScript, PHP and Python"].map((x) => (
              <li key={x} className="flex items-center gap-2 text-sm text-navy-800"><Check size={16} className="text-emerald-600" /> {x}</li>
            ))}
          </ul>
          <Button as={Link} to="/register" className="mt-7" icon={Code2}>Explore the API</Button>
        </div>
        <div className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-950 shadow-pop">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-2 font-mono text-xs text-navy-300">send-sms.sh</span>
          </div>
          <pre className="nb-scroll overflow-x-auto whitespace-pre-wrap break-words p-5 font-mono text-[11.5px] leading-relaxed text-navy-100 sm:text-[12.5px]">
{`curl https://api.nexbridge.tech/v1/sms/send \\
  -H "Authorization: Bearer nxb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+233201234567",
    "from": "HORIZON",
    "message": "Your OTP is 48213"
  }'`}
          </pre>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="border-y border-[#efe7dd] bg-surface-muted">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="text-center font-display text-2xl font-bold text-navy-900">Built for how Ghana communicates</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-navy-600">Retail, finance, healthcare, education and government teams send with Nexbridge Connect.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {INDUSTRIES.map((i) => (
              <div key={i.t} className="flex flex-col items-center gap-3 rounded-xl border border-[#efe7dd] bg-white p-5 text-center">
                <i.icon size={24} strokeWidth={1.8} className="text-brand-700" />
                <span className="text-sm font-medium text-navy-800">{i.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy-900 px-8 py-16 text-center text-white">
          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Start sending today</h2>
            <p className="mx-auto mt-3 max-w-xl text-navy-200">Create an account and send your first message in minutes. Credits start at {fmtGhs(PACKAGES[0].price)} for {fmtInt(PACKAGES[0].units)} SMS.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button as={Link} to="/register" size="lg" variant="outline" className="border-transparent" icon={ArrowRight}>Create free account</Button>
              <Link to="/pricing" className="inline-flex h-11 items-center justify-center rounded-[11px] border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function PublicPricing() {
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">Simple, transparent pricing</h1>
          <p className="mt-3 text-navy-600">Buy SMS credits that match your volume. No monthly lock-in, no hidden fees.</p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-4">
          {PACKAGES.map((p) => (
            <div key={p.name} className={`relative rounded-2xl border bg-white p-6 shadow-card ${p.popular ? "border-brand-500 ring-1 ring-brand-500" : "border-[#efe7dd]"}`}>
              {p.popular && <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Most popular</span>}
              <h3 className="text-lg font-bold text-navy-900">{p.name}</h3>
              <p className="mt-2 font-display text-3xl font-extrabold text-navy-900">{fmtGhs(p.price)}</p>
              <p className="mt-1 text-sm text-navy-600">{fmtInt(p.units)} SMS &middot; {fmtGhs(p.perSms)}/SMS</p>
              <ul className="mt-5 space-y-2.5">
                {p.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-navy-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-600" /> {f}</li>)}
              </ul>
              <Button as={Link} to="/register" className="mt-6 w-full" variant={p.popular ? "primary" : "outline"}>Choose {p.name}</Button>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-navy-600">Prices are illustrative for this demo environment.</p>
      </section>
      <Footer />
    </div>
  );
}

export function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface-muted px-5 text-center">
      <div>
        <Logo className="mx-auto" />
        <p className="mt-8 font-display text-6xl font-extrabold text-navy-900">404</p>
        <p className="mt-2 text-navy-600">We couldn&apos;t find that page.</p>
        <Button as={Link} to="/" className="mt-6" icon={ArrowRight}>Back to home</Button>
      </div>
    </div>
  );
}
