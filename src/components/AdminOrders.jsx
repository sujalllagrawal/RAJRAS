import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";

export default function AdminOrders() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("rajrass_admin_auth") === "true";
  });
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const ADMIN_PASSWORD = "Sujal@1234";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("rajrass_admin_auth", "true");
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect Password! Access Denied.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("rajrass_admin_auth");
  };

  if (isAuthenticated) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 font-body selection:bg-rajras-red selection:text-cream">
      <div className="max-w-md w-full bg-white rounded-tiffin p-8 border border-cream-line shadow-card">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full bg-rajras-red/10 text-rajras-red font-semibold text-xs uppercase tracking-widest mb-2">
            SECURE PORTAL
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink">RAJRASS Admin Login</h1>
          <p className="text-sm text-ink-soft mt-1">Please enter your password to access the panel</p>
        </div>

        {errorMsg && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold p-3 rounded-tiffin text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-2">
              Admin Password
            </label>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-cream/50 border border-cream-line px-4 py-3 rounded-tiffin text-ink placeholder:text-ink-faint focus:outline-none focus:border-rajras-red focus:bg-white transition-all text-sm"
              autoFocus
            />
          </div>

          <button type="submit" className="btn-primary w-full !py-3">
            Unlock Admin Panel
          </button>
        </form>

        <div className="mt-6 text-center border-t border-cream-line pt-4">
          <a href="/" className="text-xs font-semibold text-ink-soft hover:text-rajras-red transition-colors">
            ← Return to RAJRASS Website
          </a>
        </div>
      </div>
    </div>
  );
}
