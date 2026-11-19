import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Upload, Download, Users2, Contact, Trash2, Pencil, FileSpreadsheet,
  FileText, CheckCircle2, UserPlus, Search, Tag,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Confirm from "../../components/ui/Confirm";
import DataTable from "../../components/ui/DataTable";
import { Field, Input, Select } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { fmtInt, fmtDate, relTime } from "../../lib/format";
import { CONTACTS, GROUPS } from "../../data/mock";

export function Contacts() {
  const toast = useToast();
  const [rows, setRows] = useState(CONTACTS);
  const [open, setOpen] = useState(false);
  const [del, setDel] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", group: GROUPS[0].name });

  const add = () => {
    if (!form.name.trim() || !form.phone.trim()) return toast.error("Name and phone are required");
    setRows((r) => [{ id: `ct${Date.now()}`, tags: [], added: new Date().toISOString(), birthday: "", ...form }, ...r]);
    toast.success("Contact added"); setOpen(false); setForm({ name: "", phone: "", email: "", group: GROUPS[0].name });
  };

  const columns = [
    { key: "name", header: "Name", render: (r) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
        <div><p className="font-medium text-navy-900">{r.name}</p><p className="text-xs text-navy-600">{r.email || "No email"}</p></div>
      </div>
    )},
    { key: "phone", header: "Phone" },
    { key: "group", header: "Group", render: (r) => <Badge tone="navy">{r.group}</Badge> },
    { key: "tags", header: "Tags", sortable: false, render: (r) => <div className="flex flex-wrap gap-1">{r.tags.length ? r.tags.map((t) => <Badge key={t} tone="blue">{t}</Badge>) : <span className="text-xs text-navy-500">None</span>}</div> },
    { key: "added", header: "Added", render: (r) => fmtDate(r.added) },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" aria-label="Edit contact" icon={Pencil} onClick={() => toast.info("Edit contact (demo)")} />
        <Button size="sm" variant="ghost" aria-label="Delete contact" icon={Trash2} onClick={() => setDel(r)} />
      </div>
    )},
  ];

  return (
    <>
      <PageHeader title="All Contacts" subtitle="Your complete contact directory."
        actions={<><Button as={Link} to="/app/import" variant="outline" icon={Upload}>Import</Button><Button icon={UserPlus} onClick={() => setOpen(true)}>Add contact</Button></>} />
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total contacts" value={fmtInt(rows.length)} icon={Contact} tone="brand" />
        <StatCard label="Contact groups" value={GROUPS.length} icon={Users2} tone="navy" />
        <StatCard label="With email" value={fmtInt(rows.filter((r) => r.email).length)} icon={CheckCircle2} tone="green" />
      </div>
      <DataTable columns={columns} rows={rows} pageSize={10} searchKeys={["name", "phone", "email", "group"]} emptyIcon={Contact} emptyTitle="No contacts yet" emptyMessage="Add a contact or import from a file." />

      <Modal open={open} onClose={() => setOpen(false)} title="Add contact"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Plus} onClick={add}>Add contact</Button></>}>
        <div className="space-y-4">
          <Field label="Full name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Kwame Mensah" /></Field>
          <Field label="Phone number" required><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+233 20 123 4567" /></Field>
          <Field label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
          <Field label="Group"><Select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>{GROUPS.map((g) => <option key={g.id}>{g.name}</option>)}</Select></Field>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Delete contact" confirmLabel="Delete"
        message={`Remove ${del?.name} from your contacts? This cannot be undone.`}
        onConfirm={() => { setRows((r) => r.filter((x) => x.id !== del.id)); toast.success("Contact deleted"); }} />
    </>
  );
}

export function Groups() {
  const toast = useToast();
  const [groups, setGroups] = useState(GROUPS);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const create = () => {
    if (!name.trim()) return toast.error("Enter a group name");
    setGroups((g) => [{ id: `g${Date.now()}`, name, slug: name.toLowerCase().replace(/\s+/g, "-"), count: 0, updated: new Date().toISOString() }, ...g]);
    toast.success("Group created"); setOpen(false); setName("");
  };
  return (
    <>
      <PageHeader title="Contact Groups" subtitle="Organize contacts into targetable audiences."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>New group</Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600"><Users2 size={21} /></span>
              <button onClick={() => { setGroups((x) => x.filter((y) => y.id !== g.id)); toast.success("Group deleted"); }} className="rounded-lg p-1.5 text-navy-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button>
            </div>
            <h3 className="mt-4 text-base font-semibold text-navy-900">{g.name}</h3>
            <p className="mt-0.5 text-sm text-navy-600">{fmtInt(g.count)} contacts</p>
            <div className="mt-4 flex items-center justify-between border-t border-[#f3ece3] pt-3 text-xs text-navy-500">
              <span>Updated {relTime(g.updated)}</span>
              <Link to="/app/contacts" className="font-medium text-brand-700">View contacts</Link>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Create contact group"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Plus} onClick={create}>Create group</Button></>}>
        <Field label="Group name" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. VIP Members" /></Field>
      </Modal>
    </>
  );
}

