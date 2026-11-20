import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, X, MessageSquare } from "lucide-react";
import { cn } from "../lib/cn";

// Rule-based mock assistant. No backend: it matches keywords and replies with
// canned, genuinely useful guidance that can deep-link into the app.
const CUSTOMER = {
  greeting: "Hi! I'm the Nexbridge assistant. I can help you send messages, check delivery, manage contacts, buy credits and more. What do you need?",
  suggestions: ["How do I send an SMS?", "Check delivery rate", "Buy more credits", "Register a sender ID"],
  intents: [
    { k: ["bulk", "campaign", "many", "mass"], t: "For a campaign to many people, use Bulk SMS: pick contact groups, write your message with {variables}, preview the cost, then send or schedule it.", a: { label: "Open Bulk SMS", to: "/app/bulk-sms" } },
    { k: ["send", "sms", "message", "compose", "text"], t: "To send a quick message, open Quick SMS, choose a sender ID, add recipients and type your message. You'll see the segment count and credit cost before you send.", a: { label: "Open Quick SMS", to: "/app/quick-sms" } },
    { k: ["deliver", "report", "status", "arrived", "failed", "rate"], t: "Delivery Reports show delivered, failed and in-transit rates by sender ID and campaign. You can export them or have them emailed.", a: { label: "Open Delivery Reports", to: "/app/reports" } },
    { k: ["credit", "buy", "top up", "topup", "wallet", "balance", "recharge"], t: "Your credit balance lives in the SMS Wallet. To add more, open Buy Credits and pick a package that matches your volume.", a: { label: "Buy credits", to: "/app/buy-credits" } },
    { k: ["sender", "sender id", "brand name", "from name"], t: "Sender IDs are the branded names your messages come from. Register one from the Sender IDs page; approval usually takes 1 to 3 business days.", a: { label: "Open Sender IDs", to: "/app/senders" } },
    { k: ["contact", "import", "group", "csv", "excel", "audience"], t: "Manage people in Contacts. You can import from CSV or Excel and sort them into groups so you can target the right audience.", a: { label: "Open Contacts", to: "/app/contacts" } },
    { k: ["api", "develop", "key", "webhook", "integrat", "rest"], t: "Developers can send through our REST API. Create an API key, read the docs and set up delivery webhooks in the Developer Center.", a: { label: "Developer Center", to: "/app/developers" } },
    { k: ["price", "pricing", "cost", "how much", "rate per"], t: "Credits are prepaid. You can see the packages and the per-SMS rate on the Pricing page.", a: { label: "See pricing", to: "/app/pricing" } },
    { k: ["schedule", "later", "queue", "timing"], t: "You can schedule a campaign for a later time inside Bulk SMS, and manage queued ones under Scheduled.", a: { label: "Open Scheduled", to: "/app/scheduled" } },
    { k: ["template"], t: "Save reusable message content as Templates, with {variables} for personalization, then drop them into Quick or Bulk SMS.", a: { label: "Open Templates", to: "/app/templates" } },
  ],
  fallback: "I can help with sending SMS, campaigns, delivery reports, contacts, sender IDs, credits and the API. Try asking about one of those.",
};

