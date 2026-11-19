// ─────────────────────────────────────────────────────────────
// Nexbridge Connect — mock data layer (frontend demo only).
// No network, no backend. All values are illustrative.
// ─────────────────────────────────────────────────────────────
const PALETTE = { brand: "#ef6a43", blue: "#f59e78", navy: "#6b4a37", green: "#2f8f5b", amber: "#c98a2a", red: "#c23b2e", slate: "#a99e97" };
export const COLORS = PALETTE;

let seed = 20260118;
const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
const pick = (a) => a[Math.floor(rnd() * a.length)];
const int = (min, max) => Math.floor(rnd() * (max - min + 1)) + min;
const daysAgo = (d) => new Date(Date.now() - d * 86400000).toISOString();
const minsAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

const FIRST = ["Kwame", "Ama", "Yaw", "Akua", "Kofi", "Abena", "Kojo", "Esi", "Fiifi", "Adwoa", "Nana", "Efua", "Kwabena", "Afia", "Kweku", "Adjoa"];
const LAST = ["Mensah", "Owusu", "Boateng", "Asante", "Appiah", "Darko", "Agyeman", "Osei", "Ofori", "Annan", "Addo", "Baffour", "Sarpong", "Nkrumah"];
const name = () => `${pick(FIRST)} ${pick(LAST)}`;
const phone = () => `+2332${int(40000000, 59999999)}`;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export const ORG = {
  name: "Horizon Retail Group",
  plan: "Business",
  credits: 48250,
  user: { name: "Kwame Mensah", email: "kwame.mensah@horizonretail.gh", role: "Account Owner", initials: "KM" },
};

export const SENDER_IDS = [
  { id: "s1", name: "HORIZON", status: "approved", purpose: "Transactional alerts & receipts", created: daysAgo(120), messages: 184200 },
  { id: "s2", name: "HRZ-PROMO", status: "approved", purpose: "Marketing campaigns", created: daysAgo(86), messages: 96400 },
  { id: "s3", name: "HRZ-OTP", status: "approved", purpose: "One-time passwords", created: daysAgo(60), messages: 221050 },
  { id: "s4", name: "HORIZONPAY", status: "pending", purpose: "Payment confirmations", created: daysAgo(4), messages: 0 },
  { id: "s5", name: "WINBIG", status: "rejected", purpose: "Prize giveaway", created: daysAgo(9), messages: 0, reason: "Sender ID implies gambling/lottery content, which is not permitted under network policy." },
];

const MSG_BODIES = [
  "Your OTP is 48213. Valid for 5 minutes. Do not share this code.",
  "Hi {name}, your order #HR-{n} has shipped and arrives in 2-3 days.",
  "Thank you for shopping with Horizon! You earned {n} loyalty points.",
  "Reminder: your appointment is on Friday at 10:00 AM.",
  "FLASH SALE: 30% off all items this weekend. Shop now at horizon.gh",
  "Your payment of GHS {n}.00 was received. Receipt: HR-{n}.",
  "Your account balance is low. Top up to continue sending messages.",
];
const body = () => pick(MSG_BODIES).replace("{name}", pick(FIRST)).replace(/\{n\}/g, () => int(100, 9999));

export const MESSAGES = Array.from({ length: 46 }, (_, i) => {
  const st = pick(["delivered", "delivered", "delivered", "delivered", "pending", "failed"]);
  return {
    id: `m${i + 1}`, recipient: phone(), sender: pick(["HORIZON", "HRZ-OTP", "HRZ-PROMO"]),
    content: body(), status: st, segments: int(1, 3), cost: int(1, 3),
    date: minsAgo(int(2, 60 * 24 * 9)),
  };
});

