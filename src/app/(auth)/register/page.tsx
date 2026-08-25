"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronRight, X } from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { Suspense, useState, type FormEvent } from "react";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showToast } = useApp();
  const { login } = useAuth();

  const [selectedId, setSelectedId] = useState(searchParams.get("sectorId") ?? "");
  const [error, setError] = useState("");

  // Guest personalization modal state
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [guestFullName, setGuestFullName] = useState("Your Name");
  const [guestCompanyName, setGuestCompanyName] = useState("Your Business LLC");
  const [guestSectorId, setGuestSectorId] = useState(selectedId || "retail-trading");

  const handleContinue = () => {
    if (!selectedId) {
      setError("Choose a sector to continue");
      showToast("Choose your company sector first");
      return;
    }
    router.push(`/register/details?sectorId=${selectedId}`);
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
      companySectorId: guestSectorId || selectedId || "retail-trading",
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

  return (
    <main className="marketing-shell">
      <section className="sector-select-page">
        <div className="auth-topbar">
          <button type="button" className="secondary-button compact" onClick={() => router.push("/")}>
            <ArrowLeft size={16} />
            Back
          </button>
          <span>Step 1 of 2</span>
        </div>
        <div className="sector-select-header">
          <p className="eyebrow">Choose your operating model</p>
          <h1>Select the sector for your company</h1>
          <span>
            This sector is sent with your registration request. After payment approval, your ERP login opens
            with these modules first.
          </span>
        </div>
        <div className="sector-select-grid">
          {sectorDefinitions.map((sector) => {
            const selected = selectedId === sector.id;
            return (
              <button
                type="button"
                key={sector.id}
                className={selected ? "selected" : ""}
                onClick={() => { setSelectedId(sector.id); setError(""); }}
                aria-pressed={selected}
              >
                <span className="sector-pick-icon" style={{ background: sector.tint, color: sector.color }}>
                  <i className={sector.icon} />
                </span>
                <strong>{sector.name}</strong>
                <small>{sector.description}</small>
              </button>
            );
          })}
        </div>
        {error ? <span className="field-error">{error}</span> : null}
        <div className="sector-select-actions" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="button" className="primary-button" onClick={handleContinue} style={{ flex: 1 }}>
              Continue Registration
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setGuestSectorId(selectedId || "retail-trading");
                setShowGuestModal(true);
              }}
              style={{ flex: 1, borderColor: "#2563eb", color: "#2563eb", background: "rgba(37,99,235,0.05)" }}
            >
              ⚡ Quick Preview / Guest Access
            </button>
          </div>
          <button type="button" className="secondary-button" onClick={() => router.push("/")} style={{ width: "100%" }}>
            Back to landing
          </button>
        </div>
      </section>

      {/* Guest Personalization Modal */}
      {showGuestModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16,
            width: "100%", maxWidth: 580, maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)", padding: 32,
            display: "flex", flexDirection: "column", gap: 24, color: "#0f172a"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#2563eb" }}>
                  Guest Setup
                </p>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>
                  Personalize Your Guest Workspace
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 6 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleGuestLaunch} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600 }}>
                  Your Full Name
                  <input
                    value={guestFullName}
                    onChange={(e) => setGuestFullName(e.target.value)}
                    required
                    placeholder="Your Name"
                    style={{
                      height: 42, width: "100%", borderRadius: 8, border: "1.5px solid #e2e8f0",
                      background: "#f8fafc", padding: "0 12px", color: "#0f172a", fontSize: 14, outline: "none"
                    }}
                  />
                </label>

                <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 600 }}>
                  Company Name
                  <input
                    value={guestCompanyName}
                    onChange={(e) => setGuestCompanyName(e.target.value)}
                    required
                    placeholder="Your Business LLC"
                    style={{
                      height: 42, width: "100%", borderRadius: 8, border: "1.5px solid #e2e8f0",
                      background: "#f8fafc", padding: "0 12px", color: "#0f172a", fontSize: 14, outline: "none"
                    }}
                  />
                </label>
              </div>

              <button
                type="submit"
                style={{
                  height: 46, borderRadius: 10, border: 0,
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: "0 4px 14px rgba(37,99,235,0.35)", marginTop: 8
                }}
              >
                Launch Guest Workspace →
              </button>
            </form>
          </div>
        </div>
      )}

      {toast ? <div className="toast">{toast}</div> : null}
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}
