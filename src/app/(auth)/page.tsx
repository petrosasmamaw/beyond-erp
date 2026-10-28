"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  FileText,
  RefreshCw,
  ShieldCheck,
  Users,
  Wifi,
  Package,
  Receipt,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Lock,
  Globe2,
  CreditCard,
  Building2,
} from "lucide-react";
import { sectorDefinitions } from "@/features/erp/config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Palette
  const pageBg = dark ? "#070b14" : "#e8edf7";
  const cardBg = dark ? "#0d1422" : "#fbfaf6";
  const surface = dark ? "#0f1a2e" : "#ffffff";
  const surfaceSoft = dark ? "#0a1220" : "#f4f6fb";
  const border = dark ? "#1a2d42" : "#e2e8f0";
  const borderSoft = dark ? "#16243a" : "#eef1f7";
  const ink = dark ? "#e8eef9" : "#0b1220";
  const inkSoft = dark ? "#cbd5e1" : "#1f2937";
  const muted = dark ? "#94a3b8" : "#64748b";
  const blue = "#2563eb";
  const blueDeep = "#1e3a8a";

  const spotlight = sectorDefinitions[0];
  const restSectors = sectorDefinitions.slice(1);

  return (
    <main className="landing-shell" style={{ background: pageBg, color: ink }}>
      

      <div className="landing-card">
        {/* ============= NAV ============= */}
        <nav className="landing-nav">
          <a className="nav-brand" href="#" style={{ textDecoration: "none", fontFamily: '"Inter Tight", sans-serif', fontWeight: 700, fontSize: 22, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="BeyondERP" style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }} />
            Beyond ERP
          </a>

          <div className="nav-links">
            <a className="nav-link" href="#sectors">Sectors</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#start">Pricing</a>
            <a className="nav-link" href="#start">Contact</a>
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <button type="button" className="nav-signin" onClick={() => router.push("/login")}>
              Log in
            </button>
            <button type="button" className="nav-cta" onClick={() => router.push("/register")}>
              Sign up
            </button>
          </div>
        </nav>

        {/* ============= HERO (UNCHANGED) ============= */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-eyebrow">Enterprise Operating System</div>
            <h1 className="hero-title">
              Built for Modern<br />
              <em>Accounting, Tax</em><br />
              & Operations
            </h1>
            <p className="hero-copy">
              The unified ERP & CRM platform for modern businesses. Automated tax filing, compliance-ready ledgers, seamless payments, and bilingual workflows.
            </p>

            <div className="hero-actions">
              <button type="button" className="btn-primary" onClick={() => router.push("/register")}>
                Start Free Trial
                <ArrowRight size={16} />
              </button>
              <button type="button" className="btn-link" onClick={() => router.push("/login")}>
                Explore Modules
              </button>
            </div>

            <div className="hero-proof">
              <span className="proof-label">Certified</span>
              <span className="proof-logo">
                <ShieldCheck size={16} /> Compliance & Tax Ready
              </span>
              <span className="proof-logo">
                <Wifi size={16} /> Offline-First Sync
              </span>
            </div>
          </div>

          <div className="hero-right">
            <div className="floating-badge">
              <div className="avatars">
                <span className="avatar" style={{ background: "#f97316" }}>A</span>
                <span className="avatar" style={{ background: "#7c3aed" }}>M</span>
                <span className="avatar" style={{ background: "#0f766e" }}>T</span>
              </div>
              <span>Live · 12 teams online</span>
            </div>

            <div className="mockup">
              <div className="mockup-top">
                <div className="mockup-top-left">
                  <span className="mockup-dot" style={{ background: "#ef4444" }} />
                  <span className="mockup-dot" style={{ background: "#f59e0b" }} />
                  <span className="mockup-dot" style={{ background: "#10b981" }} />
                </div>
                <span style={{ color: muted, fontSize: 11, fontWeight: 600 }}>
                  beyond-erp.app
                </span>
              </div>

              <div className="mockup-body">
                <div className="mockup-metric-row">
                  <div className="mockup-metric">
                    <div className="mockup-metric-label">Revenue</div>
                    <div className="mockup-metric-value">
                      CAD 428k
                      <span className="mockup-metric-delta">+12%</span>
                    </div>
                  </div>
                  <div className="mockup-metric">
                    <div className="mockup-metric-label">Orders</div>
                    <div className="mockup-metric-value">
                      1,284
                      <span className="mockup-metric-delta">+8%</span>
                    </div>
                  </div>
                </div>

                <div className="mockup-chart">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: ink, fontSize: 12, fontWeight: 700 }}>Weekly sales</span>
                    <span style={{ color: muted, fontSize: 10, fontWeight: 600 }}>This week</span>
                  </div>
                  <div className="chart-bars">
                    {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="chart-bar"
                        style={{ height: `${h}%`, opacity: i === 5 ? 1 : 0.55 }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mockup-list-item">
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: `${blue}18`, color: blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Receipt size={14} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: ink, fontSize: 12, fontWeight: 600 }}>Invoice #4821</div>
                      <div style={{ color: muted, fontSize: 11 }}>VAT receipt issued</div>
                    </div>
                    <span style={{ color: "#10b981", fontSize: 11, fontWeight: 700 }}>Paid</span>
                  </div>
                  <div className="mockup-list-item">
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: "#f9731618", color: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Package size={14} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: ink, fontSize: 12, fontWeight: 600 }}>Stock sync</div>
                      <div style={{ color: muted, fontSize: 11 }}>12 items queued</div>
                    </div>
                    <span style={{ color: blue, fontSize: 11, fontWeight: 700 }}>Syncing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card">
              <div className="floating-card-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <div style={{ color: ink, fontSize: 12, fontWeight: 700 }}>VAT filed</div>
                <div style={{ color: muted, fontSize: 11 }}>Ready for export</div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= TRUSTED BY / ETHIO TELECOM PARTNER ============= */}
        <section className="telecom-partner-section">
          <div className="telecom-partner-inner">
            <div className="telecom-partner-card">
              <div className="telecom-partner-header">
                <div className="telecom-partner-brand-block">
                  <div className="telecom-logo-wrapper">
                    <img
                      src="/ethio-telecom.png"
                      alt="Ethio Telecom"
                      className="telecom-logo-img"
                    />
                  </div>
                  <div className="telecom-brand-meta">
                    <div className="telecom-badge">
                      <ShieldCheck size={13} className="telecom-badge-icon" />
                      <span>Official Strategic Partner</span>
                    </div>
                    <div className="telecom-brand-name">
                      ethio telecom <span>· telebirr</span>
                    </div>
                    <div className="telecom-status">
                      <span className="telecom-status-pulse" />
                      <span>Direct Enterprise Payment Integration</span>
                    </div>
                  </div>
                </div>

                <div className="telecom-partner-text-block">
                  <div className="telecom-eyebrow">National Payment Gateway</div>
                  <h2 className="telecom-title">
                    Trusted by & Integrated with <em>Ethio Telecom</em>
                  </h2>
                  <p className="telecom-desc">
                    Beyond ERP connects directly with Ethio Telecom and telebirr. Ethiopian businesses can now collect instant customer payments, automate B2B settlements, and reconcile digital invoices in real time with bank-grade security.
                  </p>
                </div>
              </div>

              <div className="telecom-features-grid">
                <div className="telecom-feature-item">
                  <div className="telecom-feature-icon-box green">
                    <CreditCard size={17} />
                  </div>
                  <div>
                    <h3 className="telecom-feature-title">telebirr Instant Pay</h3>
                    <p className="telecom-feature-desc">
                      Accept one-click telebirr payments on Point-of-Sale, digital invoices, and customer web portals.
                    </p>
                  </div>
                </div>

                <div className="telecom-feature-item">
                  <div className="telecom-feature-icon-box cyan">
                    <RefreshCw size={17} />
                  </div>
                  <div>
                    <h3 className="telecom-feature-title">Real-Time Reconciliation</h3>
                    <p className="telecom-feature-desc">
                      Automated ledger matching syncs telebirr transaction IDs with sales orders and tax invoices instantly.
                    </p>
                  </div>
                </div>

                <div className="telecom-feature-item">
                  <div className="telecom-feature-icon-box">
                    <Building2 size={17} />
                  </div>
                  <div>
                    <h3 className="telecom-feature-title">Automated B2B Payouts</h3>
                    <p className="telecom-feature-desc">
                      Disburse supplier settlements, payroll advances, and utility payments via enterprise telebirr rails.
                    </p>
                  </div>
                </div>

                <div className="telecom-feature-item">
                  <div className="telecom-feature-icon-box green">
                    <Lock size={17} />
                  </div>
                  <div>
                    <h3 className="telecom-feature-title">National Security Rails</h3>
                    <p className="telecom-feature-desc">
                      Compliant with Ethiopian financial regulations, encrypted webhooks, and 99.9% uptime infrastructure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="telecom-metrics-strip">
                <div className="telecom-metric-item">
                  <span className="telecom-metric-dot" />
                  <span><strong>Zero-Wait Settlement:</strong> Instant merchant credit</span>
                </div>
                <div className="telecom-metric-item">
                  <span className="telecom-metric-dot" />
                  <span><strong>Automated VAT:</strong> 15% tax invoices with telebirr reference</span>
                </div>
                <div className="telecom-metric-item">
                  <span className="telecom-metric-dot" />
                  <span><strong>Nationwide:</strong> Full coverage across Addis Ababa and all regional states</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============= SECTORS — EDITORIAL ============= */}
        <section id="sectors" className="sectors-band">
          <div className="sectors-inner">
            <div className="sectors-top">
              <div>
                <div className="hero-eyebrow">Operating Models</div>
                <h2>
                  Choose the way<br />
                  your <em>company</em> works.
                </h2>
              </div>
              <div className="sectors-top-right">
                <p>
                  Pick a sector and Beyond opens with the modules, defaults, KPIs, and reports that fit your business from day one. No setup wizards, no empty dashboards.
                </p>
                <div className="sectors-stats">
                  <div>
                    <div className="stat-num">{sectorDefinitions.length}</div>
                    <div className="stat-label">Sectors</div>
                  </div>
                  <div>
                    <div className="stat-num">15%</div>
                    <div className="stat-label">VAT ready</div>
                  </div>
                  <div>
                    <div className="stat-num">∞</div>
                    <div className="stat-label">Offline days</div>
                  </div>
                </div>
              </div>
            </div>

            {spotlight && (
              <div className="sectors-feature">
                <button
                  type="button"
                  className="spotlight-card"
                  onClick={() => router.push(`/register?sectorId=${spotlight.id}`)}
                >
                  <div>
                    <span className="spotlight-tag">
                      <Sparkles size={12} />
                      Featured · Most popular
                    </span>
                    <h3>{spotlight.name}</h3>
                    <p>{spotlight.description}</p>
                    <div className="spotlight-modules">
                      <span className="spotlight-module">Sales</span>
                      <span className="spotlight-module">Stock</span>
                      <span className="spotlight-module">Finance</span>
                      <span className="spotlight-module">Payroll</span>
                      <span className="spotlight-module">Reports</span>
                    </div>
                  </div>
                  <span className="spotlight-go">
                    Configure workspace
                    <ArrowUpRight size={15} />
                  </span>
                </button>

                <div className="sectors-side">
                  {restSectors.slice(0, 2).map((sector) => (
                    <button
                      key={sector.id}
                      type="button"
                      className="sector-card"
                      onClick={() => router.push(`/register?sectorId=${sector.id}`)}
                    >
                      <div
                        className="sector-icon"
                        style={{
                          background: dark ? `${sector.color}22` : sector.tint,
                          color: sector.color,
                        }}
                      >
                        <i className={sector.icon} />
                      </div>
                      <div>
                        <h3>{sector.name}</h3>
                        <p>{sector.description}</p>
                      </div>
                      <div className="sector-arrow">
                        <ArrowRight size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {restSectors.length > 2 && (
              <div className="sectors-rest">
                {restSectors.slice(2).map((sector) => (
                  <button
                    key={sector.id}
                    type="button"
                    className="sector-card"
                    onClick={() => router.push(`/register?sectorId=${sector.id}`)}
                  >
                    <div
                      className="sector-icon"
                      style={{
                        background: dark ? `${sector.color}22` : sector.tint,
                        color: sector.color,
                      }}
                    >
                      <i className={sector.icon} />
                    </div>
                    <div>
                      <h3>{sector.name}</h3>
                      <p>{sector.description}</p>
                    </div>
                    <div className="sector-arrow">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============= FEATURES — BENTO ============= */}
        <section id="features" className="features-band">
          <div className="features-inner">
            <div className="features-head">
              <div>
                <div className="hero-eyebrow">Core Features</div>
                <h2>
                  Built for the <em>real</em><br />
                  workday.
                </h2>
              </div>
              <p>
                Fast sales, clean ledgers, controlled permissions, and reliable sync — for teams that repeat these workflows every day.
              </p>
            </div>

            <div className="bento">
              <div className="bento-card bento-large">
                <span className="spotlight-tag">
                  <Wifi size={12} />
                  Always available
                </span>
                <h3>Offline-first by design.<br />Sync when ready.</h3>
                <p>
                  Transactions, invoices, and stock movements queue locally on every device. When the network returns, everything reconciles in order — no lost work, no duplicate records.
                </p>
                <div className="bento-visual">
                  <span className="bento-pill">
                    <CheckCircle2 size={12} /> 12 queued
                  </span>
                  <span className="bento-pill">
                    <RefreshCw size={12} /> Auto-sync
                  </span>
                  <span className="bento-pill">
                    <Lock size={12} /> Encrypted
                  </span>
                </div>
              </div>

              <div className="bento-card bento-medium">
                <div className="bento-icon" style={{ background: "#0f766e18", color: "#0f766e" }}>
                  <FileText size={20} />
                </div>
                <h3 style={{ color: ink }}>VAT-ready receipts</h3>
                <p style={{ color: muted }}>Invoices, receipts, and tax reports stay connected to the ledger.</p>
              </div>

              <div className="bento-card bento-medium">
                <div className="bento-icon" style={{ background: "#7c3aed18", color: "#7c3aed" }}>
                  <Users size={20} />
                </div>
                <h3 style={{ color: ink }}>Team controls</h3>
                <p style={{ color: muted }}>Roles, permissions, payroll, and approvals stay structured.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: `${blue}18`, color: blue }}>
                  <BarChart3 size={20} />
                </div>
                <h3 style={{ color: ink }}>Reports that read themselves</h3>
                <p style={{ color: muted }}>Daily, weekly, monthly. Sales, stock, finance, all in one workspace, in English or French.</p>
              </div>

              <div className="bento-card bento-wide">
                <div className="bento-icon" style={{ background: "#f9731618", color: "#f97316" }}>
                  <Globe2 size={20} />
                </div>
                <h3 style={{ color: ink }}>Bilingual Canadian support</h3>
                <p style={{ color: muted }}>English (USA) and French (Canada) at the interface level. Switch per user, not per company.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============= CTA ============= */}
        <section id="start" className="cta-band">
          <div className="cta-card">
            <div className="cta-left">
              <div className="hero-eyebrow">Start workspace</div>
              <h2>
                Set up your ERP<br />
                in <em>minutes.</em>
              </h2>
              <p>
                Choose your sector, send company details, and your approved workspace opens with the right modules first.
              </p>
              <div className="cta-actions">
                <button type="button" className="btn-primary" onClick={() => router.push("/register")}>
                  Create workspace
                  <ArrowRight size={16} />
                </button>
                <button type="button" className="btn-link" onClick={() => router.push("/login")}>
                  Talk to us
                </button>
              </div>
            </div>

            <div className="cta-right">
              <div className="cta-steps">
                <div className="cta-step">
                  <div className="cta-step-num">1</div>
                  <div className="cta-step-content">
                    <h4>Pick your sector</h4>
                    <p>Retail, services, manufacturing, or hospitality — your defaults follow.</p>
                  </div>
                </div>
                <div className="cta-step">
                  <div className="cta-step-num">2</div>
                  <div className="cta-step-content">
                    <h4>Submit company details</h4>
                    <p>TIN, VAT, branches, and team size. We handle compliance from there.</p>
                  </div>
                </div>
                <div className="cta-step">
                  <div className="cta-step-num">3</div>
                  <div className="cta-step-content">
                    <h4>Approved and live</h4>
                    <p>Your workspace opens with the right modules, KPIs, and reports.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </main>
  );
}

/* ============ HELPERS ============ */

function LogoTile({
  tileSize,
  iconSize,
  background,
  border = "none",
}: {
  tileSize: number;
  iconSize: number;
  background: string;
  border?: string;
}) {
  return (
    <span
      style={{
        width: tileSize,
        height: tileSize,
        borderRadius: Math.max(8, Math.round(tileSize * 0.28)),
        background,
        border,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: iconSize,
          height: iconSize,
          display: "block",
          background: 'url("/logo.png") center / cover no-repeat',
        }}
      />
    </span>
  );
}