export const CAMPAIGNS = Array.from({ length: 22 }, (_, i) => {
  const recips = int(500, 42000);
  const status = pick(["completed", "completed", "completed", "scheduled", "draft", "processing", "cancelled"]);
  const deliveredPct = status === "completed" ? int(92, 99) : status === "processing" ? int(40, 70) : 0;
  const delivered = Math.round((recips * deliveredPct) / 100);
  const failed = status === "completed" || status === "processing" ? Math.round((recips * int(1, 6)) / 100) : 0;
  const nm = pick(["November Promo", "OTP Service", "Payday Sale", "Loyalty Rewards", "Back to School", "Weekend Flash", "Service Notice", "Eid Greetings", "Customer Survey", "Restock Alert"]);
  return {
    id: `c${i + 1}`, name: `${nm} 2026`, sender: pick(["HRZ-PROMO", "HORIZON", "HRZ-OTP"]),
    recipients: recips, delivered, failed, pending: Math.max(0, recips - delivered - failed),
    deliveredPct, status, created: daysAgo(int(1, 90)),
    scheduledAt: status === "scheduled" ? daysAgo(-int(1, 14)) : null,
  };
});

export const SCHEDULED = CAMPAIGNS.filter((c) => c.status === "scheduled").concat(
  Array.from({ length: 4 }, (_, i) => ({
    id: `sc${i}`, name: `${pick(["Morning Blast", "Invoice Reminder", "Event Invite", "Promo Teaser"])} 2026`,
    sender: pick(["HORIZON", "HRZ-PROMO"]), recipients: int(800, 15000), status: "scheduled",
    scheduledAt: daysAgo(-int(1, 20)), created: daysAgo(int(1, 10)), delivered: 0, failed: 0, pending: 0, deliveredPct: 0,
  })));

export const TEMPLATES = [
  { id: "t1", name: "OTP Verification", category: "Transactional", body: "Your {brand} verification code is {code}. Valid for 5 minutes.", updated: daysAgo(12) },
  { id: "t2", name: "Order Shipped", category: "Transactional", body: "Your order {order} is on the way, {name}. Track it here: {link}", updated: daysAgo(30) },
  { id: "t3", name: "Payment Receipt", category: "Transactional", body: "Payment of GHS {amount} received. Ref: {ref}. Thank you!", updated: daysAgo(8) },
  { id: "t4", name: "Weekend Promo", category: "Marketing", body: "{name}, enjoy {discount}% off this weekend only. Shop {link}", updated: daysAgo(3) },
  { id: "t5", name: "Appointment Reminder", category: "Notification", body: "Reminder: your appointment is on {date} at {time}.", updated: daysAgo(21) },
  { id: "t6", name: "Loyalty Points", category: "Marketing", body: "You earned {points} points! Balance: {balance}. Redeem at {link}", updated: daysAgo(45) },
];

export const GROUPS = [
  { id: "g1", name: "All Customers", slug: "all-customers", count: 18420, updated: daysAgo(2) },
  { id: "g2", name: "VIP Members", slug: "vip-members", count: 1240, updated: daysAgo(5) },
  { id: "g3", name: "Accra Region", slug: "accra-region", count: 9630, updated: daysAgo(1) },
  { id: "g4", name: "Loyalty Tier Gold", slug: "loyalty-gold", count: 820, updated: daysAgo(9) },
  { id: "g5", name: "Newsletter Opt-in", slug: "newsletter", count: 6115, updated: daysAgo(14) },
  { id: "g6", name: "Lapsed (90d+)", slug: "lapsed", count: 3210, updated: daysAgo(20) },
];

export const CONTACTS = Array.from({ length: 54 }, (_, i) => ({
  id: `ct${i + 1}`, name: name(), phone: phone(),
  email: rnd() > 0.4 ? `${slug(FIRST[int(0, FIRST.length - 1)])}${int(1, 99)}@mail.gh` : "",
  group: pick(GROUPS).name, tags: pick([["VIP"], ["New"], ["Gold", "VIP"], [], ["Newsletter"]]),
  added: daysAgo(int(1, 200)), birthday: `${String(int(1, 28)).padStart(2, "0")}/${String(int(1, 12)).padStart(2, "0")}`,
}));

