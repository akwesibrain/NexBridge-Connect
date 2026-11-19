import { Link } from "react-router-dom";
import {
  Send, Layers, Upload, CreditCard, ArrowRight, ArrowUpRight, Megaphone, IdCard, Users2,
  Wallet, Gauge, FileText, Plus,
} from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Progress from "../../components/ui/Progress";
import Skeleton, { SkeletonCircle } from "../../components/ui/Skeleton";
import { useMockLoad } from "../../lib/useMockLoad";
import DeltaFlow from "../../components/DeltaFlow";
import { AreaTrend, Donut } from "../../components/charts/Charts";
import { fmtInt, fmtPct, fmtGhs, relTime } from "../../lib/format";
import {
  ORG, VOLUME_MONTHLY, DELIVERY_SPLIT, MESSAGES, CAMPAIGNS, TRANSACTIONS, ACTIVITY, COLORS,
} from "../../data/mock";

const RESUME = [
  { to: "/app/bulk-sms", icon: FileText, t: "Finish 'November Promo'", d: "Draft · 18,420 recipients" },
  { to: "/app/import", icon: Upload, t: "Import contacts", d: "CSV or Excel" },
  { to: "/app/buy-credits", icon: CreditCard, t: "Top up credits", d: "48,250 remaining" },
];
const ActIcon = { campaign: Megaphone, sender: IdCard, wallet: Wallet, contacts: Users2, api: Gauge };

