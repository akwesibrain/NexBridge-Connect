import { Navigate, Outlet } from "react-router-dom";
import DashboardShell from "./DashboardShell";
import { ADMIN_NAV } from "../app/nav";
import { useAuth } from "../lib/auth.jsx";

export default function AdminLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login?admin=1" replace />;
  if (user.role !== "admin") return <Navigate to="/app" replace />;
  return (
    <DashboardShell nav={ADMIN_NAV} variant="admin">
      <Outlet />
    </DashboardShell>
  );
}
