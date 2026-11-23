import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Send, Trash2, Eye, Layers, Users2, CheckCircle2, Clock, FileText, Plus, Variable,
  ChevronRight, ChevronLeft, CalendarClock, Megaphone, Save, Smartphone, Pencil, Copy,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Progress from "../../components/ui/Progress";
import Tabs from "../../components/ui/Tabs";
import Modal from "../../components/ui/Modal";
import DataTable from "../../components/ui/DataTable";
import EmptyState from "../../components/ui/EmptyState";
import { Field, Input, Textarea, Select } from "../../components/ui/Field";
import Skeleton from "../../components/ui/Skeleton";
import { useMockLoad } from "../../lib/useMockLoad";
import { useToast } from "../../components/ui/Toast.jsx";
import { smsSegments, fmtInt, fmtDate, fmtDateTime, relTime } from "../../lib/format";
import {
  SENDER_IDS, GROUPS, TEMPLATES, CAMPAIGNS, SCHEDULED, MESSAGES, COUNTRIES, ORG,
} from "../../data/mock";

const approvedSenders = SENDER_IDS.filter((s) => s.status === "approved");

// ── Reusable message composer card ──────────────────────────────
function Composer({ value, onChange, variables }) {
  const seg = smsSegments(value);
  const insert = (v) => onChange(`${value}${v}`);
  return (
    <div>
      <Textarea rows={6} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Type your message…" />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-600">
        <div className="flex flex-wrap items-center gap-3">
          <span>{seg.length} chars</span>
          <span className="text-navy-300">|</span>
          <span>{seg.segments} segment{seg.segments === 1 ? "" : "s"}</span>
          <span className="text-navy-300">|</span>
          <span>{seg.remaining} left in segment</span>
          {seg.unicode && <Badge tone="amber">Unicode (70/segment)</Badge>}
        </div>
      </div>
      {variables && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-navy-600"><Variable size={13} /> Insert:</span>
          {["{name}", "{first_name}", "{amount}", "{code}", "{link}"].map((v) => (
            <button key={v} type="button" onClick={() => insert(v)} className="rounded-md bg-surface-sunken px-2 py-1 text-xs font-medium text-navy-700 hover:bg-[#e7ddd1]">{v}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function PhonePreview({ sender, message }) {
  return (
    <div className="mx-auto w-full max-w-[240px]">
      <div className="rounded-[2rem] border-[7px] border-navy-900 bg-navy-900 p-2 shadow-pop">
        <div className="rounded-[1.4rem] bg-surface-sunken p-3">
          <p className="mb-2 text-center text-[11px] font-semibold text-navy-700">{sender || "SENDER"}</p>
          <div className="min-h-[120px] rounded-2xl rounded-tl-sm bg-white p-3 text-[12px] leading-relaxed text-navy-800 shadow-sm">
            {message || <span className="text-navy-500">Your message preview appears here…</span>}
          </div>
          <p className="mt-1.5 text-right text-[11px] text-navy-600">now</p>
        </div>
      </div>
    </div>
  );
}

// ── Quick SMS ───────────────────────────────────────────────────
export function QuickSms() {
  const toast = useToast();
  const [dial, setDial] = useState("+233");
  const [recipients, setRecipients] = useState("");
  const [sender, setSender] = useState(approvedSenders[0]?.name || "");
  const [message, setMessage] = useState("");
  const [tplOpen, setTplOpen] = useState(false);

  const list = recipients.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
  const count = list.length;
  const invalid = list.filter((n) => !/^\+?\d{6,15}$/.test(n.replace(/[\s()-]/g, "")));
  const seg = smsSegments(message);
  const cost = count * seg.segments;

  const [sending, setSending] = useState(false);
  const send = () => {
    if (!count) return toast.error("Add at least one recipient");
    if (invalid.length) return toast.error(`Invalid number${invalid.length === 1 ? "" : "s"}: ${invalid.slice(0, 3).join(", ")}`);
    if (cost > ORG.credits) return toast.error("Not enough credits to send this message");
    if (!message.trim()) return toast.error("Message cannot be empty");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success(`Queued ${fmtInt(count)} message${count === 1 ? "" : "s"} (demo)`);
      setRecipients(""); setMessage("");
    }, 1100);
  };

  return (
    <>
      <PageHeader title="Quick SMS" subtitle="Send a message to one or more recipients instantly."
        actions={<Button variant="outline" icon={FileText} onClick={() => setTplOpen(true)}>Use template</Button>} />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardBody className="space-y-4">
              <Field label="Sender ID" hint="Only approved sender IDs can be used.">
                <Select value={sender} onChange={(e) => setSender(e.target.value)}>
                  {approvedSenders.map((s) => <option key={s.id}>{s.name}</option>)}
                </Select>
              </Field>
              <Field label="Recipients" hint="Separate multiple numbers with commas or semicolons."
                error={invalid.length ? `${invalid.length} invalid number${invalid.length === 1 ? "" : "s"}: ${invalid.slice(0, 3).join(", ")}` : undefined}>
                <div className="flex gap-2">
                  <Select value={dial} onChange={(e) => setDial(e.target.value)} className="w-40 shrink-0">
                    {COUNTRIES.map((c) => <option key={c.code} value={c.dial}>{c.name} ({c.dial})</option>)}
                  </Select>
                  <div className="flex-1"><Input value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="201234567, 244112233" /></div>
                </div>
              </Field>
              <Field label="Message">
                <Composer value={message} onChange={setMessage} />
              </Field>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card><CardBody><PhonePreview sender={sender} message={message} /></CardBody></Card>
          <Card>
            <CardHeader title="Summary" />
            <CardBody className="space-y-2.5 text-sm">
              {[["Recipients", fmtInt(count)], ["Segments / msg", seg.segments], ["Encoding", seg.unicode ? "Unicode" : "GSM-7"], ["Estimated credits", fmtInt(cost)]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between"><span className="text-navy-600">{k}</span><span className="font-semibold text-navy-900">{v}</span></div>
              ))}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" disabled={sending} onClick={() => { setRecipients(""); setMessage(""); }}>Clear</Button>
                <Button className="flex-1" icon={Send} loading={sending} onClick={send}>{sending ? "Sending…" : "Send"}</Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal open={tplOpen} onClose={() => setTplOpen(false)} title="Choose a template" size="lg">
        <div className="grid gap-3 sm:grid-cols-2">
          {TEMPLATES.map((t) => (
            <button key={t.id} onClick={() => { setMessage(t.body); setTplOpen(false); toast.info("Template inserted"); }}
              className="rounded-xl border border-[#efe7dd] p-4 text-left hover:border-brand-300 hover:bg-brand-50/40">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold text-navy-900">{t.name}</span><Badge tone="blue">{t.category}</Badge></div>
              <p className="mt-1.5 line-clamp-2 text-xs text-navy-600">{t.body}</p>
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}

// ── Bulk SMS (multi-step) ───────────────────────────────────────
const STEPS = ["Audience", "Sender", "Compose", "Review"];
export function BulkSms() {
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [groups, setGroups] = useState([]);
  const [sender, setSender] = useState(approvedSenders[0]?.name || "");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [schedule, setSchedule] = useState(false);
  const [when, setWhen] = useState("");

  const audience = GROUPS.filter((g) => groups.includes(g.id)).reduce((a, g) => a + g.count, 0);
  const seg = smsSegments(message);
  const cost = audience * seg.segments;
  const toggle = (id) => setGroups((g) => g.includes(id) ? g.filter((x) => x !== id) : [...g, id]);
  const whenValid = !schedule || (!!when && new Date(when).getTime() > Date.now());
  const canNext = [groups.length > 0, !!sender, message.trim().length > 0 && name.trim().length > 0 && whenValid, true][step];
  const insufficient = cost > ORG.credits;

  const [launching, setLaunching] = useState(false);
  const launch = () => {
    if (insufficient) return toast.error("Not enough credits for this campaign. Top up or reduce the audience.");
    if (!whenValid) return toast.error("Choose a send time in the future");
    setLaunching(true);
    setTimeout(() => {
      setLaunching(false);
      toast.success(schedule ? "Campaign scheduled (demo)" : "Campaign launched (demo)");
      setStep(0); setGroups([]); setName(""); setMessage(""); setSchedule(false); setWhen("");
    }, 1300);
  };

  return (
    <>
      <PageHeader title="Bulk SMS" subtitle="Create and send a campaign to your contact groups." />
      {/* Stepper */}
      <div className="mb-6 flex items-center">
        {STEPS.map((s, i) => (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${i < step ? "bg-brand-600 text-white" : i === step ? "bg-brand-600 text-white ring-4 ring-brand-100" : "bg-surface-sunken text-navy-600"}`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${i <= step ? "text-navy-900" : "text-navy-500"}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`mx-3 h-0.5 flex-1 rounded ${i < step ? "bg-brand-500" : "bg-surface-sunken"}`} />}
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              {step === 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-navy-900">Select contact groups</h3>
                  {GROUPS.map((g) => (
                    <label key={g.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${groups.includes(g.id) ? "border-brand-400 bg-brand-50/50" : "border-[#efe7dd] hover:bg-surface-muted"}`}>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={groups.includes(g.id)} onChange={() => toggle(g.id)} className="h-4 w-4 rounded border-[#e0d8cf] text-brand-600" />
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-sunken text-navy-700"><Users2 size={17} /></span>
                        <div><p className="text-sm font-medium text-navy-900">{g.name}</p><p className="text-xs text-navy-600">Updated {relTime(g.updated)}</p></div>
                      </div>
                      <span className="text-sm font-semibold text-navy-900">{fmtInt(g.count)}</span>
                    </label>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-navy-900">Choose a sender ID</h3>
                  {approvedSenders.map((s) => (
                    <label key={s.id} className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 ${sender === s.name ? "border-brand-400 bg-brand-50/50" : "border-[#efe7dd] hover:bg-surface-muted"}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="snd" checked={sender === s.name} onChange={() => setSender(s.name)} className="text-brand-600" />
                        <div><p className="text-sm font-medium text-navy-900">{s.name}</p><p className="text-xs text-navy-600">{s.purpose}</p></div>
                      </div>
                      <Badge status="approved" />
                    </label>
                  ))}
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <Field label="Campaign name" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="November Promo 2026" /></Field>
                  <Field label="Message"><Composer value={message} onChange={setMessage} variables /></Field>
                  <label className="flex items-center gap-2 text-sm text-navy-800"><input type="checkbox" checked={schedule} onChange={(e) => setSchedule(e.target.checked)} className="rounded border-[#e0d8cf]" /> Schedule for later</label>
                  {schedule && <Field label="Send at" required error={when && !whenValid ? "Send time must be in the future" : undefined} hint="Pick a date and time in the future."><Input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} /></Field>}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-navy-900">Review campaign</h3>
                  <dl className="grid gap-px overflow-hidden rounded-xl border border-[#efe7dd] bg-surface-sunken text-sm sm:grid-cols-2">
                    {[["Campaign", name || "Not set"], ["Sender ID", sender], ["Groups", groups.length], ["Audience", fmtInt(audience)], ["Segments / msg", seg.segments], ["Estimated credits", fmtInt(cost)], ["Delivery", schedule ? `Scheduled ${when ? fmtDateTime(when) : ""}` : "Send immediately"]].map(([k, v]) => (
                      <div key={k} className="bg-white px-4 py-3"><dt className="text-xs text-navy-600">{k}</dt><dd className="mt-0.5 font-medium text-navy-900">{v}</dd></div>
                    ))}
                  </dl>
                  <div className="rounded-xl bg-surface-muted p-4"><p className="text-xs font-semibold uppercase tracking-wide text-navy-500">Message</p><p className="mt-1 whitespace-pre-wrap text-sm text-navy-800">{message || "No message yet"}</p></div>
                  {insufficient && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">This campaign needs {fmtInt(cost)} credits but you have {fmtInt(ORG.credits)}. <Link to="/app/buy-credits" className="font-semibold underline">Buy credits</Link> or select fewer groups.</div>}
                </div>
              )}
              <div className="mt-6 flex items-center justify-between border-t border-[#f3ece3] pt-4">
                <Button variant="ghost" icon={ChevronLeft} disabled={step === 0} onClick={() => setStep((s) => s - 1)}>Back</Button>
                {step < 3
                  ? <Button icon={ChevronRight} disabled={!canNext} onClick={() => setStep((s) => s + 1)}>Continue</Button>
                  : <div className="flex gap-2"><Button variant="outline" icon={Save} disabled={launching} onClick={() => toast.info("Saved as draft (demo)")}>Save draft</Button><Button icon={schedule ? CalendarClock : Send} loading={launching} disabled={insufficient} onClick={launch}>{launching ? (schedule ? "Scheduling…" : "Launching…") : (schedule ? "Schedule" : "Launch campaign")}</Button></div>}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-5">
          <Card><CardBody><PhonePreview sender={sender} message={message} /></CardBody></Card>
          <Card>
            <CardHeader title="Estimate" />
            <CardBody className="space-y-2.5 text-sm">
              {[["Groups selected", groups.length], ["Audience size", fmtInt(audience)], ["Segments / msg", seg.segments], ["Estimated credits", fmtInt(cost)]].map(([k, v]) => (
                <div key={k} className="flex justify-between"><span className="text-navy-600">{k}</span><span className="font-semibold text-navy-900">{v}</span></div>
              ))}
              {insufficient
                ? <div className="mt-2 rounded-lg bg-red-50 p-3 text-xs text-red-700">Short by {fmtInt(cost - ORG.credits)} credits</div>
                : <div className="mt-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-700">Balance after send: {fmtInt(ORG.credits - cost)} credits</div>}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

// ── Campaigns ───────────────────────────────────────────────────
export function Campaigns() {
  const toast = useToast();
  const [tab, setTab] = useState("all");
  const [detail, setDetail] = useState(null);
  const filtered = tab === "all" ? CAMPAIGNS : CAMPAIGNS.filter((c) => c.status === tab);
  const counts = (s) => CAMPAIGNS.filter((c) => c.status === s).length;

  const columns = [
    { key: "name", header: "Campaign", render: (r) => <div><p className="font-medium text-navy-900">{r.name}</p><p className="text-xs text-navy-600">{r.sender} &middot; {fmtDate(r.created)}</p></div> },
    { key: "recipients", header: "Recipients", align: "right", render: (r) => fmtInt(r.recipients) },
    { key: "deliveredPct", header: "Delivered", render: (r) => <div className="flex items-center gap-2"><Progress value={r.deliveredPct} tone="green" className="w-20" /><span className="text-xs text-navy-600">{r.deliveredPct}%</span></div> },
    { key: "failed", header: "Failed", align: "right", render: (r) => <span className="text-red-600">{fmtInt(r.failed)}</span> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => <Button size="sm" variant="ghost" icon={Eye} onClick={() => setDetail(r)}>View</Button> },
  ];

  return (
    <>
      <PageHeader title="Campaigns" subtitle="Monitor and manage your bulk messaging campaigns."
        actions={<Button as={Link} to="/app/bulk-sms" icon={Plus}>New campaign</Button>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-4">
        <StatCard label="Total campaigns" value={CAMPAIGNS.length} icon={Megaphone} tone="brand" />
        <StatCard label="Completed" value={counts("completed")} icon={CheckCircle2} tone="green" />
        <StatCard label="Scheduled" value={counts("scheduled")} icon={CalendarClock} tone="amber" />
        <StatCard label="Drafts" value={counts("draft")} icon={FileText} tone="navy" />
      </div>
      <Tabs className="mb-4" value={tab} onChange={setTab} tabs={[
        { id: "all", label: "All", count: CAMPAIGNS.length }, { id: "completed", label: "Completed", count: counts("completed") },
        { id: "scheduled", label: "Scheduled", count: counts("scheduled") }, { id: "processing", label: "Processing", count: counts("processing") },
        { id: "draft", label: "Drafts", count: counts("draft") }, { id: "cancelled", label: "Cancelled", count: counts("cancelled") },
      ]} />
      <DataTable columns={columns} rows={filtered} searchKeys={["name", "sender", "status"]} emptyIcon={Megaphone} emptyTitle="No campaigns here" />

      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.name} subtitle={`Sender ${detail?.sender}`} size="lg"
        footer={<><Button variant="outline" onClick={() => toast.success("Report exported (demo)")}>Export report</Button><Button onClick={() => setDetail(null)}>Close</Button></>}>
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["Recipients", fmtInt(detail.recipients)], ["Delivered", fmtInt(detail.delivered)], ["Failed", fmtInt(detail.failed)], ["Pending", fmtInt(detail.pending)]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-surface-muted p-3"><p className="text-xs text-navy-600">{k}</p><p className="mt-1 text-lg font-bold text-navy-900">{v}</p></div>
              ))}
            </div>
            <div><div className="mb-1 flex justify-between text-sm"><span className="text-navy-600">Delivery rate</span><span className="font-semibold">{detail.deliveredPct}%</span></div><Progress value={detail.deliveredPct} tone="green" /></div>
            <div className="flex items-center justify-between rounded-xl border border-[#efe7dd] p-3 text-sm"><span className="text-navy-600">Status</span><Badge status={detail.status} /></div>
          </div>
        )}
      </Modal>
    </>
  );
}

// ── Scheduled ───────────────────────────────────────────────────
export function Scheduled() {
  const toast = useToast();
  const [rows, setRows] = useState(SCHEDULED);
  const columns = [
    { key: "name", header: "Campaign", render: (r) => <span className="font-medium text-navy-900">{r.name}</span> },
    { key: "sender", header: "Sender" },
    { key: "recipients", header: "Recipients", align: "right", render: (r) => fmtInt(r.recipients) },
    { key: "scheduledAt", header: "Scheduled for", render: (r) => <span className="inline-flex items-center gap-1.5 text-navy-800"><CalendarClock size={14} className="text-amber-500" /> {fmtDateTime(r.scheduledAt)}</span> },
    { key: "status", header: "Status", render: () => <Badge status="scheduled" /> },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" aria-label="Edit schedule" icon={Pencil} onClick={() => toast.info("Edit schedule (demo)")} />
        <Button size="sm" variant="ghost" aria-label="Cancel schedule" icon={Trash2} onClick={() => { setRows((x) => x.filter((y) => y.id !== r.id)); toast.success("Schedule cancelled"); }} />
      </div>
    )},
  ];
  return (
    <>
      <PageHeader title="Scheduled Messages" subtitle="Campaigns queued to send automatically."
        actions={<Button as={Link} to="/app/bulk-sms" icon={Plus}>Schedule campaign</Button>} />
      {rows.length ? <DataTable columns={columns} rows={rows} searchKeys={["name", "sender"]} />
        : <EmptyState icon={CalendarClock} title="Nothing scheduled" message="Scheduled campaigns will appear here." />}
    </>
  );
}

// ── Templates ───────────────────────────────────────────────────
export function Templates() {
  const toast = useToast();
  const loading = useMockLoad();
  const [items, setItems] = useState(TEMPLATES);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Transactional", body: "" });

  const openNew = () => { setEdit(null); setForm({ name: "", category: "Transactional", body: "" }); setOpen(true); };
  const openEdit = (t) => { setEdit(t); setForm(t); setOpen(true); };
  const save = () => {
    if (!form.name.trim() || !form.body.trim()) return toast.error("Name and body are required");
    if (edit) { setItems((x) => x.map((t) => t.id === edit.id ? { ...edit, ...form, updated: new Date().toISOString() } : t)); toast.success("Template updated"); }
    else { setItems((x) => [{ id: `t${Date.now()}`, updated: new Date().toISOString(), ...form }, ...x]); toast.success("Template created"); }
    setOpen(false);
  };
  const remove = (id) => { setItems((x) => x.filter((t) => t.id !== id)); toast.success("Template deleted"); };

  return (
    <>
      <PageHeader title="Message Templates" subtitle="Reusable message content with personalization variables."
        actions={<Button icon={Plus} onClick={openNew}>New template</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="flex flex-col">
            <div className="flex items-start justify-between border-b border-[#f3ece3] p-4">
              <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-4 w-20 rounded-full" /></div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="space-y-2 p-4"><Skeleton className="h-3" /><Skeleton className="h-3" /><Skeleton className="h-3 w-2/3" /></div>
          </Card>
        )) : items.map((t) => {
          const seg = smsSegments(t.body);
          return (
            <Card key={t.id} className="flex flex-col">
              <div className="flex items-start justify-between border-b border-[#f3ece3] p-4">
                <div><p className="text-sm font-semibold text-navy-900">{t.name}</p><Badge tone="blue" className="mt-1">{t.category}</Badge></div>
                <div className="flex gap-1">
                  <button aria-label="Copy template" onClick={() => { navigator.clipboard?.writeText(t.body); toast.info("Copied"); }} className="rounded-lg p-1.5 text-navy-500 hover:bg-surface-sunken hover:text-navy-700"><Copy size={15} /></button>
                  <button aria-label="Edit template" onClick={() => openEdit(t)} className="rounded-lg p-1.5 text-navy-500 hover:bg-surface-sunken hover:text-navy-700"><Pencil size={15} /></button>
                  <button aria-label="Delete template" onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-navy-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="flex-1 text-sm text-navy-700">{t.body}</p>
                <p className="mt-3 text-xs text-navy-500">{seg.length} chars &middot; {seg.segments} segment{seg.segments === 1 ? "" : "s"} &middot; updated {relTime(t.updated)}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={edit ? "Edit template" : "New template"}
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Save} onClick={save}>Save template</Button></>}>
        <div className="space-y-4">
          <Field label="Template name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="Category"><Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{["Transactional", "Marketing", "Notification"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Message body" required><Composer value={form.body} onChange={(v) => setForm({ ...form, body: v })} variables /></Field>
        </div>
      </Modal>
    </>
  );
}

// ── Messaging overview ──────────────────────────────────────────
export function MessagingOverview() {
  const delivered = MESSAGES.filter((m) => m.status === "delivered").length;
  return (
    <>
      <PageHeader title="Messaging" subtitle="Your messaging activity at a glance."
        actions={<><Button as={Link} to="/app/bulk-sms" variant="outline" icon={Layers}>Bulk SMS</Button><Button as={Link} to="/app/quick-sms" icon={Send}>Quick SMS</Button></>} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Sent (30d)" value="1.28M" icon={Send} tone="brand" trend={8.4} />
        <StatCard label="Delivered" value={`${Math.round((delivered / MESSAGES.length) * 100)}%`} icon={CheckCircle2} tone="green" trend={1.2} />
        <StatCard label="Pending" value={fmtInt(MESSAGES.filter((m) => m.status === "pending").length)} icon={Clock} tone="amber" />
        <StatCard label="Templates" value={TEMPLATES.length} icon={FileText} tone="navy" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          { to: "/app/quick-sms", icon: Send, t: "Quick SMS", d: "Send to one or many recipients instantly." },
          { to: "/app/bulk-sms", icon: Layers, t: "Bulk SMS", d: "Run a personalized campaign to contact groups." },
          { to: "/app/templates", icon: FileText, t: "Templates", d: "Manage reusable message content." },
        ].map((c) => (
          <Link key={c.to} to={c.to}><Card className="h-full p-6 transition hover:border-brand-300 hover:shadow-pop">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><c.icon size={21} /></span>
            <h3 className="mt-4 flex items-center gap-1 text-base font-semibold text-navy-900">{c.t} <ChevronRight size={16} className="text-navy-500" /></h3>
            <p className="mt-1 text-sm text-navy-600">{c.d}</p>
          </Card></Link>
        ))}
      </div>
    </>
  );
}
