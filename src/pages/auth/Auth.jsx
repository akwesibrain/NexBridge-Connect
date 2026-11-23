import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";
import { Logo } from "../../brand/Logo";
import BootSplash, { useEntrySplash } from "../../components/BootSplash";
import Button from "../../components/ui/Button";
import { Field, Input, PasswordInput } from "../../components/ui/Field";
import { useAuth } from "../../lib/auth.jsx";
import { useToast } from "../../components/ui/Toast.jsx";

// Mouse-driven parallax. The pointer sets a target; a rAF loop eases the
// current value toward it, so movement glides and settles instead of
// snapping. Values go straight onto CSS variables on the panel, so moving the
// mouse never re-renders React:
//   --mx / --my  smoothed offset from the centre, -1..1
//   --px / --py  smoothed pointer position in px (for the spotlight)
//   --lit        0..1, fades the spotlight in on enter and out on leave
// Turned off when the OS asks for reduced motion.
function usePointerParallax(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0, px: 0, py: 0, lit: 0 };
    const cur = { ...target };
    let raf = 0;
    const EASE = 0.08;

    const tick = () => {
      let moving = false;
      for (const k of Object.keys(cur)) {
        const d = target[k] - cur[k];
        if (Math.abs(d) > (k === "px" || k === "py" ? 0.1 : 0.0005)) { cur[k] += d * EASE; moving = true; }
        else cur[k] = target[k];
      }
      el.style.setProperty("--mx", cur.x.toFixed(4));
      el.style.setProperty("--my", cur.y.toFixed(4));
      el.style.setProperty("--px", `${cur.px.toFixed(1)}px`);
      el.style.setProperty("--py", `${cur.py.toFixed(1)}px`);
      el.style.setProperty("--lit", cur.lit.toFixed(3));
      raf = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left, py = e.clientY - r.top;
      target.x = Math.max(-1, Math.min(1, (px / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, (py / r.height) * 2 - 1));
      target.px = px; target.py = py; target.lit = 1;
      // Start the spotlight where the pointer enters, not sliding in from a corner.
      if (cur.lit < 0.01) { cur.px = px; cur.py = py; }
      kick();
    };
    const onLeave = () => { target.x = 0; target.y = 0; target.lit = 0; kick(); };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [ref, enabled]);
}

const POINTS = ["Reliable carrier-grade delivery", "Bulk campaigns & automation", "Developer API and webhooks"];

function AuthFrame({ title, subtitle, children, footer }) {
  // Hooks must run before the early splash return.
  const splashing = useEntrySplash();
  const panelRef = useRef(null);
  usePointerParallax(panelRef, !splashing);
  if (splashing) return <BootSplash />;
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel — layers shift with the mouse at different depths */}
      <div ref={panelRef}
        className="nb-parallax relative hidden overflow-hidden bg-navy-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* deep layer: drifting glows, moving furthest */}
        <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
          <span className="nb-layer nb-depth-far"><span className="nb-orb nb-orb-a" /></span>
          <span className="nb-layer nb-depth-mid"><span className="nb-orb nb-orb-b" /></span>
        </div>
        {/* soft light that follows the pointer */}
        <div className="nb-spotlight pointer-events-none absolute inset-0" aria-hidden="true" />
        <Link to="/" className="nb-rise relative w-fit" style={{ animationDelay: "60ms" }}><Logo markClass="text-white" invert /></Link>
        {/* near layer: content leans gently, opposite the glows */}
        <div className="nb-depth-near relative">
          <h2 className="nb-rise text-3xl font-bold leading-tight" style={{ animationDelay: "160ms" }}>Connect. Communicate. Deliver.</h2>
          <p className="nb-rise mt-4 max-w-sm text-navy-200" style={{ animationDelay: "260ms" }}>The enterprise messaging platform for businesses, institutions and developers across Ghana.</p>
          <ul className="mt-8 space-y-3">
            {POINTS.map((x, i) => (
              <li key={x} className="nb-rise flex items-center gap-2 text-sm text-navy-100" style={{ animationDelay: `${380 + i * 90}ms` }}>
                <Check size={16} className="text-brand-300" /> {x}
              </li>
            ))}
          </ul>
        </div>
        <p className="nb-rise relative text-xs text-navy-300" style={{ animationDelay: "700ms" }}>Copyright &copy; 2026 Nexbridge Technology.</p>
      </div>
      {/* Form */}
      <div className="flex items-center justify-center bg-surface-muted px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
          <p className="mt-1 text-sm text-navy-600">{subtitle}</p>
          <div className="mt-7">{children}</div>
          <p className="mt-6 text-center text-sm text-navy-600">{footer}</p>
        </div>
      </div>
    </div>
  );
}

// A Nexbridge staff email signs in to the admin console; anything else is a
// customer. One login page decides the destination from the credentials.
const roleForEmail = (email) => (email.trim().toLowerCase().endsWith("@nexbridge.tech") ? "admin" : "customer");

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("kwame.mensah@horizonretail.gh");
  const [password, setPassword] = useState("demo1234");

  const submit = (e) => {
    e.preventDefault();
    const role = roleForEmail(email);
    login({ email, role });
    toast.success("Signed in to the demo workspace");
    navigate(role === "admin" ? "/admin" : "/app");
  };

  return (
    <AuthFrame title="Welcome back" subtitle="Sign in to your Nexbridge Connect workspace."
      footer={<>New to Nexbridge? <Link to="/register" className="font-semibold text-brand-700">Create an account</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email address"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Password">
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-navy-700"><input type="checkbox" defaultChecked className="rounded border-[#e0d8cf]" /> Remember me</label>
          <button type="button" onClick={() => toast.info("Password reset is disabled in this demo.")} className="font-medium text-brand-700 hover:text-brand-800">Forgot password?</button>
        </div>
        <Button type="submit" className="w-full" icon={ArrowRight}>Sign in</Button>
      </form>
      <div className="mt-5 flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-700">
        <ShieldCheck size={15} className="mt-0.5 shrink-0" />
        <span>Demo mode. No real authentication. Any email and password signs you in; use an <strong>@nexbridge.tech</strong> email to open the admin console.</span>
      </div>
    </AuthFrame>
  );
}

export function Register() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ org: "", name: "", email: "", phone: "", password: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    login({ email: form.email || "new.user@company.gh", role: "customer" });
    toast.success("Account created. Welcome to Nexbridge Connect");
    navigate("/app");
  };

  return (
    <AuthFrame title="Create your account" subtitle="Start sending in minutes. No card required."
      footer={<>Already have an account? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link></>}>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Organization name" required><Input value={form.org} onChange={set("org")} placeholder="Horizon Retail Group" required /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required><Input value={form.name} onChange={set("name")} placeholder="Kwame Mensah" required /></Field>
          <Field label="Phone" required><Input value={form.phone} onChange={set("phone")} placeholder="+233 20 123 4567" required /></Field>
        </div>
        <Field label="Work email" required><Input type="email" value={form.email} onChange={set("email")} placeholder="you@company.gh" required /></Field>
        <Field label="Password" required hint="At least 8 characters."><PasswordInput value={form.password} onChange={set("password")} required /></Field>
        <label className="flex items-start gap-2 text-xs text-navy-600">
          <input type="checkbox" required className="mt-0.5 rounded border-[#e0d8cf]" />
          I agree to the Nexbridge Connect Terms of Service and Acceptable Use Policy.
        </label>
        <Button type="submit" className="w-full" icon={ArrowRight}>Create account</Button>
      </form>
    </AuthFrame>
  );
}
