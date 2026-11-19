import { useState } from "react";
import {
  IdCard, Plus, BadgeCheck, Clock, XCircle, Trash2, AlertTriangle, Info,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Confirm from "../../components/ui/Confirm";
import { Field, Input } from "../../components/ui/Field";
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
  const [form, setForm] = useState({ name: "" });

  const count = (s) => items.filter((x) => x.status === s).length;
  const submit = () => {
    if (!/^[A-Za-z0-9 -]{3,11}$/.test(form.name)) return toast.error("Sender ID must be 3–11 letters, digits, space or hyphen");
    setItems((x) => [{ id: `s${Date.now()}`, status: "pending", created: new Date().toISOString(), messages: 0, name: form.name.toUpperCase() }, ...x]);
    toast.success("Sender ID submitted for approval"); setOpen(false); setForm({ name: "" });
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
                  {s.purpose && <p className="text-xs text-navy-600">{s.purpose}</p>}
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
          <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-700"><Info size={14} className="mt-0.5 shrink-0" /> Sender IDs implying gambling, lottery or unsolicited content may be rejected under network policy.</div>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Remove sender ID" confirmLabel="Remove"
        message={`Remove "${del?.name}"? Messages can no longer be sent from this ID.`}
        onConfirm={() => { setItems((x) => x.filter((y) => y.id !== del.id)); toast.success("Sender ID removed"); }} />
    </>
  );
}