const ADMIN = {
  greeting: "Hi! I'm the admin assistant. I can help with approvals, customers, pricing, transactions and platform health. What do you need?",
  suggestions: ["Pending sender approvals", "Find a customer", "View revenue", "Check platform status"],
  intents: [
    { k: ["approv", "pending", "sender", "reject", "review"], t: "Pending sender ID requests are under Sender IDs. Review each one and approve or reject it; the overview also shows how many are waiting.", a: { label: "Review sender IDs", to: "/admin/senders" } },
    { k: ["customer", "account", "suspend", "org", "find"], t: "Find and manage accounts in Customers. You can adjust credits, suspend an account, or open a customer to see their usage.", a: { label: "Open Customers", to: "/admin/customers" } },
    { k: ["revenue", "transaction", "payment", "paid", "refund", "money"], t: "Payments and revenue are under Transactions. The overview shows 30-day revenue and the monthly trend.", a: { label: "Open Transactions", to: "/admin/transactions" } },
    { k: ["price", "pricing", "package", "rate", "credit management", "credit"], t: "Edit credit packages and per-SMS rates in SMS Pricing. Adjust customer balances in Credit Management.", a: { label: "Open SMS Pricing", to: "/admin/pricing" } },
    { k: ["audit", "log", "who did", "history"], t: "Every administrative action is recorded in Audit Logs, with the actor, target and time.", a: { label: "Open Audit Logs", to: "/admin/audit" } },
    { k: ["status", "health", "uptime", "down", "operational", "overview"], t: "Platform health, what needs attention and the KPIs are on the Operations overview.", a: { label: "Open Overview", to: "/admin" } },
    { k: ["api", "monitor", "traffic", "error"], t: "API traffic, success rate and recent requests are under API Monitoring.", a: { label: "Open API Monitoring", to: "/admin/api" } },
  ],
  fallback: "I can help with sender approvals, customers, pricing, credits, transactions, the audit log and platform health. Ask about any of those.",
};

function reply(text, cfg) {
  const q = text.toLowerCase();
  if (/^\s*(hi|hello|hey|good (morning|afternoon|evening)|yo)\b/.test(q)) return { t: cfg.greeting };
  if (/(thank|thanks|cheers|great|nice)/.test(q)) return { t: "Happy to help! Ask me anything else." };
  for (const i of cfg.intents) if (i.k.some((w) => q.includes(w))) return { t: i.t, a: i.a };
  return { t: cfg.fallback };
}

export default function AssistantWidget({ variant = "customer" }) {
  const cfg = variant === "admin" ? ADMIN : CUSTOMER;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState([{ role: "bot", t: cfg.greeting }]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, typing, open]);
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const h = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open]);

  const ask = (text) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { role: "user", t: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", ...reply(q, cfg) }]);
    }, 650);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open assistant"}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-pop transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2">
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {/* Panel */}
      {open && (
        <div role="dialog" aria-label="Nexbridge assistant"
          className="fixed bottom-24 right-5 z-40 flex h-[480px] max-h-[calc(100vh-7rem)] w-[360px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-[#efe7dd] bg-white shadow-pop">
          {/* header */}
          <div className="flex items-center gap-3 border-b border-[#efe7dd] bg-surface-muted px-4 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white"><Bot size={18} /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-navy-900">Nexbridge Assistant</p>
              <p className="text-[11px] text-navy-500">Demo assistant · answers are simulated</p>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-lg p-1.5 text-navy-500 hover:bg-surface-sunken hover:text-navy-700"><X size={16} /></button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="nb-scroll flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {msgs.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed",
                  m.role === "user" ? "rounded-br-sm bg-brand-600 text-white" : "rounded-bl-sm bg-surface-muted text-navy-800")}>
                  <p>{m.t}</p>
                  {m.a && (
                    <button onClick={() => { navigate(m.a.to); setOpen(false); }}
                      className="mt-2 inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-[#f1dacb] hover:bg-brand-50">
                      {m.a.label} →
                    </button>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-surface-muted px-3.5 py-3">
                  {[0, 150, 300].map((d) => <span key={d} className="nb-ping h-1.5 w-1.5 rounded-full bg-navy-300" style={{ animationDelay: `${d}ms`, animationDuration: "1s" }} />)}
                </div>
              </div>
            )}
            {msgs.length <= 1 && !typing && (
              <div className="flex flex-wrap gap-2 pt-1">
                {cfg.suggestions.map((s) => (
                  <button key={s} onClick={() => ask(s)} className="rounded-full border border-[#e7ddd1] bg-white px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-brand-300 hover:bg-brand-50">{s}</button>
                ))}
              </div>
            )}
          </div>

          {/* input */}
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2 border-t border-[#efe7dd] p-3">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} aria-label="Message the assistant"
              placeholder="Ask about sending, credits, reports…" className="nb-input" />
            <button type="submit" aria-label="Send" disabled={!input.trim() || typing}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-brand-600 text-white transition hover:bg-brand-700 disabled:opacity-50">
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