export default function Dashboard() {
  const loading = useMockLoad(850);
  const recentMsgs = MESSAGES.slice(0, 5);
  const recentCampaigns = CAMPAIGNS.filter((c) => c.status !== "draft").slice(0, 4);
  const recentTxns = TRANSACTIONS.slice(0, 3);

  return (
    <>
      {/* Hero — dawn field + delta signature */}
      <section className="relative mb-6 overflow-hidden rounded-[22px] border border-[#f1dfd0]"
        style={{ background: "linear-gradient(104deg, #ffe4d0 0%, #ffd8c4 52%, #ffe0e6 100%)" }}>
        {/* labelled delta on larger screens; a clean label-free animated flow on phones */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[52%] sm:w-[62%]">
          <DeltaFlow className="hidden h-full w-full sm:block" />
          <DeltaFlow className="h-full w-full sm:hidden" labels={false} />
        </div>
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(100deg, rgba(255,250,245,.88) 0%, rgba(255,250,245,.5) 38%, rgba(255,250,245,0) 60%)" }} />
        <div className="relative z-10 max-w-[560px] p-6 sm:p-8">
          <h1 className="font-display text-[26px] font-bold leading-[1.12] tracking-tight text-[#3a2318] sm:text-[32px]">
            Good things are on their way to 1.28M people.
          </h1>
          <p className="mt-3 max-w-[40ch] text-[15px] leading-relaxed text-[#6b4a37]">
            One message leaves you and fans out across every network. {fmtPct(94.2)} have already arrived; 40,000 are still flowing.
          </p>
          <div className="mt-10 flex flex-wrap gap-2.5 sm:mt-6">
            <Button as={Link} to="/app/quick-sms" icon={Send}>Compose message</Button>
            <Button as={Link} to="/app/reports" variant="outline" className="border-[#e4b79e] bg-white/70 text-[#8a4228] hover:bg-white">View delivery report</Button>
          </div>
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {[["Delivered today", "1.21M"], ["In transit", "40,000"], ["Credits left", fmtInt(ORG.credits)]].map(([k, v]) => (
              <div key={k}>
                {loading
                  ? <Skeleton className="h-6 w-20 bg-[#f0cbb4]" />
                  : <dd className="font-mono text-xl font-semibold tracking-tight text-[#3a2318]">{v}</dd>}
                <dt className="mt-1 text-xs font-medium text-[#7a4726]">{k}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Resume work */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {RESUME.map((q) => (
          <Link key={q.to} to={q.to} className="group flex items-center gap-3 rounded-2xl border border-[#efe7dd] bg-white p-3.5 shadow-card transition hover:border-brand-300 hover:shadow-pop">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-brand-50 text-brand-700"><q.icon size={18} strokeWidth={1.8} /></span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-navy-900">{q.t}</span>
              <span className="block truncate text-xs text-navy-500">{q.d}</span>
            </span>
            <ArrowUpRight size={16} className="ml-auto shrink-0 text-navy-300 transition group-hover:text-brand-600" />
          </Link>
        ))}
      </div>

      {/* Recent messages + delivery performance */}
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent messages" action={<Button as={Link} to="/app/history" size="sm" variant="ghost">View all</Button>} />
          <div className="divide-y divide-[#f3ece3]">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <SkeletonCircle size={36} />
                <div className="min-w-0 flex-1 space-y-2"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-3 w-3/4" /></div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            )) : recentMsgs.map((m) => (
              <div key={m.id} className="flex items-center gap-3 px-5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface-muted text-[11px] font-semibold text-navy-700">{m.sender.slice(0, 2)}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900">{m.recipient} <span className="text-navy-500">· {m.sender}</span></p>
                  <p className="truncate text-[13px] text-navy-500">{m.content}</p>
                </div>
                <div className="text-right">
                  <Badge status={m.status} />
                  <p className="mt-1 font-mono text-[11px] text-navy-500">{relTime(m.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Delivery performance" subtitle="Last 30 days" />
          <CardBody>
            {loading ? (
              <div className="flex flex-col items-center gap-4 py-4">
                <SkeletonCircle size={150} className="!rounded-full" />
                <div className="w-full space-y-2"><Skeleton className="h-3" /><Skeleton className="h-3" /><Skeleton className="h-3 w-2/3" /></div>
              </div>
            ) : (<>
            <Donut data={DELIVERY_SPLIT} />
            <div className="mt-2 space-y-2">
              {DELIVERY_SPLIT.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-navy-600"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                  <span className="font-mono font-semibold text-navy-900">{fmtPct(d.value)}</span>
                </div>
              ))}
            </div>
            </>)}
          </CardBody>
        </Card>
      </div>

      {/* Volume + credit + activity */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="SMS volume" subtitle="Sent vs delivered, last 6 months"
            action={<Button as={Link} to="/app/reports" size="sm" variant="ghost">Details <ArrowRight size={14} /></Button>} />
          <CardBody>
            {loading ? <Skeleton className="h-[260px] w-full rounded-xl" /> : (
            <AreaTrend data={VOLUME_MONTHLY} series={[
              { key: "sent", name: "Sent", color: COLORS.brand },
              { key: "delivered", name: "Delivered", color: COLORS.green },
            ]} />)}
          </CardBody>
        </Card>
        <div className="space-y-5">
          <Card>
            <CardHeader title="SMS wallet" action={<Button as={Link} to="/app/buy-credits" size="sm" variant="subtle" icon={Plus}>Top up</Button>} />
            <CardBody>
              <p className="font-mono text-2xl font-semibold text-navy-900">{fmtInt(ORG.credits)}</p>
              <p className="text-xs text-navy-500">credits available</p>
              <div className="mt-4 mb-1 flex justify-between text-xs"><span className="text-navy-500">Monthly usage</span><span className="font-mono font-semibold text-navy-800">73%</span></div>
              <Progress value={73} tone="brand" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Recent activity" />
            <div className="space-y-3.5 p-5">
              {ACTIVITY.slice(0, 3).map((a) => {
                const Icon = ActIcon[a.type] || Gauge;
                return (
                  <div key={a.id} className="flex gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700"><Icon size={13} /></span>
                    <div><p className="text-[13px] leading-snug text-navy-700">{a.text}</p><p className="font-mono text-[11px] text-navy-500">{relTime(a.time)}</p></div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Campaigns + transactions */}
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recent campaigns" action={<Button as={Link} to="/app/campaigns" size="sm" variant="ghost">All campaigns</Button>} />
          <div className="divide-y divide-[#f3ece3]">
            {recentCampaigns.map((c) => (
              <div key={c.id} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-navy-900">{c.name}</p>
                  <Badge status={c.status} />
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress value={c.deliveredPct} tone="green" className="flex-1" />
                  <span className="w-28 text-right font-mono text-xs text-navy-500">{fmtInt(c.delivered)} / {fmtInt(c.recipients)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHeader title="Recent transactions" action={<Button as={Link} to="/app/transactions" size="sm" variant="ghost">All transactions</Button>} />
          <div className="divide-y divide-[#f3ece3]">
            {recentTxns.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-navy-900">{t.package} package <span className="text-navy-500">· {t.id}</span></p>
                  <p className="text-xs text-navy-500">{t.method} · {fmtInt(t.units)} credits</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-navy-900">{fmtGhs(t.amount)}</p>
                  <Badge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
