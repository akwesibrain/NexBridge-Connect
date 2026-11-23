import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet as WalletIcon, CreditCard, Receipt, Tag, TrendingUp, TrendingDown, Check,
  Download, ArrowRight, ShieldCheck, Loader2, CheckCircle2, Info,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Progress from "../../components/ui/Progress";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { AreaTrend } from "../../components/charts/Charts";
import { fmtInt, fmtGhs, fmtRate, fmtDate } from "../../lib/format";
import Skeleton from "../../components/ui/Skeleton";
import { useMockLoad } from "../../lib/useMockLoad";
import { ORG, PACKAGES, TRANSACTIONS, VOLUME_MONTHLY, COLORS } from "../../data/mock";

export function Wallet() {
  const loading = useMockLoad();
  return (
    <>
      <PageHeader title="SMS Wallet" subtitle="Your credit balance and usage."
        actions={<Button as={Link} to="/app/buy-credits" icon={CreditCard}>Buy credits</Button>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-1">
          <div className="bg-gradient-to-br from-brand-700 to-navy-800 p-6 text-white">
            <div className="flex items-center justify-between"><span className="text-sm text-brand-100">Available balance</span><WalletIcon size={20} className="text-brand-200" /></div>
            {loading
              ? <Skeleton className="mt-3 h-10 w-40" style={{ background: "rgba(255,255,255,.28)" }} />
              : <p className="mt-3 text-4xl font-extrabold">{fmtInt(ORG.credits)}</p>}
            <p className="mt-1 text-sm text-brand-100">SMS credits &middot; {ORG.plan} plan</p>
            <Button as={Link} to="/app/buy-credits" variant="outline" className="mt-5 w-full" icon={ArrowRight}>Top up</Button>
          </div>
          <CardBody>
            {loading ? (
              <div className="space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-2 w-full rounded-full" /><Skeleton className="h-3 w-32" /></div>
            ) : (<>
              <div className="mb-1 flex justify-between text-sm"><span className="text-navy-600">Monthly usage</span><span className="font-semibold text-navy-900">182,400 / 250,000</span></div>
              <Progress value={73} tone="brand" />
              <p className="mt-2 text-xs text-navy-500">Resets on 1 Dec 2026</p>
            </>)}
          </CardBody>
        </Card>
        <div className="grid gap-5 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-3">
            {loading ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start justify-between"><Skeleton className="h-3 w-24" /><Skeleton className="h-9 w-9 rounded-lg" /></div>
                <Skeleton className="mt-3 h-7 w-28" />
              </Card>
            )) : (<>
              <StatCard label="Spent this month" value={fmtGhs(4260)} icon={TrendingDown} tone="red" />
              <StatCard label="Credits used" value="182,400" icon={TrendingUp} tone="brand" />
              <StatCard label="Avg. cost / SMS" value={fmtRate(0.023)} icon={Tag} tone="navy" />
            </>)}
          </div>
          <Card>
            <CardHeader title="Credit usage" subtitle="Last 6 months" />
            <CardBody>{loading ? <Skeleton className="h-[200px] w-full rounded-xl" /> : <AreaTrend height={200} data={VOLUME_MONTHLY} series={[{ key: "sent", name: "Credits used", color: COLORS.brand }]} />}</CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export function BuyCredits() {
  const toast = useToast();
  const [selected, setSelected] = useState(PACKAGES[1].name);
  const [method, setMethod] = useState("momo");
  const [phase, setPhase] = useState("idle"); // idle | processing | success
  const [open, setOpen] = useState(false);
  const pkg = PACKAGES.find((p) => p.name === selected);

  const pay = () => {
    setOpen(true); setPhase("processing");
    setTimeout(() => setPhase("success"), 1800);
  };

  return (
    <>
      <PageHeader title="Buy Credits" subtitle="Top up your SMS wallet. No card is charged in this demo." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {PACKAGES.map((p) => (
              <button key={p.name} onClick={() => setSelected(p.name)}
                className={`relative rounded-2xl border bg-white p-5 text-left transition ${selected === p.name ? "border-brand-500 ring-1 ring-brand-500" : "border-[#efe7dd] hover:border-brand-300"}`}>
                {p.popular && <span className="absolute -top-2.5 right-4 rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">POPULAR</span>}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-navy-900">{p.name}</h3>
                  <span className={`grid h-5 w-5 place-items-center rounded-full border ${selected === p.name ? "border-brand-600 bg-brand-600" : "border-[#e0d8cf]"}`}>{selected === p.name && <Check size={13} className="text-white" />}</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-navy-900">{fmtGhs(p.price)}</p>
                <p className="text-sm text-navy-600">{fmtInt(p.units)} credits &middot; {fmtRate(p.perSms)}/SMS</p>
              </button>
            ))}
          </div>
        </div>
        <Card className="h-fit">
          <CardHeader title="Checkout" />
          <CardBody className="space-y-4">
            <div className="rounded-xl bg-surface-muted p-4">
              <div className="flex justify-between text-sm"><span className="text-navy-600">Package</span><span className="font-semibold text-navy-900">{pkg.name}</span></div>
              <div className="mt-1 flex justify-between text-sm"><span className="text-navy-600">Credits</span><span className="font-semibold text-navy-900">{fmtInt(pkg.units)}</span></div>
              <div className="mt-3 flex justify-between border-t border-[#efe7dd] pt-3"><span className="font-medium text-navy-800">Total</span><span className="text-lg font-extrabold text-navy-900">{fmtGhs(pkg.price)}</span></div>
            </div>
            <Field label="Payment method">
              <div className="space-y-2">
                {[["momo", "Mobile Money"], ["card", "Debit / Credit card"], ["bank", "Bank transfer"]].map(([v, l]) => (
                  <label key={v} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${method === v ? "border-brand-400 bg-brand-50/50" : "border-[#efe7dd]"}`}>
                    <input type="radio" name="pm" checked={method === v} onChange={() => setMethod(v)} className="text-brand-600" />
                    <span className="font-medium text-navy-900">{l}</span>
                  </label>
                ))}
              </div>
            </Field>
            {method === "momo" && <Field label="Mobile number"><Input placeholder="+233 20 123 4567" /></Field>}
            <Button className="w-full" icon={ShieldCheck} onClick={pay}>Pay {fmtGhs(pkg.price)}</Button>
            <p className="flex items-center gap-1.5 text-center text-xs text-navy-500"><Info size={13} /> Simulated checkout. No real payment is taken.</p>
          </CardBody>
        </Card>
      </div>

      <Modal open={open} onClose={() => phase !== "processing" && setOpen(false)} title={phase === "success" ? "Payment successful" : "Processing payment"}>
        {phase === "processing" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Loader2 size={40} className="animate-spin text-brand-600" />
            <p className="mt-4 text-sm font-medium text-navy-900">Confirming your payment…</p>
            <p className="mt-1 text-xs text-navy-500">This is a simulated transaction.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={32} /></span>
            <p className="mt-4 text-base font-semibold text-navy-900">{fmtInt(pkg.units)} credits added</p>
            <p className="mt-1 text-sm text-navy-600">Your new balance is {fmtInt(ORG.credits + pkg.units)} credits.</p>
            <Button className="mt-5 w-full" onClick={() => { setOpen(false); toast.success("Credits added to wallet (demo)"); }}>Done</Button>
          </div>
        )}
      </Modal>
    </>
  );
}

export function Transactions() {
  const toast = useToast();
  const columns = [
    { key: "id", header: "Reference", render: (r) => <span className="font-mono text-xs font-medium text-navy-900">{r.id}</span> },
    { key: "package", header: "Package", render: (r) => <Badge tone="navy">{r.package}</Badge> },
    { key: "units", header: "Credits", align: "right", render: (r) => fmtInt(r.units) },
    { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-semibold">{fmtGhs(r.amount)}</span> },
    { key: "method", header: "Method" },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
  ];
  const paid = TRANSACTIONS.filter((t) => t.status === "paid");
  return (
    <>
      <PageHeader title="Transaction History" subtitle="Your credit purchases and payment records."
        actions={<Button variant="outline" icon={Download} onClick={() => toast.success("Transactions exported (demo)")}>Export</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total spent" value={fmtGhs(paid.reduce((a, t) => a + t.amount, 0))} icon={Receipt} tone="brand" />
        <StatCard label="Credits purchased" value={fmtInt(paid.reduce((a, t) => a + t.units, 0))} icon={WalletIcon} tone="green" />
        <StatCard label="Transactions" value={TRANSACTIONS.length} icon={CreditCard} tone="navy" />
      </div>
      <DataTable columns={columns} rows={TRANSACTIONS} pageSize={10} searchKeys={["id", "package", "method", "status"]} emptyIcon={Receipt} />
    </>
  );
}

export function Pricing() {
  return (
    <>
      <PageHeader title="Pricing" subtitle="Credit packages available to your account." />
      <div className="grid gap-5 lg:grid-cols-4">
        {PACKAGES.map((p) => (
          <Card key={p.name} className={`p-6 ${p.popular ? "border-brand-500 ring-1 ring-brand-500" : ""}`}>
            {p.popular && <Badge tone="blue" className="mb-2">Most popular</Badge>}
            <h3 className="text-lg font-bold text-navy-900">{p.name}</h3>
            <p className="mt-2 text-3xl font-extrabold text-navy-900">{fmtGhs(p.price)}</p>
            <p className="mt-1 text-sm text-navy-600">{fmtInt(p.units)} SMS &middot; {fmtRate(p.perSms)}/SMS</p>
            <ul className="mt-4 space-y-2">{p.features.map((f) => <li key={f} className="flex items-start gap-2 text-sm text-navy-700"><Check size={15} className="mt-0.5 shrink-0 text-emerald-600" /> {f}</li>)}</ul>
            <Button as={Link} to="/app/buy-credits" className="mt-5 w-full" variant={p.popular ? "primary" : "outline"}>Buy {p.name}</Button>
          </Card>
        ))}
      </div>
      <p className="mt-6 text-xs text-navy-600">Prices are illustrative for this demo environment. Enterprise and custom volumes are available on request.</p>
    </>
  );
}