export const TRANSACTIONS = Array.from({ length: 20 }, (_, i) => {
  const pkg = pick(["Bronze", "Silver", "Gold", "Platinum"]);
  const amt = { Bronze: 150, Silver: 650, Gold: 2400, Platinum: 4200 }[pkg];
  const units = { Bronze: 6000, Silver: 28000, Gold: 110000, Platinum: 200000 }[pkg];
  return {
    id: `TXN-${90341 - i}`, package: pkg, amount: amt, units,
    method: pick(["MTN MoMo", "Telecel Cash", "AirtelTigo Money", "Visa ending 4821"]),
    status: pick(["paid", "paid", "paid", "paid", "pending", "failed"]), date: daysAgo(int(1, 150)),
  };
});

export const API_KEYS = [
  { id: "k1", name: "Production", prefix: "nxb_live_", masked: "nxb_live_••••••••••••a91f", status: "active", created: daysAgo(140), lastUsed: minsAgo(8), scope: "Full access" },
  { id: "k2", name: "Staging", prefix: "nxb_test_", masked: "nxb_test_••••••••••••7c2d", status: "active", created: daysAgo(72), lastUsed: minsAgo(220), scope: "Send + read" },
  { id: "k3", name: "Legacy integration", prefix: "nxb_live_", masked: "nxb_live_••••••••••••0b45", status: "revoked", created: daysAgo(300), lastUsed: daysAgo(40), scope: "Send only" },
];

export const API_LOGS = Array.from({ length: 28 }, (_, i) => {
  const ok = rnd() > 0.18;
  return {
    id: `log${i}`, method: pick(["POST", "POST", "POST", "GET"]),
    endpoint: pick(["/v1/sms/send", "/v1/sms/send", "/v1/sms/status", "/v1/balance", "/v1/sms/bulk"]),
    status: ok ? pick([200, 200, 201]) : pick([400, 401, 422, 429, 500]),
    ms: int(40, 680), ip: `41.21${int(0, 9)}.${int(1, 254)}.${int(1, 254)}`, time: minsAgo(int(1, 60 * 20)),
  };
});

export const WEBHOOKS = [
  { id: "w1", event: "message.delivered", url: "https://api.horizonretail.gh/hooks/sms", status: "active", lastDelivery: minsAgo(3) },
  { id: "w2", event: "message.failed", url: "https://api.horizonretail.gh/hooks/sms", status: "active", lastDelivery: minsAgo(44) },
  { id: "w3", event: "campaign.completed", url: "https://ops.horizonretail.gh/notify", status: "paused", lastDelivery: daysAgo(2) },
];

export const COUNTRIES = [
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "CI", dial: "+225", name: "Cote d'Ivoire" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "US", dial: "+1", name: "United States" },
];

export const PACKAGES = [
  { name: "Bronze", units: 6000, price: 150, perSms: 0.025, features: ["Up to 6,000 SMS", "Standard delivery speed", "Email support", "Basic delivery reports"] },
  { name: "Silver", units: 28000, price: 650, perSms: 0.0232, popular: true, features: ["Up to 28,000 SMS", "Priority delivery", "Email + chat support", "Advanced analytics", "3 sender IDs"] },
  { name: "Gold", units: 110000, price: 2400, perSms: 0.0218, features: ["Up to 110,000 SMS", "High-priority routes", "Dedicated support", "Full API access", "Unlimited sender IDs"] },
  { name: "Platinum", units: 200000, price: 4200, perSms: 0.021, features: ["200,000 SMS", "Premium routes & failover", "Account manager", "99.9% uptime SLA", "Custom integrations"] },
];

// ── Chart series ───────────────────────────────────────────────
const MONTHS = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
export const VOLUME_MONTHLY = MONTHS.map((m, i) => ({ label: m, sent: 120000 + i * 18000 + int(-9000, 15000), delivered: 0 }))
  .map((r) => ({ ...r, delivered: Math.round(r.sent * (0.93 + rnd() * 0.05)) }));
