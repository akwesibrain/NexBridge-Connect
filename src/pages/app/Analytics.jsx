import { useState } from "react";
import { BarChart3, Download, Mail, History, LineChart, CheckCircle2, Send, XCircle, Gauge } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Progress from "../../components/ui/Progress";
import DataTable from "../../components/ui/DataTable";
import { Select } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import { Field, Input } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { Bars, AreaTrend, LineTrend, Donut } from "../../components/charts/Charts";
import { fmtInt, fmtPct, fmtDateTime, relTime } from "../../lib/format";
import { VOLUME_DAILY, VOLUME_MONTHLY, DELIVERY_SPLIT, MESSAGES, CAMPAIGNS, COLORS } from "../../data/mock";

export function Reports() {
  const toast = useToast();
  const [range, setRange] = useState("30");
  const [emailOpen, setEmailOpen] = useState(false);
  return (
    <>
      <PageHeader title="Delivery Reports" subtitle="Track delivery performance across your messaging."
        actions={<>
          <Select value={range} onChange={(e) => setRange(e.target.value)} className="w-36">
            <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="90">Last 90 days</option>
          </Select>
          <Button variant="outline" icon={Mail} onClick={() => setEmailOpen(true)}>Email report</Button>
          <Button icon={Download} onClick={() => toast.success("Report exported (demo)")}>Export</Button>
        </>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total sent" value="1.28M" icon={Send} tone="brand" trend={8.4} />
        <StatCard label="Delivered" value="1.21M" icon={CheckCircle2} tone="green" trend={6.1} />
        <StatCard label="Failed" value="34,180" icon={XCircle} tone="red" trend={-2.3} />
        <StatCard label="Delivery rate" value={fmtPct(94.2)} icon={Gauge} tone="amber" trend={1.2} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Daily volume" subtitle="Sent, delivered and failed per day" />
          <CardBody>
            <Bars data={VOLUME_DAILY} series={[
              { key: "delivered", name: "Delivered", color: COLORS.green },
              { key: "failed", name: "Failed", color: COLORS.red },
            ]} stacked />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Delivery split" />
          <CardBody>
            <Donut data={DELIVERY_SPLIT} />
            <div className="mt-2 space-y-2">
              {DELIVERY_SPLIT.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-navy-700"><span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name}</span>
                  <span className="font-semibold text-navy-900">{fmtPct(d.value)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
      <Card className="mt-5">
        <CardHeader title="Monthly trend" subtitle="Sent vs delivered" />
        <CardBody><AreaTrend data={VOLUME_MONTHLY} series={[{ key: "sent", name: "Sent", color: COLORS.brand }, { key: "delivered", name: "Delivered", color: COLORS.green }]} /></CardBody>
      </Card>

      <Modal open={emailOpen} onClose={() => setEmailOpen(false)} title="Email this report"
        footer={<><Button variant="outline" onClick={() => setEmailOpen(false)}>Cancel</Button><Button icon={Mail} onClick={() => { setEmailOpen(false); toast.success("Report emailed (demo)"); }}>Send report</Button></>}>
        <div className="space-y-4">
          <Field label="Recipient email" required><Input type="email" placeholder="ops@horizonretail.gh" /></Field>
          <Field label="Format"><Select><option>PDF</option><option>CSV</option><option>Excel</option></Select></Field>
        </div>
      </Modal>
    </>
  );
}

export function MessageHistory() {
  const columns = [
    { key: "recipient", header: "Recipient" },
    { key: "sender", header: "Sender", render: (r) => <Badge tone="navy">{r.sender}</Badge> },
    { key: "content", header: "Message", sortable: false, render: (r) => <span className="line-clamp-1 max-w-xs text-navy-700">{r.content}</span> },
    { key: "segments", header: "Seg.", align: "right" },
    { key: "cost", header: "Credits", align: "right" },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "date", header: "Date", render: (r) => <span title={fmtDateTime(r.date)}>{relTime(r.date)}</span> },
  ];
  return (
    <>
      <PageHeader title="Message History" subtitle="A searchable log of every message you've sent." />
      <DataTable columns={columns} rows={MESSAGES} pageSize={12} searchKeys={["recipient", "sender", "content", "status"]} emptyIcon={History} />
    </>
  );
}

export function CampaignAnalytics() {
  const completed = CAMPAIGNS.filter((c) => c.status === "completed");
  const best = [...completed].sort((a, b) => b.deliveredPct - a.deliveredPct).slice(0, 6);
  const chartData = best.map((c) => ({ label: c.name.split(" ")[0], delivered: c.delivered, failed: c.failed }));
  return (
    <>
      <PageHeader title="Campaign Analytics" subtitle="Compare performance across your campaigns." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Campaigns run" value={completed.length} icon={LineChart} tone="brand" />
        <StatCard label="Avg. delivery" value={fmtPct(completed.reduce((a, c) => a + c.deliveredPct, 0) / (completed.length || 1))} icon={Gauge} tone="green" />
        <StatCard label="Total reach" value={fmtInt(completed.reduce((a, c) => a + c.recipients, 0))} icon={Send} tone="navy" />
        <StatCard label="Total delivered" value={fmtInt(completed.reduce((a, c) => a + c.delivered, 0))} icon={CheckCircle2} tone="amber" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Delivered vs failed" subtitle="Top campaigns by delivery" />
          <CardBody><Bars data={chartData} series={[{ key: "delivered", name: "Delivered", color: COLORS.green }, { key: "failed", name: "Failed", color: COLORS.red }]} /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Delivery rate trend" />
          <CardBody><LineTrend data={VOLUME_MONTHLY.map((m) => ({ label: m.label, rate: Math.round((m.delivered / m.sent) * 1000) / 10 }))} series={[{ key: "rate", name: "Delivery %", color: COLORS.brand }]} /></CardBody>
        </Card>
      </div>
      <Card className="mt-5">
        <CardHeader title="Campaign leaderboard" subtitle="Ranked by delivery rate" />
        <div className="divide-y divide-[#f6f1ea]">
          {best.map((c, i) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-sunken text-xs font-bold text-navy-700">{i + 1}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-navy-900">{c.name}</p><p className="text-xs text-navy-600">{c.sender} &middot; {fmtInt(c.recipients)} recipients</p></div>
              <div className="flex w-40 items-center gap-2"><Progress value={c.deliveredPct} tone="green" /><span className="w-10 text-right text-sm font-semibold text-navy-900">{c.deliveredPct}%</span></div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
