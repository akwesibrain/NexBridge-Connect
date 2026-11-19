import { useState } from "react";
import { Link } from "react-router-dom";
import {
  IdCard, Plus, BadgeCheck, Clock, XCircle, Trash2, AlertTriangle, CheckCircle2, Info,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Confirm from "../../components/ui/Confirm";
import { Field, Input, Textarea } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { fmtInt, fmtDate } from "../../lib/format";
import Skeleton, { SkeletonCircle } from "../../components/ui/Skeleton";
import { useMockLoad } from "../../lib/useMockLoad";
import { SENDER_IDS } from "../../data/mock";

export function Senders() {
  const loading = useMockLoad();
  const toast = useToast();
  const [items, setItems] = useState(SENDER_IDS);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(null);
  const [form, setForm] = useState({ name: "", purpose: "" });

  const count = (s) => items.filter((x) => x.status === s).length;
  const submit = () => {
    if (!/^[A-Za-z0-9 -]{3,11}$/.test(form.name)) return toast.error("Sender ID must be 3–11 letters, digits, space or hyphen");
    setItems((x) => [{ id: `s${Date.now()}`, status: "pending", created: new Date().toISOString(), messages: 0, ...form, name: form.name.toUpperCase() }, ...x]);
    toast.success("Sender ID submitted for approval"); setOpen(false); setForm({ name: "", purpose: "" });
  };

  return (
    <>
      <PageHeader title="Sender IDs" subtitle="Manage the branded names your messages are sent from."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Register sender ID</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total" value={items.length} icon={IdCard} tone="brand" />
        <StatCard label="Approved" value={count("approved")} icon={BadgeCheck} tone="green" />
        <StatCard label="Pending" value={count("pending")} icon={Clock} tone="amber" />
        <StatCard label="Rejected" value={count("rejected")} icon={XCircle} tone="red" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <SkeletonCircle size={44} className="!rounded-xl" />
                <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-40" /></div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="mt-4 border-t border-[#f3ece3] pt-3"><Skeleton className="h-3 w-48" /></div>
          </Card>
        )) : items.map((s) => (
          <Card key={s.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-navy-50 font-bold text-navy-700">{s.name.slice(0, 2)}</span>
                <div>
                  <p className="font-mono text-base font-bold tracking-wide text-navy-900">{s.name}</p>
                  <p className="text-xs text-navy-600">{s.purpose}</p>
                </div>
              </div>
              <Badge status={s.status} />
            </div>
            {s.status === "rejected" && s.reason && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700"><AlertTriangle size={14} className="mt-0.5 shrink-0" /> {s.reason}</div>
            )}
            <div className="mt-4 flex items-center justify-between border-t border-[#f3ece3] pt-3 text-xs text-navy-600">
              <span>Registered {fmtDate(s.created)} &middot; {fmtInt(s.messages)} sent</span>
              <button onClick={() => setDel(s)} className="inline-flex items-center gap-1 text-navy-500 hover:text-red-600"><Trash2 size={14} /> Remove</button>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Register a sender ID" subtitle="Approval typically takes 1–3 business days."
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={submit}>Submit for approval</Button></>}>
        <div className="space-y-4">
          <Field label="Sender ID" required hint="3–11 characters. Letters, digits, spaces or hyphens.">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="HORIZON" className="font-mono uppercase" />
          </Field>
          <Field label="Purpose / use case" required><Textarea rows={3} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Describe how this sender ID will be used." /></Field>
          <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-700"><Info size={14} className="mt-0.5 shrink-0" /> Sender IDs implying gambling, lottery or unsolicited content may be rejected under network policy.</div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Remove sender ID" confirmLabel="Remove"
        message={`Remove "${del?.name}"? Messages can no longer be sent from this ID.`}
        onConfirm={() => { setItems((x) => x.filter((y) => y.id !== del.id)); toast.success("Sender ID removed"); }} />
    </>
  );
}

const REQS = [
  "Must be 3 to 11 characters long",
  "Letters, numbers, spaces and hyphens only",
  "Should represent your brand or organization",
  "Cannot imply gambling, adult or illegal content",
  "Must not impersonate another brand",
];

export function SenderRegister() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", org: "", purpose: "", sample: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!/^[A-Za-z0-9 -]{3,11}$/.test(form.name)) return toast.error("Sender ID must be 3–11 valid characters");
    toast.success("Registration submitted. Status is now Pending");
    setForm({ name: "", org: "", purpose: "", sample: "" });
  };
  return (
    <>
      <PageHeader title="Sender ID Registration" subtitle="Submit a new branded sender ID for network approval."
        actions={<Button as={Link} to="/app/senders" variant="outline">Back to sender IDs</Button>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <form onSubmit={submit}>
              <CardBody className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Sender ID" required><Input value={form.name} onChange={set("name")} placeholder="HORIZON" className="font-mono uppercase" /></Field>
                  <Field label="Registered organization" required><Input value={form.org} onChange={set("org")} placeholder="Horizon Retail Group" /></Field>
                </div>
                <Field label="Purpose / use case" required><Textarea rows={3} value={form.purpose} onChange={set("purpose")} placeholder="Transactional order & delivery notifications." /></Field>
                <Field label="Sample message" hint="An example of the content you'll send."><Textarea rows={3} value={form.sample} onChange={set("sample")} placeholder="Your order #HR-1234 has shipped." /></Field>
                <div className="flex justify-end gap-2 border-t border-[#f3ece3] pt-4">
                  <Button type="button" variant="outline" onClick={() => setForm({ name: "", org: "", purpose: "", sample: "" })}>Reset</Button>
                  <Button type="submit" icon={CheckCircle2}>Submit registration</Button>
                </div>
              </CardBody>
            </form>
          </Card>
        </div>
        <Card className="h-fit">
          <CardHeader title="Requirements" />
          <CardBody>
            <ul className="space-y-2.5">
              {REQS.map((r) => <li key={r} className="flex items-start gap-2 text-sm text-navy-700"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" /> {r}</li>)}
            </ul>
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">Approval typically takes 1–3 business days. You&apos;ll be notified of the outcome.</div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
