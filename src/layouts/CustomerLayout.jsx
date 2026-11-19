import { Navigate, Outlet } from "react-router-dom";
import DashboardShell from "./DashboardShell";
import { CUSTOMER_NAV } from "../app/nav";
import { useAuth } from "../lib/auth.jsx";

export default function CustomerLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return (
    <DashboardShell nav={CUSTOMER_NAV} variant="customer">
      <Outlet />
    </DashboardShell>
  );
}
