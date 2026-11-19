import { useState } from "react";
import {
  User, Building2, Users2, Bell, Lock, Save, Plus, Trash2, ShieldCheck, Smartphone,
  Mail, KeyRound, CheckCircle2, LogOut, Monitor,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input, Select, Toggle } from "../../components/ui/Field";
import Modal from "../../components/ui/Modal";
import DataTable from "../../components/ui/DataTable";
import { useToast } from "../../components/ui/Toast.jsx";
import { relTime } from "../../lib/format";
import { ORG, TEAM } from "../../data/mock";

function SectionSave({ onSave }) {
  return <div className="flex justify-end border-t border-[#f3ece3] px-5 py-4"><Button icon={Save} onClick={onSave}>Save changes</Button></div>;
}

export function Profile() {
  const toast = useToast();
  const [form, setForm] = useState({ name: ORG.user.name, email: ORG.user.email, phone: "+233 20 123 4567", role: ORG.user.role });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <>
      <PageHeader title="Profile" subtitle="Manage your personal account details." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="h-fit p-6 text-center lg:col-span-1">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-navy-800 text-2xl font-bold text-white">{ORG.user.initials}</span>
          <h3 className="mt-4 text-base font-semibold text-navy-900">{form.name}</h3>
          <p className="text-sm text-navy-600">{form.role}</p>
          <Badge tone="green" className="mt-3">Verified</Badge>
          <Button variant="outline" className="mt-5 w-full" onClick={() => toast.info("Photo upload (demo)")}>Change photo</Button>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Personal information" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name"><Input value={form.name} onChange={set("name")} /></Field>
            <Field label="Role"><Input value={form.role} onChange={set("role")} disabled /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={set("email")} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={set("phone")} /></Field>
          </CardBody>
          <SectionSave onSave={() => toast.success("Profile updated")} />
        </Card>
      </div>
    </>
  );
}

export function Organization() {
  const toast = useToast();
  const [form, setForm] = useState({ name: ORG.name, industry: "Retail", country: "Ghana", address: "12 Independence Ave, Accra", tin: "C0012345678" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <>
      <PageHeader title="Organization Settings" subtitle="Your company profile and billing details." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Company details" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Field label="Organization name" className="sm:col-span-2"><Input value={form.name} onChange={set("name")} /></Field>
            <Field label="Industry"><Select value={form.industry} onChange={set("industry")}>{["Retail", "Finance", "Healthcare", "Education", "Government", "Technology"].map((i) => <option key={i}>{i}</option>)}</Select></Field>
            <Field label="Country"><Select value={form.country} onChange={set("country")}>{["Ghana", "Nigeria", "Kenya", "South Africa"].map((i) => <option key={i}>{i}</option>)}</Select></Field>
            <Field label="Business address" className="sm:col-span-2"><Input value={form.address} onChange={set("address")} /></Field>
            <Field label="Tax ID (TIN)"><Input value={form.tin} onChange={set("tin")} /></Field>
          </CardBody>
          <SectionSave onSave={() => toast.success("Organization updated")} />
        </Card>
        <Card className="h-fit">
          <CardHeader title="Plan" />
          <CardBody className="space-y-3">
            <div className="rounded-xl bg-brand-50 p-4"><p className="text-sm text-brand-700">Current plan</p><p className="text-xl font-bold text-navy-900">{ORG.plan}</p></div>
            <div className="flex justify-between text-sm"><span className="text-navy-600">Sender IDs</span><span className="font-medium text-navy-900">Unlimited</span></div>
            <div className="flex justify-between text-sm"><span className="text-navy-600">Team seats</span><span className="font-medium text-navy-900">10</span></div>
            <div className="flex justify-between text-sm"><span className="text-navy-600">API access</span><Badge tone="green">Enabled</Badge></div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export function Team() {
  const toast = useToast();
  const [team, setTeam] = useState(TEAM);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: "", role: "Campaign Manager" });
  const invite = () => {
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error("Enter a valid email");
    setTeam((t) => [...t, { id: `tm${Date.now()}`, name: form.email.split("@")[0], email: form.email, role: form.role, status: "invited", lastActive: null }]);
    toast.success("Invitation sent (demo)"); setOpen(false); setForm({ email: "", role: "Campaign Manager" });
  };
  const columns = [
    { key: "name", header: "Member", render: (r) => (
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}</span>
        <div><p className="font-medium capitalize text-navy-900">{r.name}</p><p className="text-xs text-navy-600">{r.email}</p></div>
      </div>
    )},
    { key: "role", header: "Role", render: (r) => <Badge tone="navy">{r.role}</Badge> },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status === "invited" ? "pending" : "active"}>{r.status}</Badge> },
    { key: "lastActive", header: "Last active", render: (r) => r.lastActive ? relTime(r.lastActive) : "Never" },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => <Button size="sm" variant="ghost" aria-label="Remove member" icon={Trash2} onClick={() => { setTeam((t) => t.filter((x) => x.id !== r.id)); toast.success("Member removed"); }} /> },
  ];
  return (
    <>
      <PageHeader title="Team Members" subtitle="Invite colleagues and manage their access."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Invite member</Button>} />
      <DataTable columns={columns} rows={team} searchable={false} emptyIcon={Users2} />
      <Modal open={open} onClose={() => setOpen(false)} title="Invite team member"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Mail} onClick={invite}>Send invite</Button></>}>
        <div className="space-y-4">
          <Field label="Email address" required><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="colleague@horizonretail.gh" /></Field>
          <Field label="Role"><Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{["Administrator", "Campaign Manager", "Analyst (read-only)", "Billing"].map((r) => <option key={r}>{r}</option>)}</Select></Field>
        </div>
      </Modal>
    </>
  );
}

