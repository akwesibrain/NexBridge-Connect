import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Users2, DollarSign, Wallet, BadgeCheck, Megaphone, Receipt, Activity, SlidersHorizontal,
  UserCog, ShieldAlert, Building2, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, XCircle, Clock,
  ArrowLeft, Plus, Save, Ban, Check, Server, Mail, Globe2, Zap, ChevronRight, LifeBuoy, Gauge,
} from "lucide-react";
import { cn } from "../../lib/cn";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Progress from "../../components/ui/Progress";
import Tabs from "../../components/ui/Tabs";
import Modal from "../../components/ui/Modal";
import Confirm from "../../components/ui/Confirm";
import DataTable from "../../components/ui/DataTable";
import { Field, Input, Select, Toggle } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { Bars, AreaTrend } from "../../components/charts/Charts";
import { fmtInt, fmtGhs, fmtDate, fmtDateTime, relTime, fmtPct } from "../../lib/format";
import {
  ADMIN_STATS, ADMIN_CUSTOMERS, ADMIN_REVENUE, AUDIT_LOGS, ADMIN_USERS, SENDER_IDS,
  CAMPAIGNS, TRANSACTIONS, PACKAGES, API_LOGS, COLORS,
} from "../../data/mock";

const DEMO = (
  <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
    <AlertTriangle size={16} className="mt-0.5 shrink-0" />
    <span>Administrative console with illustrative data. Actions here are simulated and are not connected to any backend service.</span>
  </div>
);

const ATTENTION = [
  { icon: BadgeCheck, title: "Sender ID approvals", desc: "Awaiting review · oldest 4 days", count: 23, tone: "amber", to: "/admin/senders" },
  { icon: AlertTriangle, title: "Flagged transactions", desc: "Possible fraud or chargebacks", count: 7, tone: "red", to: "/admin/transactions" },
  { icon: LifeBuoy, title: "Support escalations", desc: "Open tickets past SLA", count: 4, tone: "navy", to: "/admin/customers" },
  { icon: SlidersHorizontal, title: "Config change reviews", desc: "Pending approval", count: 2, tone: "navy", to: "/admin/config" },
];
const ATT_TONE = {
  amber: "bg-amber-50 text-amber-700", red: "bg-red-50 text-red-700", navy: "bg-navy-50 text-navy-700",
};
const SYSTEMS = [
  ["SMS gateway", "ok"], ["Delivery webhooks", "ok"], ["Dashboard API", "ok"], ["Reporting", "degraded"],
];
const KPIS = [
  { label: "Customers", value: fmtInt(ADMIN_STATS.customers), trend: 4.2 },
  { label: "Active", value: fmtInt(ADMIN_STATS.active), trend: 2.8 },
  { label: "Messages (30d)", value: "18.4M", trend: 11 },
  { label: "Revenue (30d)", value: `GH₵${(ADMIN_STATS.revenue30 / 1000).toFixed(0)}k`, trend: 6.5 },
  { label: "Avg delivery", value: "97.6%", trend: 0.4 },
  { label: "Fail rate", value: fmtPct(ADMIN_STATS.failRate), trend: -0.6 },
];

