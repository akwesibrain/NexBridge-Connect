import {
  LayoutDashboard, Send, Users2, BadgeCheck, BarChart3, Wallet, Code2, Settings,
  MessageSquare, Layers, CalendarClock, FileText, Upload, Download, Contact,
  IdCard, ShieldCheck, Activity, History, LineChart, CreditCard, Receipt, Tag,
  KeyRound, BookOpen, ScrollText, Webhook, User, Building2, Bell, Lock,
  ShieldAlert, Server, SlidersHorizontal, Gauge, UserCog, Megaphone, DollarSign,
} from "lucide-react";

// Customer app navigation — grouped modules for the collapsible sidebar.
export const CUSTOMER_NAV = [
  { group: "Overview", items: [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  ]},
  { group: "Messaging", items: [
    { to: "/app/messaging", label: "Overview", icon: MessageSquare },
    { to: "/app/quick-sms", label: "Quick SMS", icon: Send },
    { to: "/app/bulk-sms", label: "Bulk SMS", icon: Layers },
    { to: "/app/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/app/scheduled", label: "Scheduled", icon: CalendarClock },
    { to: "/app/templates", label: "Templates", icon: FileText },
  ]},
  { group: "Contacts", items: [
    { to: "/app/contacts", label: "All Contacts", icon: Contact },
    { to: "/app/groups", label: "Contact Groups", icon: Users2 },
    { to: "/app/import", label: "Import", icon: Upload },
    { to: "/app/export", label: "Export", icon: Download },
  ]},
  { group: "Sender IDs", items: [
    { to: "/app/senders", label: "Sender IDs", icon: IdCard },
  ]},
  { group: "Analytics", items: [
    { to: "/app/reports", label: "Delivery Reports", icon: BarChart3 },
    { to: "/app/history", label: "Message History", icon: History },
    { to: "/app/campaign-analytics", label: "Campaign Analytics", icon: LineChart },
  ]},
  { group: "Finance", items: [
    { to: "/app/wallet", label: "SMS Wallet", icon: Wallet },
    { to: "/app/buy-credits", label: "Buy Credits", icon: CreditCard },
    { to: "/app/transactions", label: "Transactions", icon: Receipt },
    { to: "/app/pricing", label: "Pricing", icon: Tag },
  ]},
  { group: "Developers", items: [
    { to: "/app/developers", label: "API Overview", icon: Code2 },
    { to: "/app/api-keys", label: "API Keys", icon: KeyRound },
    { to: "/app/api-docs", label: "Documentation", icon: BookOpen },
    { to: "/app/api-logs", label: "API Logs", icon: ScrollText },
    { to: "/app/webhooks", label: "Webhooks", icon: Webhook },
  ]},
  { group: "Account", items: [
    { to: "/app/profile", label: "Profile", icon: User },
    { to: "/app/organization", label: "Organization", icon: Building2 },
    { to: "/app/team", label: "Team Members", icon: Users2 },
    { to: "/app/notifications", label: "Notifications", icon: Bell },
    { to: "/app/security", label: "Security", icon: Lock },
  ]},
];

export const ADMIN_NAV = [
  { group: "Administration", items: [
    { to: "/admin", label: "Overview", icon: Gauge, end: true },
    { to: "/admin/customers", label: "Customers", icon: Users2 },
    { to: "/admin/pricing", label: "SMS Pricing", icon: DollarSign },
    { to: "/admin/credits", label: "Credit Management", icon: Wallet },
    { to: "/admin/senders", label: "Sender IDs", icon: BadgeCheck },
  ]},
  { group: "Monitoring", items: [
    { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
    { to: "/admin/transactions", label: "Transactions", icon: Receipt },
    { to: "/admin/api", label: "API Monitoring", icon: Activity },
  ]},
  { group: "System", items: [
    { to: "/admin/config", label: "Configuration", icon: SlidersHorizontal },
    { to: "/admin/users", label: "Admin Users", icon: UserCog },
    { to: "/admin/audit", label: "Audit Logs", icon: ShieldAlert },
  ]},
];

export const ICONS = { Server, ShieldCheck, Settings };