export function Notifications() {
  const toast = useToast();
  const [prefs, setPrefs] = useState({
    campaignDone: true, lowCredits: true, senderApproved: true, weeklyReport: false,
    apiErrors: true, productUpdates: false, smsAlerts: true, emailAlerts: true,
  });
  const toggle = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));
  const rows = [
    ["campaignDone", "Campaign completed", "When a bulk campaign finishes sending"],
    ["lowCredits", "Low credit balance", "When your balance falls below 5,000 credits"],
    ["senderApproved", "Sender ID decisions", "Approvals and rejections of sender IDs"],
    ["apiErrors", "API error spikes", "When API error rate rises sharply"],
    ["weeklyReport", "Weekly summary", "A weekly delivery performance digest"],
    ["productUpdates", "Product updates", "News about new Nexbridge Connect features"],
  ];
  return (
    <>
      <PageHeader title="Notifications" subtitle="Choose what you're notified about and how." />
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Notification types" />
          <div className="divide-y divide-[#f6f1ea]">
            {rows.map(([k, t, d]) => (
              <div key={k} className="flex items-center justify-between px-5 py-4">
                <div><p className="text-sm font-medium text-navy-900">{t}</p><p className="text-xs text-navy-600">{d}</p></div>
                <Toggle checked={prefs[k]} onChange={() => toggle(k)} label={t} />
              </div>
            ))}
          </div>
          <SectionSave onSave={() => toast.success("Notification preferences saved")} />
        </Card>
        <Card className="h-fit">
          <CardHeader title="Channels" />
          <CardBody className="space-y-4">
            {[["emailAlerts", Mail, "Email"], ["smsAlerts", Smartphone, "SMS"]].map(([k, Icon, l]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-navy-900"><Icon size={16} className="text-navy-500" /> {l}</span>
                <Toggle checked={prefs[k]} onChange={() => toggle(k)} label={l} />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

export function Security() {
  const toast = useToast();
  const [twoFA, setTwoFA] = useState(true);
  const sessions = [
    { id: 1, device: "Chrome on Windows", loc: "Accra, Ghana", current: true, time: "Active now" },
    { id: 2, device: "Safari on iPhone", loc: "Accra, Ghana", current: false, time: "2 hours ago" },
    { id: 3, device: "Firefox on macOS", loc: "Kumasi, Ghana", current: false, time: "3 days ago" },
  ];
  return (
    <>
      <PageHeader title="Security Settings" subtitle="Protect your account and manage active sessions." />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Change password" />
          <CardBody className="space-y-4">
            <Field label="Current password"><Input type="password" /></Field>
            <Field label="New password" hint="At least 8 characters with a number and symbol."><Input type="password" /></Field>
            <Field label="Confirm new password"><Input type="password" /></Field>
            <Button icon={KeyRound} onClick={() => toast.success("Password updated (demo)")}>Update password</Button>
          </CardBody>
        </Card>
        <Card className="h-fit">
          <CardHeader title="Two-factor authentication" />
          <CardBody>
            <div className="flex items-center justify-between rounded-xl border border-[#efe7dd] p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck size={19} /></span>
                <div><p className="text-sm font-medium text-navy-900">Authenticator app</p><p className="text-xs text-navy-600">{twoFA ? "Enabled" : "Disabled"}</p></div>
              </div>
              <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); toast.info(v ? "2FA enabled (demo)" : "2FA disabled (demo)"); }} label="2FA" />
            </div>
          </CardBody>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader title="Active sessions" action={<Button size="sm" variant="outline" icon={LogOut} onClick={() => toast.success("Signed out other sessions (demo)")}>Sign out all others</Button>} />
          <div className="divide-y divide-[#f6f1ea]">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-sunken text-navy-600"><Monitor size={18} /></span>
                  <div><p className="text-sm font-medium text-navy-900">{s.device} {s.current && <Badge tone="green" className="ml-1">This device</Badge>}</p><p className="text-xs text-navy-600">{s.loc} &middot; {s.time}</p></div>
                </div>
                {!s.current && <Button size="sm" variant="ghost" onClick={() => toast.success("Session revoked (demo)")}>Revoke</Button>}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