export function AdminOverview() {
  const topCustomers = [...ADMIN_CUSTOMERS].sort((a, b) => b.sent30 - a.sent30).slice(0, 5);
  return (
    <>
      {/* Header with live status */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-navy-900 sm:text-2xl">Operations overview</h1>
          <p className="mt-1 text-sm text-navy-600">Platform-wide health and activity for Nexbridge Connect.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
            <span className="relative flex h-2 w-2"><span className="nb-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>
            All systems operational
          </span>
          <span className="font-mono text-xs text-navy-600">Updated just now</span>
        </div>
      </div>
      {DEMO}

      {/* Lead: what needs action + system status */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Needs attention" subtitle="Items waiting on an administrator"
            action={<Button as={Link} to="/admin/senders" size="sm" variant="ghost">Review all</Button>} />
          <div className="divide-y divide-[#f6f1ea]">
            {ATTENTION.map((a) => (
              <Link key={a.title} to={a.to} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-muted">
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", ATT_TONE[a.tone])}><a.icon size={18} strokeWidth={1.8} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-navy-900">{a.title}</p>
                  <p className="text-xs text-navy-600">{a.desc}</p>
                </div>
                <span className={cn("font-mono text-lg font-semibold", a.tone === "red" ? "text-red-700" : a.tone === "amber" ? "text-amber-700" : "text-navy-800")}>{a.count}</span>
                <ChevronRight size={16} className="shrink-0 text-navy-300" />
              </Link>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="System status" action={<Badge tone="green">Operational</Badge>} />
          <div className="divide-y divide-[#f6f1ea]">
            {SYSTEMS.map(([name, st]) => (
              <div key={name} className="flex items-center justify-between px-5 py-[13px]">
                <span className="text-sm text-navy-800">{name}</span>
                <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", st === "ok" ? "text-emerald-700" : "text-amber-700")}>
                  <span className={cn("h-2 w-2 rounded-full", st === "ok" ? "bg-emerald-500" : "bg-amber-500")} />
                  {st === "ok" ? "Operational" : "Degraded"}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#f3ece3] px-5 py-3 text-xs text-navy-500">99.98% uptime over the last 30 days</div>
        </Card>
      </div>

      {/* Dense KPI strip */}
      <Card className="mt-5 overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-y divide-[#f3ece3] sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {KPIS.map((k) => {
            const up = k.trend >= 0;
            return (
              <div key={k.label} className="px-5 py-4">
                <p className="font-mono text-xl font-semibold tracking-tight text-navy-900">{k.value}</p>
                <p className="mt-0.5 text-xs text-navy-600">{k.label}</p>
                <p className={cn("mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold", up ? "text-emerald-700" : "text-red-700")}>
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(k.trend)}%
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Revenue + top customers */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue" subtitle="Monthly, last 6 months (GHS)"
            action={<Button as={Link} to="/admin/transactions" size="sm" variant="ghost">Transactions</Button>} />
          <CardBody><AreaTrend data={ADMIN_REVENUE} series={[{ key: "revenue", name: "Revenue (GHS)", color: COLORS.brand }]} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Top customers" subtitle="By volume, last 30 days"
            action={<Button as={Link} to="/admin/customers" size="sm" variant="ghost">All</Button>} />
          <div className="divide-y divide-[#f6f1ea]">
            {topCustomers.map((c, i) => (
              <Link key={c.id} to={`/admin/customers/${c.id}`} className="flex items-center gap-3 px-5 py-[11px] hover:bg-surface-muted">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-sunken font-mono text-[11px] font-bold text-navy-700">{i + 1}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-navy-900">{c.org}</p><p className="text-xs text-navy-600">{c.plan} plan</p></div>
                <span className="font-mono text-sm font-semibold text-navy-900">{fmtInt(c.sent30)}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent admin activity */}
      <Card className="mt-5">
        <CardHeader title="Recent admin activity" action={<Button as={Link} to="/admin/audit" size="sm" variant="ghost">Audit log</Button>} />
        <div className="divide-y divide-[#f6f1ea]">
          {AUDIT_LOGS.slice(0, 5).map((a) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><Gauge size={14} /></span>
              <div className="min-w-0 flex-1"><p className="truncate font-medium text-navy-900">{a.action}</p><p className="truncate font-mono text-[11px] text-navy-500">{a.actor} · {a.target}</p></div>
              <span className="shrink-0 font-mono text-xs text-navy-500">{relTime(a.time)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function AdminCustomers() {
  const navigate = useNavigate();
  const columns = [
    { key: "org", header: "Organization", render: (r) => <div><p className="font-medium text-navy-900">{r.org}</p><p className="text-xs text-navy-600">{r.email}</p></div> },
    { key: "plan", header: "Plan", render: (r) => <Badge tone="navy">{r.plan}</Badge> },
    { key: "credits", header: "Credits", align: "right", render: (r) => fmtInt(r.credits) },
    { key: "sent30", header: "Sent (30d)", align: "right", render: (r) => fmtInt(r.sent30) },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "joined", header: "Joined", render: (r) => fmtDate(r.joined) },
  ];
  return (
    <>
      <PageHeader title="Customer Management" subtitle="All organizations using the platform." />
      {DEMO}
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={fmtInt(ADMIN_STATS.customers)} icon={Building2} tone="brand" />
        <StatCard label="Active" value={fmtInt(ADMIN_STATS.active)} icon={CheckCircle2} tone="green" />
        <StatCard label="Suspended" value={fmtInt(ADMIN_CUSTOMERS.filter((c) => c.status === "suspended").length)} icon={Ban} tone="red" />
        <StatCard label="Pending" value={fmtInt(ADMIN_CUSTOMERS.filter((c) => c.status === "pending").length)} icon={Clock} tone="amber" />
      </div>
      <DataTable columns={columns} rows={ADMIN_CUSTOMERS} pageSize={10} searchKeys={["org", "email", "plan", "status"]} onRowClick={(r) => navigate(`/admin/customers/${r.id}`)} emptyIcon={Users2} />
    </>
  );
}

export function AdminCustomerDetails() {
  const { id } = useParams();
  const toast = useToast();
  const c = ADMIN_CUSTOMERS.find((x) => x.id === id) || ADMIN_CUSTOMERS[0];
  const [credit, setCredit] = useState(false);
  const [amount, setAmount] = useState("");
  return (
    <>
      <PageHeader title={c.org} subtitle={`Customer ${c.id} · ${c.email}`}
        actions={<><Button as={Link} to="/admin/customers" variant="outline" icon={ArrowLeft}>Back</Button>
          <Button variant="outline" icon={Wallet} onClick={() => setCredit(true)}>Adjust credits</Button>
          <Button variant="danger" icon={Ban} onClick={() => toast.success("Customer suspended (demo)")}>Suspend</Button></>} />
      {DEMO}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Plan" value={c.plan} icon={BadgeCheck} tone="brand" />
        <StatCard label="Credits" value={fmtInt(c.credits)} icon={Wallet} tone="navy" />
        <StatCard label="Sent (30d)" value={fmtInt(c.sent30)} icon={Activity} tone="green" />
        <StatCard label="Status" value={c.status} icon={CheckCircle2} tone={c.status === "active" ? "green" : "amber"} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Usage" subtitle="Messages over the last 6 months" />
          <CardBody><Bars data={ADMIN_REVENUE.map((m) => ({ label: m.label, sent: Math.round(m.revenue / 8) }))} series={[{ key: "sent", name: "Messages", color: COLORS.brand }]} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Account details" />
          <CardBody className="space-y-3 text-sm">
            {[["Contact", c.contact], ["Email", c.email], ["Joined", fmtDate(c.joined)], ["Plan", c.plan]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-navy-600">{k}</span><span className="font-medium text-navy-900">{v}</span></div>
            ))}
          </CardBody>
        </Card>
      </div>
      <Modal open={credit} onClose={() => setCredit(false)} title="Adjust credits" subtitle={c.org}
        footer={<><Button variant="outline" onClick={() => setCredit(false)}>Cancel</Button><Button icon={Save} onClick={() => { setCredit(false); toast.success("Credits adjusted (demo)"); }}>Apply</Button></>}>
        <div className="space-y-4">
          <Field label="Adjustment type"><Select><option>Add credits</option><option>Deduct credits</option></Select></Field>
          <Field label="Amount"><Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" /></Field>
          <Field label="Reason"><Input placeholder="Goodwill / correction" /></Field>
        </div>
      </Modal>
    </>
  );
}

export function AdminPricing() {
  const toast = useToast();
  const [pkgs, setPkgs] = useState(PACKAGES);
  const update = (i, field, v) => setPkgs((p) => p.map((x, idx) => idx === i ? { ...x, [field]: Number(v) } : x));
  return (
    <>
      <PageHeader title="SMS Pricing" subtitle="Manage credit packages and per-SMS rates."
        actions={<Button icon={Save} onClick={() => toast.success("Pricing saved (demo)")}>Save pricing</Button>} />
      {DEMO}
      <Card className="overflow-hidden">
        <div className="nb-scroll overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-[#f3ece3] bg-surface-muted/60 text-xs uppercase text-navy-600">
              <th className="px-4 py-3">Package</th><th className="px-4 py-3">Credits</th><th className="px-4 py-3">Price (GHS)</th><th className="px-4 py-3">Per SMS</th><th className="px-4 py-3">Status</th>
            </tr></thead>
            <tbody>
              {pkgs.map((p, i) => (
                <tr key={p.name} className="border-b border-[#f6f1ea]">
                  <td className="px-4 py-3 font-semibold text-navy-900">{p.name}</td>
                  <td className="px-4 py-3"><Input className="w-28" type="number" value={p.units} onChange={(e) => update(i, "units", e.target.value)} /></td>
                  <td className="px-4 py-3"><Input className="w-28" type="number" value={p.price} onChange={(e) => update(i, "price", e.target.value)} /></td>
                  <td className="px-4 py-3 text-navy-700">{fmtGhs(p.price / p.units)}</td>
                  <td className="px-4 py-3"><Badge tone="green">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

export function AdminCredits() {
  const toast = useToast();
  const rows = ADMIN_CUSTOMERS.slice(0, 12);
  const columns = [
    { key: "org", header: "Customer", render: (r) => <span className="font-medium text-navy-900">{r.org}</span> },
    { key: "credits", header: "Balance", align: "right", render: (r) => fmtInt(r.credits) },
    { key: "plan", header: "Plan", render: (r) => <Badge tone="navy">{r.plan}</Badge> },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" icon={Plus} onClick={() => toast.success(`Credited ${r.org} (demo)`)}>Credit</Button>
        <Button size="sm" variant="ghost" onClick={() => toast.info("Deducted (demo)")}>Deduct</Button>
      </div>
    )},
  ];
  return (
    <>
      <PageHeader title="Credit Management" subtitle="Adjust customer credit balances." />
      {DEMO}
      <DataTable columns={columns} rows={rows} searchKeys={["org", "plan"]} emptyIcon={Wallet} />
    </>
  );
}

export function AdminSenders() {
  const toast = useToast();
  const [items, setItems] = useState(SENDER_IDS.map((s) => ({ ...s, org: "Horizon Retail Group" })));
  const act = (id, status) => { setItems((x) => x.map((s) => s.id === id ? { ...s, status } : s)); toast.success(`Sender ID ${status} (demo)`); };
  const pending = items.filter((s) => s.status === "pending");
  const columns = [
    { key: "name", header: "Sender ID", render: (r) => <span className="font-mono font-semibold text-navy-900">{r.name}</span> },
    { key: "org", header: "Organization" },
    { key: "purpose", header: "Purpose", render: (r) => <span className="text-navy-700">{r.purpose}</span> },
    { key: "created", header: "Requested", render: (r) => fmtDate(r.created) },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => r.status === "pending" ? (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="subtle" icon={Check} onClick={() => act(r.id, "approved")}>Approve</Button>
        <Button size="sm" variant="ghost" icon={XCircle} onClick={() => act(r.id, "rejected")}>Reject</Button>
      </div>
    ) : null },
  ];
  return (
    <>
      <PageHeader title="Sender ID Management" subtitle="Review and approve sender ID requests." />
      {DEMO}
      {pending.length > 0 && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Clock size={16} /> {pending.length} sender ID{pending.length === 1 ? "" : "s"} awaiting review.
        </div>
      )}
      <DataTable columns={columns} rows={items} searchKeys={["name", "org", "status"]} emptyIcon={BadgeCheck} />
    </>
  );
}

export function AdminCampaigns() {
  const columns = [
    { key: "name", header: "Campaign", render: (r) => <span className="font-medium text-navy-900">{r.name}</span> },
    { key: "sender", header: "Sender", render: (r) => <Badge tone="navy">{r.sender}</Badge> },
    { key: "recipients", header: "Recipients", align: "right", render: (r) => fmtInt(r.recipients) },
    { key: "deliveredPct", header: "Delivery", render: (r) => <div className="flex items-center gap-2"><Progress value={r.deliveredPct} tone="green" className="w-16" /><span className="text-xs">{r.deliveredPct}%</span></div> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "created", header: "Created", render: (r) => fmtDate(r.created) },
  ];
  return (
    <>
      <PageHeader title="Campaign Monitoring" subtitle="Platform-wide campaign activity." />
      {DEMO}
      <DataTable columns={columns} rows={CAMPAIGNS} pageSize={10} searchKeys={["name", "sender", "status"]} emptyIcon={Megaphone} />
    </>
  );
}

export function AdminTransactions() {
  const paid = TRANSACTIONS.filter((t) => t.status === "paid");
  const columns = [
    { key: "id", header: "Reference", render: (r) => <span className="font-mono text-xs font-medium text-navy-900">{r.id}</span> },
    { key: "package", header: "Package", render: (r) => <Badge tone="navy">{r.package}</Badge> },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-semibold">{fmtGhs(r.amount)}</span> },
    { key: "method", header: "Method" },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
  ];
  return (
    <>
      <PageHeader title="Transaction Monitoring" subtitle="Payments and credit purchases across the platform." />
      {DEMO}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Revenue (shown)" value={fmtGhs(paid.reduce((a, t) => a + t.amount, 0))} icon={DollarSign} tone="brand" />
        <StatCard label="Transactions" value={TRANSACTIONS.length} icon={Receipt} tone="navy" />
        <StatCard label="Failed" value={TRANSACTIONS.filter((t) => t.status === "failed").length} icon={XCircle} tone="red" />
      </div>
      <DataTable columns={columns} rows={TRANSACTIONS} pageSize={10} searchKeys={["id", "package", "method", "status"]} emptyIcon={Receipt} />
    </>
  );
}

export function AdminApi() {
  return (
    <>
      <PageHeader title="API Monitoring" subtitle="Platform API traffic and health." />
      {DEMO}
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Requests (24h)" value="1.9M" icon={Activity} tone="brand" trend={7} />
        <StatCard label="Success rate" value="98.1%" icon={CheckCircle2} tone="green" />
        <StatCard label="Avg latency" value="176 ms" icon={Zap} tone="amber" />
        <StatCard label="5xx errors" value="482" icon={XCircle} tone="red" trend={-3} />
      </div>
      <Card>
        <CardHeader title="Recent requests" subtitle="Across all customers" />
        <div className="divide-y divide-[#f6f1ea]">
          {API_LOGS.slice(0, 10).map((l) => (
            <div key={l.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
              <Badge tone={l.method === "GET" ? "navy" : "blue"}>{l.method}</Badge>
              <span className="flex-1 font-mono text-xs text-navy-800">{l.endpoint}</span>
              <Badge tone={l.status < 300 ? "green" : "red"}>{l.status}</Badge>
              <span className="w-14 text-right text-xs text-navy-500">{l.ms}ms</span>
              <span className="hidden w-20 text-right text-xs text-navy-500 sm:block">{relTime(l.time)}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function AdminConfig() {
  const toast = useToast();
  const [cfg, setCfg] = useState({ maintenance: false, newSignups: true, apiEnabled: true, defaultRoute: "GH-Primary", rateLimit: 60, senderAutoApprove: false });
  return (
    <>
      <PageHeader title="System Configuration" subtitle="Platform-wide operational settings."
        actions={<Button icon={Save} onClick={() => toast.success("Configuration saved (demo)")}>Save</Button>} />
      {DEMO}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Platform toggles" />
          <div className="divide-y divide-[#f6f1ea]">
            {[["maintenance", "Maintenance mode", "Temporarily disable customer access"], ["newSignups", "Allow new sign-ups", "Enable account registration"], ["apiEnabled", "API access", "Platform-wide API availability"], ["senderAutoApprove", "Auto-approve sender IDs", "Skip manual review (not recommended)"]].map(([k, t, d]) => (
              <div key={k} className="flex items-center justify-between px-5 py-4">
                <div><p className="text-sm font-medium text-navy-900">{t}</p><p className="text-xs text-navy-600">{d}</p></div>
                <Toggle checked={cfg[k]} onChange={(v) => setCfg((c) => ({ ...c, [k]: v }))} label={t} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="h-fit">
          <CardHeader title="Routing & limits" />
          <CardBody className="space-y-4">
            <Field label="Default SMS route"><Select value={cfg.defaultRoute} onChange={(e) => setCfg((c) => ({ ...c, defaultRoute: e.target.value }))}>{["GH-Primary", "GH-Failover", "International"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
            <Field label="API rate limit (req/min)"><Input type="number" value={cfg.rateLimit} onChange={(e) => setCfg((c) => ({ ...c, rateLimit: e.target.value }))} /></Field>
            <div className="rounded-lg bg-surface-muted p-3 text-xs text-navy-600"><Server size={14} className="mr-1 inline" /> Changes apply to all customers on the next request cycle.</div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState(ADMIN_USERS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Support Lead" });
  const add = () => {
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Enter a name and valid email");
    setUsers((u) => [...u, { id: `u${Date.now()}`, status: "active", lastActive: new Date().toISOString(), ...form }]);
    toast.success("Admin user added (demo)"); setOpen(false); setForm({ name: "", email: "", role: "Support Lead" });
  };
  const columns = [
    { key: "name", header: "Name", render: (r) => <div><p className="font-medium text-navy-900">{r.name}</p><p className="text-xs text-navy-600">{r.email}</p></div> },
    { key: "role", header: "Role", render: (r) => <Badge tone="navy">{r.role}</Badge> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "lastActive", header: "Last active", render: (r) => r.lastActive ? relTime(r.lastActive) : "Never" },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => <Button size="sm" variant="ghost" aria-label="Toggle status" icon={Ban} onClick={() => { setUsers((u) => u.map((x) => x.id === r.id ? { ...x, status: x.status === "active" ? "suspended" : "active" } : x)); toast.info("Status changed (demo)"); }} /> },
  ];
  return (
    <>
      <PageHeader title="Admin Users" subtitle="Manage administrator accounts and roles."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Add admin</Button>} />
      {DEMO}
      <DataTable columns={columns} rows={users} searchable={false} emptyIcon={UserCog} />
      <Modal open={open} onClose={() => setOpen(false)} title="Add admin user"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Plus} onClick={add}>Add user</Button></>}>
        <div className="space-y-4">
          <Field label="Full name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{["Super Admin", "Support Lead", "Billing Admin", "Compliance"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
        </div>
      </Modal>
    </>
  );
}

export function AdminAudit() {
  const columns = [
    { key: "actor", header: "Actor", render: (r) => <span className="font-mono text-xs text-navy-800">{r.actor}</span> },
    { key: "action", header: "Action", render: (r) => <span className="font-medium text-navy-900">{r.action}</span> },
    { key: "target", header: "Target", render: (r) => <span className="font-mono text-xs text-navy-700">{r.target}</span> },
    { key: "ip", header: "IP", render: (r) => <span className="font-mono text-xs text-navy-600">{r.ip}</span> },
    { key: "time", header: "Time", render: (r) => <span title={fmtDateTime(r.time)}>{relTime(r.time)}</span> },
  ];
  return (
    <>
      <PageHeader title="Audit Logs" subtitle="A record of administrative actions." />
      {DEMO}
      <DataTable columns={columns} rows={AUDIT_LOGS} pageSize={12} searchKeys={["actor", "action", "target", "ip"]} emptyIcon={ShieldAlert} />
    </>
  );
}
