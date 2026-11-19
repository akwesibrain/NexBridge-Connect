import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./app/App";
import { AuthProvider } from "./lib/auth.jsx";
import { ToastProvider } from "./components/ui/Toast.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Dismiss the boot splash once the app has mounted, keeping it on screen for a
// minimum time so the logo is actually seen even on a fast reload.
(function dismissBoot() {
  const boot = document.getElementById("boot");
  if (!boot) { window.__BOOT_DONE = true; return; }
  const MIN_MS = 850;
  const elapsed = Date.now() - (window.__BOOT_T || Date.now());
  const wait = Math.max(0, MIN_MS - elapsed);
  window.setTimeout(() => {
    boot.classList.add("boot-hide");
    const done = () => { boot.remove(); window.__BOOT_DONE = true; };
    boot.addEventListener("transitionend", done, { once: true });
    window.setTimeout(done, 700); // fallback if transitionend doesn't fire
  }, wait);
})();
