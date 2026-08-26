"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Languages, Loader2, ShieldCheck, Wifi, Briefcase, X } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { sectorDefinitions } from "@/features/erp/config";

export default function LoginPage() {
  const { user, login } = useAuth();
  const { toast, showToast } = useApp();
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Guest personalization modal state
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestFullName, setGuestFullName] = useState("Your Name");
  const [guestCompanyName, setGuestCompanyName] = useState("Your Business LLC");
  const [guestSectorId, setGuestSectorId] = useState("retail-trading");

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await api.login(form);
      login(result.token, result.user);
      showToast(`Welcome, ${result.user.fullName}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLaunch = (e: FormEvent) => {
    e.preventDefault();
    if (!guestFullName.trim() || !guestCompanyName.trim()) {
      showToast("Please enter your full name and company name");
      return;
    }

    login("guest-token-123", {
      id: "user-guest-1",
      fullName: guestFullName.trim(),
      email: "guest@beyonderp.demo",
      phone: "+251911234567",
      companyName: guestCompanyName.trim(),
      companySectorId: guestSectorId,
      role: "OWNER",
      permissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
      effectivePermissions: ["View", "Transactions", "Employees", "Finance", "Reports", "Users", "Settings", "Audit", "Compliance"],
      status: "ACTIVE",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    showToast(`Welcome, ${guestFullName.trim()}! Workspace personalized for ${guestCompanyName.trim()}.`);
    router.push("/dashboard");
  };

  const bg = dark ? "#080e19" : "#f5f8ff";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const ink = dark ? "#e2e8f0" : "#0f172a";
  const muted = "#64748b";
  const inputBg = dark ? "#0a1220" : "#f8fafc";

  return (
    <main style={{ minHeight: "100vh", display: "flex", background: bg }}>

      {/* Left brand panel — hidden on mobile */}
      <div
        style={{
          width: "42%",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 60%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}
        className="login-brand-panel"
      >
        {/* Atmospheric orbs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: "white", letterSpacing: "-0.02em" }}>BeyondERP</span>
        </div>

        {/* Hero copy */}
        <div style={{ position: "relative" }}>
          <p style={{ margin: "0 0 20px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(191,219,254,0.7)" }}>
            Enterprise Resource Planning
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Instrument Serif", Georgia, serif', fontSize: "clamp(34px, 3.5vw, 54px)", lineHeight: 1.02, color: "white", fontWeight: 400, letterSpacing: "-0.01em" }}>
            The operating<br />system for<br />
            <span style={{ fontStyle: "italic", color: "#bfdbfe" }}>your company.</span>
          </h1>
          <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 14 }}>
            {([
              { icon: <ShieldCheck size={14} />, label: "Tax compliant · Automated reporting" },
              { icon: <Wifi size={14} />, label: "Offline first capability" },
              { icon: <Languages size={14} />, label: "English · French (Canada)" },
            ] as const).map(({ icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(219,234,254,0.85)", fontSize: 14 }}>
                <span style={{ color: "#93c5fd", flexShrink: 0 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <p style={{ margin: 0, fontSize: 11, color: "rgba(148,163,184,0.5)" }}>
            &copy; {new Date().getFullYear()} BeyondERP
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top row: mobile logo + theme toggle */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 28px" }}>
          {/* Mobile-only logo */}
          <div className="login-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 16, color: ink, letterSpacing: "-0.02em" }}>BeyondERP</span>
          </div>
          <ThemeToggle />
        </div>

        {/* Centered form */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px 48px" }}>
          <div style={{ width: "100%", maxWidth: 400 }}>

            <div style={{ marginBottom: 30 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 26, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
                Sign in
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: muted, lineHeight: 1.5 }}>
                Access your Beyond ERP workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                Email address
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  autoFocus
                  placeholder="you@company.com"
                  style={{
                    height: 44, width: "100%", borderRadius: 10, border: `1.5px solid ${border}`,
                    background: inputBg, padding: "0 14px", color: ink, fontSize: 14,
                    outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                Password
                <div style={{ position: "relative" }}>
                  <input
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    required
                    placeholder="••••••••"
                    style={{
                      height: 44, width: "100%", borderRadius: 10, border: `1.5px solid ${border}`,
                      background: inputBg, padding: "0 44px 0 14px", color: ink, fontSize: 14,
                      outline: "none", transition: "border-color 0.15s", boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#2563eb")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = border)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", color: muted, cursor: "pointer",
                      display: "flex", padding: 4,
                    }}
                  >
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: 46, borderRadius: 10, border: 0, marginTop: 4,
                  background: loading ? "#3b82f6" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white", fontWeight: 700, fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                  transition: "opacity 0.15s",
                }}
              >
                {loading && <Loader2 className="spin" size={17} />}
                {loading ? "Signing in…" : "Sign in"}
                {!loading && <ArrowRight size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setShowGuestModal(true)}
                style={{
                  height: 46, borderRadius: 10, border: `1.5px solid #2563eb`, marginTop: 2,
                  background: dark ? "rgba(37,99,235,0.15)" : "#eff6ff",
                  color: dark ? "#93c5fd" : "#1d4ed8", fontWeight: 700, fontSize: 14,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "background 0.15s",
                }}
              >
                ⚡ Quick Preview / Guest Access
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
              <div style={{ flex: 1, height: 1, background: border }} />
              <span style={{ fontSize: 12, color: muted }}>or</span>
              <div style={{ flex: 1, height: 1, background: border }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
              <button
                type="button"
                onClick={() => router.push("/forgot-password")}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontSize: 13, fontWeight: 600, padding: "6px 0" }}
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 13, padding: "6px 0" }}
              >
                ← Back to home
              </button>
            </div>

            {/* Sign-up nudge */}
            <div style={{ marginTop: 28, padding: "14px 16px", borderRadius: 10, border: `1px solid ${border}`, background: dark ? "#0a1220" : "#f8fafc", textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: muted }}>
                New to Beyond ERP?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#2563eb", fontWeight: 700, fontSize: 13 }}
                >
                  Create a workspace →
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Personalization Modal */}
      {showGuestModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: surface, border: `1px solid ${border}`, borderRadius: 16,
            width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)", padding: 32,
            display: "flex", flexDirection: "column", gap: 24
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "between" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2563eb" }}>
                  Guest Setup
                </p>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: ink }}>
                  Personalize Your Guest Workspace
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: muted, padding: 6 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuestLaunch} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                  Your Full Name
                  <input
                    value={guestFullName}
                    onChange={(e) => setGuestFullName(e.target.value)}
                    required
                    placeholder="Your Name"
                    style={{
                      height: 42, width: "100%", borderRadius: 8, border: `1.5px solid ${border}`,
                      background: inputBg, padding: "0 12px", color: ink, fontSize: 14, outline: "none"
                    }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600, color: ink }}>
                  Company Name
                  <input
                    value={guestCompanyName}
                    onChange={(e) => setGuestCompanyName(e.target.value)}
                    required
                    placeholder="Your Business LLC"
                    style={{
                      height: 42, width: "100%", borderRadius: 8, border: `1.5px solid ${border}`,
                      background: inputBg, padding: "0 12px", color: ink, fontSize: 14, outline: "none"
                    }}
                  />
                </label>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: ink }}>
                  Select Operating Sector
                </label>
                <div style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10,
                  maxHeight: 220, overflowY: "auto", paddingRight: 4
                }}>
                  {sectorDefinitions.map((sec) => {
                    const isSelected = guestSectorId === sec.id;
                    return (
                      <button
                        type="button"
                        key={sec.id}
                        onClick={() => setGuestSectorId(sec.id)}
                        style={{
                          textAlign: "left", padding: "10px 12px", borderRadius: 10,
                          border: `2px solid ${isSelected ? "#2563eb" : border}`,
                          background: isSelected ? (dark ? "rgba(37,99,235,0.2)" : "#eff6ff") : inputBg,
                          cursor: "pointer", display: "flex", flexDirection: "column", gap: 4, transition: "all 0.15s"
                        }}
                      >
                        <span style={{ color: sec.color, fontSize: 16 }}>
                          <i className={sec.icon} />
                        </span>
                        <strong style={{ fontSize: 13, color: ink }}>{sec.name}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  style={{
                    height: 42, padding: "0 18px", borderRadius: 8, border: `1px solid ${border}`,
                    background: "none", color: ink, fontWeight: 600, fontSize: 14, cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    height: 42, padding: "0 22px", borderRadius: 8, border: 0,
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "white",
                    fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)"
                  }}
                >
                  Launch Personalized Workspace
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}
