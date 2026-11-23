import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2, KeyRound, BookOpen, ScrollText, Webhook, Plus, Copy, Trash2, Activity,
  CheckCircle2, XCircle, Clock, Eye, EyeOff, Zap, Info, RefreshCw,
} from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Tabs from "../../components/ui/Tabs";
import Modal from "../../components/ui/Modal";
import Confirm from "../../components/ui/Confirm";
import DataTable from "../../components/ui/DataTable";
import { Field, Input, Select } from "../../components/ui/Field";
import { useToast } from "../../components/ui/Toast.jsx";
import { fmtInt, fmtDate, relTime } from "../../lib/format";
import { API_KEYS, API_LOGS, WEBHOOKS } from "../../data/mock";

const DEMO_NOTE = (
  <div className="mb-5 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
    <Info size={16} className="mt-0.5 shrink-0" />
    <span>All API endpoints, keys and logs shown here are <strong>illustrative</strong>. They are not connected to a live backend and no real requests are made.</span>
  </div>
);

export function Developers() {
  return (
    <>
      <PageHeader title="API Overview" subtitle="Everything you need to integrate Nexbridge Connect."
        actions={<Button as={Link} to="/app/api-docs" icon={BookOpen}>Read docs</Button>} />
      {DEMO_NOTE}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Requests (24h)" value="48,210" icon={Activity} tone="brand" trend={5.2} />
        <StatCard label="Successful" value="97.6%" icon={CheckCircle2} tone="green" trend={0.4} />
        <StatCard label="Failed" value="1,174" icon={XCircle} tone="red" trend={-1.1} />
        <StatCard label="Avg. latency" value="182 ms" icon={Zap} tone="amber" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader title="API status" subtitle="Demonstration only" action={<Badge tone="green">Operational</Badge>} />
            <div className="divide-y divide-[#f6f1ea]">
              {[["SMS API", "Operational"], ["Delivery webhooks", "Operational"], ["Dashboard API", "Operational"], ["Reporting", "Degraded"]].map(([n, s]) => (
                <div key={n} className="flex items-center justify-between px-5 py-3">
                  <span className="text-sm font-medium text-navy-900">{n}</span>
                  <Badge status={s === "Operational" ? "active" : "pending"}>{s}</Badge>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHeader title="Recent API activity" action={<Button as={Link} to="/app/api-logs" size="sm" variant="ghost">View logs</Button>} />
            <div className="divide-y divide-[#f6f1ea]">
              {API_LOGS.slice(0, 5).map((l) => (
                <div key={l.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                  <Badge tone={l.method === "GET" ? "navy" : "blue"}>{l.method}</Badge>
                  <span className="flex-1 font-mono text-xs text-navy-800">{l.endpoint}</span>
                  <Badge tone={l.status < 300 ? "green" : "red"}>{l.status}</Badge>
                  <span className="w-16 text-right text-xs text-navy-500">{l.ms}ms</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          {[
            { to: "/app/api-keys", icon: KeyRound, t: "API Keys", d: "Create and manage keys" },
            { to: "/app/api-docs", icon: BookOpen, t: "Documentation", d: "Endpoints & examples" },
            { to: "/app/api-logs", icon: ScrollText, t: "API Logs", d: "Inspect requests" },
            { to: "/app/webhooks", icon: Webhook, t: "Webhooks", d: "Delivery callbacks" },
          ].map((c) => (
            <Link key={c.to} to={c.to}><Card className="flex items-center gap-3 p-4 transition hover:border-brand-300 hover:shadow-pop">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><c.icon size={19} /></span>
              <div><p className="text-sm font-semibold text-navy-900">{c.t}</p><p className="text-xs text-navy-600">{c.d}</p></div>
            </Card></Link>
          ))}
        </div>
      </div>
    </>
  );
}

export function ApiKeys() {
  const toast = useToast();
  const [keys, setKeys] = useState(API_KEYS);
  const [open, setOpen] = useState(false);
  const [revoke, setRevoke] = useState(null);
  const [reveal, setReveal] = useState(false);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("Full access");
  const [created, setCreated] = useState(null);

  const create = () => {
    if (!name.trim()) return toast.error("Give the key a name");
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    const secret = `nxb_live_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
    setCreated(secret);
    setReveal(false);
    setKeys((k) => [{ id: `k${Date.now()}`, name: name.trim(), prefix: "nxb_live_", masked: `nxb_live_••••••••••••${secret.slice(-4)}`, status: "active", created: new Date().toISOString(), lastUsed: null, scope }, ...k]);
    toast.success("API key created");
  };
  const columns = [
    { key: "name", header: "Name", render: (r) => <div><p className="font-medium text-navy-900">{r.name}</p><p className="font-mono text-xs text-navy-600">{r.masked}</p></div> },
    { key: "scope", header: "Scope", render: (r) => <Badge tone="navy">{r.scope}</Badge> },
    { key: "created", header: "Created", render: (r) => fmtDate(r.created) },
    { key: "lastUsed", header: "Last used", render: (r) => r.lastUsed ? relTime(r.lastUsed) : "Never" },
    { key: "status", header: "Status", render: (r) => <Badge status={r.status} /> },
    { key: "id", header: "", sortable: false, align: "right", render: (r) => r.status === "active"
      ? <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setRevoke(r)}>Revoke</Button>
      : <span className="text-xs text-navy-500">Revoked</span> },
  ];
  return (
    <>
      <PageHeader title="API Keys" subtitle="Authenticate API requests with secret keys."
        actions={<Button icon={Plus} onClick={() => { setOpen(true); setName(""); setScope("Full access"); setCreated(null); setReveal(false); }}>Create key</Button>} />
      {DEMO_NOTE}
      <DataTable columns={columns} rows={keys} searchable={false} emptyIcon={KeyRound} />

      <Modal open={open} onClose={() => setOpen(false)} title={created ? "API key created" : "Create API key"}
        footer={created
          ? <Button onClick={() => setOpen(false)}>Done</Button>
          : <><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Plus} onClick={create}>Create key</Button></>}>
        {created ? (
          <div className="space-y-3">
            <p className="text-sm text-navy-700">Copy your secret key now. For security it won&apos;t be shown again.</p>
            <div className="flex items-center gap-2 rounded-lg border border-[#efe7dd] bg-surface-muted p-3">
              <code className="flex-1 break-all font-mono text-xs text-navy-900">{reveal ? created : created.replace(/.(?=.{4})/g, "•")}</code>
              <button aria-label="Toggle visibility" onClick={() => setReveal((r) => !r)} className="text-navy-500 hover:text-navy-700">{reveal ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              <button aria-label="Copy key" onClick={() => { navigator.clipboard?.writeText(created); toast.success("Copied"); }} className="text-navy-500 hover:text-navy-700"><Copy size={16} /></button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Field label="Key name" required><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Production server" /></Field>
            <Field label="Scope"><Select value={scope} onChange={(e) => setScope(e.target.value)}><option>Full access</option><option>Send + read</option><option>Send only</option><option>Read only</option></Select></Field>
          </div>
        )}
      </Modal>
      <Confirm open={!!revoke} onClose={() => setRevoke(null)} danger title="Revoke API key" confirmLabel="Revoke key"
        message={`Revoke "${revoke?.name}"? Any integration using this key will immediately stop working.`}
        onConfirm={() => { setKeys((k) => k.map((x) => x.id === revoke.id ? { ...x, status: "revoked" } : x)); toast.success("API key revoked"); }} />
    </>
  );
}

const SNIPPETS = {
  cURL: `curl https://api.nexbridge.tech/v1/sms/send \\
  -H "Authorization: Bearer nxb_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+233201234567",
    "from": "HORIZON",
    "message": "Your OTP is 48213"
  }'`,
  JavaScript: `const res = await fetch("https://api.nexbridge.tech/v1/sms/send", {
  method: "POST",
  headers: {
    Authorization: "Bearer nxb_live_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "+233201234567",
    from: "HORIZON",
    message: "Your OTP is 48213",
  }),
});
const data = await res.json();
console.log(data.message_id);`,
  PHP: `<?php
$ch = curl_init("https://api.nexbridge.tech/v1/sms/send");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer nxb_live_...",
    "Content-Type: application/json",
  ],
  CURLOPT_POSTFIELDS => json_encode([
    "to" => "+233201234567",
    "from" => "HORIZON",
    "message" => "Your OTP is 48213",
  ]),
]);
$response = curl_exec($ch);
echo $response;`,
  Python: `import requests

res = requests.post(
    "https://api.nexbridge.tech/v1/sms/send",
    headers={"Authorization": "Bearer nxb_live_..."},
    json={
        "to": "+233201234567",
        "from": "HORIZON",
        "message": "Your OTP is 48213",
    },
)
print(res.json()["message_id"])`,
};

const ERRORS = [
  ["200", "OK", "Request succeeded."],
  ["201", "Created", "Message accepted and queued."],
  ["400", "Bad Request", "Missing or invalid parameters."],
  ["401", "Unauthorized", "API key is missing or invalid."],
  ["402", "Payment Required", "Insufficient SMS credits."],
  ["422", "Unprocessable", "Sender ID not approved or invalid recipient."],
  ["429", "Too Many Requests", "Rate limit exceeded."],
  ["500", "Server Error", "Something went wrong on our side."],
];

export function ApiDocs() {
  const toast = useToast();
  const [lang, setLang] = useState("cURL");
  const [section, setSection] = useState("send");
  return (
    <>
      <PageHeader title="API Documentation" subtitle="Reference and examples for the Nexbridge Connect API." />
      {DEMO_NOTE}
      <div className="grid gap-5 lg:grid-cols-4">
        <Card className="h-fit lg:col-span-1">
          <nav className="p-3">
            {[["auth", "Authentication"], ["send", "Send SMS"], ["bulk", "Send Bulk SMS"], ["status", "Delivery Status"], ["balance", "Check Balance"], ["errors", "Error Codes"]].map(([id, label]) => (
              <button key={id} onClick={() => setSection(id)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm font-medium ${section === id ? "bg-brand-50 text-brand-700" : "text-navy-700 hover:bg-surface-muted"}`}>{label}</button>
            ))}
          </nav>
        </Card>

        <div className="space-y-5 lg:col-span-3">
          {section === "auth" && (
            <Card><CardHeader title="Authentication" /><CardBody className="space-y-3 text-sm text-navy-700">
              <p>Authenticate every request with your secret API key in the <code className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-xs">Authorization</code> header as a Bearer token.</p>
              <div className="rounded-lg bg-navy-950 p-4 font-mono text-xs text-navy-100">Authorization: Bearer nxb_live_...</div>
              <p>Keep keys secret and server-side. Manage them from the <Link to="/app/api-keys" className="font-medium text-brand-700">API Keys</Link> page.</p>
            </CardBody></Card>
          )}

          {(section === "send" || section === "bulk") && (
            <>
              <Card>
                <CardHeader title={section === "send" ? "Send a single SMS" : "Send bulk SMS"}
                  subtitle={section === "send" ? "POST /v1/sms/send" : "POST /v1/sms/bulk"} action={<Badge tone="blue">POST</Badge>} />
                <CardBody>
                  <p className="mb-3 text-sm text-navy-700">
                    {section === "send"
                      ? "Send a message to a single recipient."
                      : "Send the same message to many recipients or contact groups in one request."}
                  </p>
                  <table className="w-full text-left text-sm">
                    <thead><tr className="border-b border-[#f3ece3] text-xs uppercase text-navy-500"><th className="py-2">Field</th><th>Type</th><th>Description</th></tr></thead>
                    <tbody className="divide-y divide-[#f6f1ea]">
                      {(section === "send"
                        ? [["to", "string", "Recipient in E.164 format"], ["from", "string", "Approved sender ID"], ["message", "string", "Message body"], ["unicode", "boolean", "Optional. Force Unicode encoding"]]
                        : [["to", "array", "Array of recipient numbers"], ["groups", "array", "Optional contact group IDs"], ["from", "string", "Approved sender ID"], ["message", "string", "Supports {variables}"]]
                      ).map(([f, t, d]) => (
                        <tr key={f}><td className="py-2 font-mono text-xs text-brand-700">{f}</td><td className="text-xs text-navy-600">{t}</td><td className="text-navy-700">{d}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Example request" action={
                  <div className="flex gap-1">{Object.keys(SNIPPETS).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`rounded-md px-2.5 py-1 text-xs font-medium ${lang === l ? "bg-navy-800 text-white" : "text-navy-600 hover:bg-surface-sunken"}`}>{l}</button>
                  ))}</div>} />
                <div className="relative">
                  <button aria-label="Copy code" onClick={() => { navigator.clipboard?.writeText(SNIPPETS[lang]); toast.success("Copied"); }} className="absolute right-3 top-3 rounded-lg bg-white/10 p-1.5 text-navy-200 hover:bg-white/20"><Copy size={14} /></button>
                  <pre className="nb-scroll overflow-x-auto rounded-b-2xl bg-navy-950 p-5 font-mono text-[12.5px] leading-relaxed text-navy-100">{SNIPPETS[lang]}</pre>
                </div>
              </Card>
              <Card>
                <CardHeader title="Example response" action={<Badge tone="green">200 OK</Badge>} />
                <pre className="nb-scroll overflow-x-auto rounded-b-2xl bg-navy-950 p-5 font-mono text-[12.5px] leading-relaxed text-navy-100">{`{
  "status": "success",
  "message_id": "msg_a91f3c22",
  "to": "+233201234567",
  "segments": 1,
  "credits_used": 1,
  "status_url": "/v1/sms/status/msg_a91f3c22"
}`}</pre>
              </Card>
            </>
          )}

          {section === "status" && (
            <Card><CardHeader title="Check delivery status" subtitle="GET /v1/sms/status/{message_id}" action={<Badge tone="navy">GET</Badge>} />
              <pre className="nb-scroll overflow-x-auto rounded-b-2xl bg-navy-950 p-5 font-mono text-[12.5px] leading-relaxed text-navy-100">{`{
  "message_id": "msg_a91f3c22",
  "status": "delivered",
  "delivered_at": "2026-11-18T09:42:11Z"
}`}</pre>
            </Card>
          )}

          {section === "balance" && (
            <Card><CardHeader title="Check balance" subtitle="GET /v1/balance" action={<Badge tone="navy">GET</Badge>} />
              <pre className="nb-scroll overflow-x-auto rounded-b-2xl bg-navy-950 p-5 font-mono text-[12.5px] leading-relaxed text-navy-100">{`{
  "credits": 48250,
  "plan": "Business"
}`}</pre>
            </Card>
          )}

          {section === "errors" && (
            <Card><CardHeader title="Error codes" subtitle="Standard HTTP status codes" />
              <div className="divide-y divide-[#f6f1ea]">
                {ERRORS.map(([code, name, desc]) => (
                  <div key={code} className="flex items-center gap-4 px-5 py-3">
                    <Badge tone={+code < 300 ? "green" : +code < 500 ? "amber" : "red"} className="font-mono">{code}</Badge>
                    <span className="w-36 text-sm font-medium text-navy-900">{name}</span>
                    <span className="flex-1 text-sm text-navy-600">{desc}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export function ApiLogs() {
  const columns = [
    { key: "method", header: "Method", render: (r) => <Badge tone={r.method === "GET" ? "navy" : "blue"}>{r.method}</Badge> },
    { key: "endpoint", header: "Endpoint", render: (r) => <span className="font-mono text-xs text-navy-800">{r.endpoint}</span> },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status < 300 ? "green" : r.status < 500 ? "amber" : "red"} className="font-mono">{r.status}</Badge> },
    { key: "ms", header: "Latency", align: "right", render: (r) => `${r.ms} ms` },
    { key: "ip", header: "IP", render: (r) => <span className="font-mono text-xs text-navy-600">{r.ip}</span> },
    { key: "time", header: "Time", render: (r) => relTime(r.time) },
  ];
  return (
    <>
      <PageHeader title="API Logs" subtitle="Inspect recent API requests to your account." />
      {DEMO_NOTE}
      <div className="mb-5 grid gap-4 sm:grid-cols-3">
        <StatCard label="Requests (logged)" value={API_LOGS.length} icon={ScrollText} tone="brand" />
        <StatCard label="Success rate" value={`${Math.round((API_LOGS.filter((l) => l.status < 300).length / API_LOGS.length) * 100)}%`} icon={CheckCircle2} tone="green" />
        <StatCard label="Errors" value={API_LOGS.filter((l) => l.status >= 400).length} icon={XCircle} tone="red" />
      </div>
      <DataTable columns={columns} rows={API_LOGS} pageSize={12} searchKeys={["endpoint", "method", "ip"]} emptyIcon={ScrollText} />
    </>
  );
}

export function Webhooks() {
  const toast = useToast();
  const [hooks, setHooks] = useState(WEBHOOKS);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ event: "message.delivered", url: "" });
  const add = () => {
    let ok = false;
    try { const u = new URL(form.url.trim()); ok = u.protocol === "https:" && !!u.hostname; } catch { /* invalid */ }
    if (!ok) return toast.error("Enter a valid HTTPS URL");
    if (hooks.some((h) => h.event === form.event && h.url === form.url.trim())) return toast.error("That webhook already exists");
    setHooks((h) => [{ id: `w${Date.now()}`, status: "active", lastDelivery: null, event: form.event, url: form.url.trim() }, ...h]);
    toast.success("Webhook added"); setOpen(false); setForm({ event: "message.delivered", url: "" });
  };
  return (
    <>
      <PageHeader title="Webhook Configuration" subtitle="Receive real-time event callbacks at your endpoints."
        actions={<Button icon={Plus} onClick={() => setOpen(true)}>Add webhook</Button>} />
      {DEMO_NOTE}
      <div className="space-y-3">
        {hooks.map((h) => (
          <Card key={h.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600"><Webhook size={19} /></span>
              <div>
                <div className="flex items-center gap-2"><Badge tone="navy" className="font-mono">{h.event}</Badge><Badge status={h.status === "active" ? "active" : "pending"}>{h.status}</Badge></div>
                <p className="mt-1 font-mono text-xs text-navy-600">{h.url}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-navy-500">{h.lastDelivery ? `Last: ${relTime(h.lastDelivery)}` : "No deliveries yet"}</span>
              <Button size="sm" variant="ghost" icon={RefreshCw} onClick={() => toast.info("Test event sent (demo)")}>Test</Button>
              <Button size="sm" variant="ghost" aria-label="Remove webhook" icon={Trash2} onClick={() => { setHooks((x) => x.filter((y) => y.id !== h.id)); toast.success("Webhook removed"); }} />
            </div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Add webhook"
        footer={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button icon={Plus} onClick={add}>Add webhook</Button></>}>
        <div className="space-y-4">
          <Field label="Event"><Select value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })}>{["message.delivered", "message.failed", "message.sent", "campaign.completed", "credits.low"].map((e) => <option key={e}>{e}</option>)}</Select></Field>
          <Field label="Endpoint URL" required hint="Must be a public HTTPS endpoint."><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://api.yoursite.gh/hooks/sms" /></Field>
        </div>
      </Modal>
    </>
  );
}