export const VOLUME_DAILY = Array.from({ length: 14 }, (_, i) => {
  const sent = int(4200, 11800);
  return { label: `${i + 5}/11`, sent, delivered: Math.round(sent * (0.9 + rnd() * 0.08)), failed: Math.round(sent * (rnd() * 0.05)) };
});
export const DELIVERY_SPLIT = [
  { name: "Delivered", value: 94.2, color: COLORS.green },
  { name: "Pending", value: 3.1, color: COLORS.amber },
  { name: "Failed", value: 2.7, color: COLORS.red },
];
export const ACTIVITY = [
  { id: "a1", text: "Campaign 'November Promo 2026' completed, 41,980 delivered", time: minsAgo(22), type: "campaign" },
  { id: "a2", text: "Sender ID 'HORIZONPAY' submitted for approval", time: minsAgo(95), type: "sender" },
  { id: "a3", text: "48,000 SMS credits purchased (Silver package)", time: minsAgo(220), type: "wallet" },
  { id: "a4", text: "2,140 contacts imported into 'Accra Region'", time: minsAgo(360), type: "contacts" },
  { id: "a5", text: "API key 'Staging' created by Ama Owusu", time: minsAgo(700), type: "api" },
];

// ── Admin data ─────────────────────────────────────────────────
export const ADMIN_CUSTOMERS = Array.from({ length: 30 }, (_, i) => {
  const org = pick(["Horizon Retail", "Accra General Hospital", "UniBank Ghana", "Kumasi Tech Ltd", "BrightSchools", "GoMart", "PayFlow", "MediCare Plus", "Volta Microfinance", "CityFoods"]);
  return {
    id: `cus${i + 1}`, org: `${org} ${i + 1}`, contact: name(), email: `admin${i + 1}@mail.gh`,
    plan: pick(["Bronze", "Silver", "Gold", "Platinum", "Business"]), credits: int(0, 220000),
    sent30: int(1000, 480000), status: pick(["active", "active", "active", "suspended", "pending"]),
    joined: daysAgo(int(10, 900)),
  };
});
export const ADMIN_STATS = { customers: 1284, active: 1096, messages30: 18420500, revenue30: 486200, senderPending: 23, failRate: 2.4 };
export const ADMIN_REVENUE = MONTHS.map((m, i) => ({ label: m, revenue: 320000 + i * 28000 + int(-15000, 25000) }));
export const AUDIT_LOGS = Array.from({ length: 24 }, (_, i) => ({
  id: `al${i}`, actor: pick(["admin@nexbridge.tech", "ama.owusu@nexbridge.tech", "system", "kofi.darko@nexbridge.tech"]),
  action: pick(["Approved sender ID", "Adjusted pricing", "Credited account", "Suspended customer", "Updated system config", "Revoked API key", "Refunded transaction"]),
  target: pick(["HORIZONPAY", "Silver package", "cus-204", "cus-88", "SMS route GH-1", "nxb_live_…a91f", "TXN-90218"]),
  ip: `41.21${int(0, 9)}.${int(1, 254)}.${int(1, 254)}`, time: minsAgo(int(5, 60 * 48)),
}));
export const ADMIN_USERS = [
  { id: "u1", name: "System Administrator", email: "admin@nexbridge.tech", role: "Super Admin", status: "active", lastActive: minsAgo(4) },
  { id: "u2", name: "Ama Owusu", email: "ama.owusu@nexbridge.tech", role: "Support Lead", status: "active", lastActive: minsAgo(60) },
  { id: "u3", name: "Kofi Darko", email: "kofi.darko@nexbridge.tech", role: "Billing Admin", status: "active", lastActive: daysAgo(1) },
  { id: "u4", name: "Esi Annan", email: "esi.annan@nexbridge.tech", role: "Compliance", status: "suspended", lastActive: daysAgo(12) },
];
export const TEAM = [
  { id: "tm1", name: "Kwame Mensah", email: "kwame.mensah@horizonretail.gh", role: "Account Owner", status: "active", lastActive: minsAgo(2) },
  { id: "tm2", name: "Ama Owusu", email: "ama.owusu@horizonretail.gh", role: "Administrator", status: "active", lastActive: minsAgo(50) },
  { id: "tm3", name: "Yaw Boateng", email: "yaw.boateng@horizonretail.gh", role: "Campaign Manager", status: "active", lastActive: daysAgo(1) },
  { id: "tm4", name: "Akua Asante", email: "akua.asante@horizonretail.gh", role: "Analyst (read-only)", status: "invited", lastActive: null },
];
