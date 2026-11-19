import { createContext, useContext, useEffect, useState } from "react";

// Mock auth only — no backend, no real credentials. Any email/password is
// accepted and the session is kept in localStorage for the demo.
const KEY = "nexbridge_demo_session";
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

const seededUser = () => {
  try {
    const seed = new URLSearchParams(window.location.search).get("seed");
    if (seed === "admin") return { email: "admin@nexbridge.tech", name: "System Administrator", role: "admin", initials: "SA" };
    if (seed === "customer") return { email: "kwame.mensah@horizonretail.gh", name: "Kwame Mensah", role: "customer", initials: "KM" };
  } catch { /* ignore */ }
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const persisted = JSON.parse(localStorage.getItem(KEY));
      if (persisted) return persisted;
    } catch { /* ignore */ }
    return seededUser(); // demo/preview: ?seed= signs in before first render
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(KEY, JSON.stringify(user));
      else localStorage.removeItem(KEY);
    } catch { /* ignore */ }
  }, [user]);


  const login = ({ email, role = "customer" }) => {
    const nm = email ? email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Kwame Mensah";
    setUser({
      email: email || "kwame.mensah@horizonretail.gh",
      name: role === "admin" ? "System Administrator" : nm || "Kwame Mensah",
      role,
      initials: (nm || "KM").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
    });
  };
  const logout = () => setUser(null);

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}
