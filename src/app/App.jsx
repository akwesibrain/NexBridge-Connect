import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";

import { Landing, PublicPricing, NotFound } from "../pages/public/Public";
import { Login, Register } from "../pages/auth/Auth";
import Dashboard from "../pages/app/Dashboard";
import { MessagingOverview, QuickSms, BulkSms, Campaigns, Scheduled, Templates } from "../pages/app/Messaging";
import { Contacts, Groups, ImportContacts, ExportContacts } from "../pages/app/Contacts";
import { Senders, SenderRegister } from "../pages/app/Senders";
import { Reports, MessageHistory, CampaignAnalytics } from "../pages/app/Analytics";
import { Wallet, BuyCredits, Transactions, Pricing } from "../pages/app/Finance";
import { Developers, ApiKeys, ApiDocs, ApiLogs, Webhooks } from "../pages/app/Developers";
import { Profile, Organization, Team, Notifications, Security } from "../pages/app/Account";
import {
  AdminOverview, AdminCustomers, AdminCustomerDetails, AdminPricing, AdminCredits,
  AdminSenders, AdminCampaigns, AdminTransactions, AdminApi, AdminConfig, AdminUsers, AdminAudit,
} from "../pages/admin/Admin";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<PublicPricing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Customer app */}
      <Route path="/app" element={<CustomerLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="messaging" element={<MessagingOverview />} />
        <Route path="quick-sms" element={<QuickSms />} />
        <Route path="bulk-sms" element={<BulkSms />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="scheduled" element={<Scheduled />} />
        <Route path="templates" element={<Templates />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="groups" element={<Groups />} />
        <Route path="import" element={<ImportContacts />} />
        <Route path="export" element={<ExportContacts />} />
        <Route path="senders" element={<Senders />} />
        <Route path="senders/register" element={<SenderRegister />} />
        <Route path="reports" element={<Reports />} />
        <Route path="history" element={<MessageHistory />} />
        <Route path="campaign-analytics" element={<CampaignAnalytics />} />
        <Route path="wallet" element={<Wallet />} />
        <Route path="buy-credits" element={<BuyCredits />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="developers" element={<Developers />} />
        <Route path="api-keys" element={<ApiKeys />} />
        <Route path="api-docs" element={<ApiDocs />} />
        <Route path="api-logs" element={<ApiLogs />} />
        <Route path="webhooks" element={<Webhooks />} />
        <Route path="profile" element={<Profile />} />
        <Route path="organization" element={<Organization />} />
        <Route path="team" element={<Team />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="security" element={<Security />} />
      </Route>

      {/* Admin console */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="customers/:id" element={<AdminCustomerDetails />} />
        <Route path="pricing" element={<AdminPricing />} />
        <Route path="credits" element={<AdminCredits />} />
        <Route path="senders" element={<AdminSenders />} />
        <Route path="campaigns" element={<AdminCampaigns />} />
        <Route path="transactions" element={<AdminTransactions />} />
        <Route path="api" element={<AdminApi />} />
        <Route path="config" element={<AdminConfig />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="audit" element={<AdminAudit />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