export function ImportContacts() {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [group, setGroup] = useState(GROUPS[0].name);
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHeader title="Import Contacts" subtitle="Bring contacts in from a CSV or Excel file." />
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody className="space-y-5">
              <Field label="Target group"><Select value={group} onChange={(e) => setGroup(e.target.value)}>{GROUPS.map((g) => <option key={g.id}>{g.name}</option>)}</Select></Field>
              <div>
                <label className="nb-label">Upload file</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#e0d8cf] bg-surface-muted/50 px-6 py-12 text-center hover:border-brand-400 hover:bg-brand-50/30">
                  <Upload size={28} className="text-navy-500" />
                  <p className="mt-3 text-sm font-medium text-navy-800">{file ? file.name : "Click to upload or drag & drop"}</p>
                  <p className="mt-1 text-xs text-navy-500">CSV, XLS or XLSX up to 10MB</p>
                  <input type="file" accept=".csv,.xls,.xlsx" className="hidden" onChange={(e) => { setFile(e.target.files[0]); setDone(false); }} />
                </label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setFile(null); setDone(false); }}>Clear</Button>
                <Button icon={CheckCircle2} disabled={!file} onClick={() => { setDone(true); toast.success("Import complete (demo). 2,140 contacts added"); }}>Import contacts</Button>
              </div>
              {done && <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700"><CheckCircle2 size={16} /> Imported 2,140 contacts into {group}. 12 duplicates skipped.</div>}
            </CardBody>
          </Card>
        </div>
        <div className="space-y-5">
          <Card>
            <CardHeader title="File format" />
            <CardBody className="space-y-3 text-sm text-navy-700">
              <p>Your file should include these columns:</p>
              <div className="overflow-hidden rounded-lg border border-[#efe7dd] font-mono text-xs">
                <div className="grid grid-cols-3 bg-surface-muted font-semibold text-navy-800"><span className="px-2 py-1.5">name</span><span className="px-2 py-1.5">phone</span><span className="px-2 py-1.5">email</span></div>
                <div className="grid grid-cols-3 border-t border-[#f3ece3]"><span className="px-2 py-1.5">Kwame M.</span><span className="px-2 py-1.5">+23320…</span><span className="px-2 py-1.5">k@mail.gh</span></div>
              </div>
              <Button variant="subtle" size="sm" icon={Download} onClick={() => toast.info("Sample template downloaded (demo)")}>Download sample</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export function ExportContacts() {
  const toast = useToast();
  const [group, setGroup] = useState("all");
  const [format, setFormat] = useState("csv");
  return (
    <>
      <PageHeader title="Export Contacts" subtitle="Download your contacts for backup or analysis." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Export options" />
          <CardBody className="space-y-4">
            <Field label="Group"><Select value={group} onChange={(e) => setGroup(e.target.value)}><option value="all">All contacts ({fmtInt(CONTACTS.length)})</option>{GROUPS.map((g) => <option key={g.id} value={g.slug}>{g.name} ({fmtInt(g.count)})</option>)}</Select></Field>
            <Field label="Format">
              <div className="grid grid-cols-2 gap-3">
                {[["csv", FileText, "CSV file"], ["xlsx", FileSpreadsheet, "Excel file"]].map(([v, Icon, l]) => (
                  <button key={v} onClick={() => setFormat(v)} className={`flex items-center gap-3 rounded-xl border p-4 text-left ${format === v ? "border-brand-400 bg-brand-50/50" : "border-[#efe7dd] hover:bg-surface-muted"}`}>
                    <Icon size={22} className={format === v ? "text-brand-600" : "text-navy-500"} />
                    <span className="text-sm font-medium text-navy-900">{l}</span>
                  </button>
                ))}
              </div>
            </Field>
            <Button className="w-full" icon={Download} onClick={() => toast.success(`Export started (demo). Your ${format.toUpperCase()} download will start shortly`)}>Export contacts</Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recent exports" />
          <div className="divide-y divide-[#f6f1ea]">
            {[["all-contacts.csv", "2 days ago", "18,420 rows"], ["vip-members.xlsx", "1 week ago", "1,240 rows"], ["accra-region.csv", "2 weeks ago", "9,630 rows"]].map(([f, t, r]) => (
              <div key={f} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3"><FileText size={18} className="text-navy-500" /><div><p className="text-sm font-medium text-navy-900">{f}</p><p className="text-xs text-navy-600">{r} &middot; {t}</p></div></div>
                <Button size="sm" variant="ghost" aria-label="Download again" icon={Download} onClick={() => toast.info("Re-downloading (demo)")} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
