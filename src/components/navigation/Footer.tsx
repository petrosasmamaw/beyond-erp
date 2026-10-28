"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  Globe2,
  Mail,
  Phone,
  MapPin,
  HelpCircle,
  Info,
  ChevronRight,
  ArrowUp,
  Sparkles,
  CheckCircle2,
  Lock,
  FileText,
  Clock,
  Send,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  Layers,
  Activity,
  Heart
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal } from "@/components/ui/Modal";

interface FooterProps {
  inApp?: boolean;
}

export function Footer({ inApp = false }: FooterProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const dark = theme === "dark";

  // Modal states
  const [activeModal, setActiveModal] = useState<"about" | "faq" | "contact" | "privacy" | "terms" | null>(null);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [faqCategory, setFaqCategory] = useState<string>("All");

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    sector: "retail-trading",
    message: ""
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", email: "", company: "", sector: "retail-trading", message: "" });
      setActiveModal(null);
    }, 2400);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterSubscribed(false);
      setNewsletterEmail("");
    }, 3500);
  };

  const faqs = [
    {
      category: "General",
      q: "What makes BeyondERP unique compared to traditional ERPs?",
      a: "BeyondERP is built mobile-first and offline-resilient, combining high-speed transactional entry with native multi-jurisdiction compliance. Whether running a clinic or retail shop in Ethiopia or managing Canadian payroll with CRA EDI filing, BeyondERP gives operators a single, cohesive workspace."
    },
    {
      category: "Offline & PWA",
      q: "How does the offline-first synchronization work?",
      a: "BeyondERP includes an integrated Service Worker and local mutation queue. When your device loses internet connectivity, all transactions, invoices, patient files, and notes are safely cached in encrypted browser storage. As soon as connectivity returns, changes are automatically synchronized with the server."
    },
    {
      category: "Tax & Compliance",
      q: "Does BeyondERP handle both Canadian (CRA) and Ethiopian (15% VAT) tax rules?",
      a: "Yes. In Canadian mode, BeyondERP dynamically applies GST, PST, HST, or QST across all 13 provinces/territories and auto-generates GST34 Return schedules ready for CRA EDI filing. In Ethiopian mode, it validates 10-digit TINs, calculates 15% VAT, and tracks Ethiopian fiscal calendar periods."
    },
    {
      category: "Payments",
      q: "What payment rails are natively supported?",
      a: "The platform integrates Ethiopian payment systems (Telebirr USSD/QR, CBE Birr, Amole, Bank Wire) alongside North American and international payment methods (Credit Cards, Stripe, Direct Deposit, Cheques, and Cash-up reconciliation)."
    },
    {
      category: "AI & Automation",
      q: "How does the built-in Gemini AI Assistant help my business?",
      a: "Powered by Google GenAI (gemini-2.5-flash), the AI assistant allows operators to query ledger summaries, check inventory thresholds, inspect revenue trends, and even log transactions hands-free with automated parsing and fallback validation."
    },
    {
      category: "Security",
      q: "How is my company and customer data protected?",
      a: "All data transmissions are protected via TLS 1.3 encryption, and data at rest is secured with 256-bit AES encryption. BeyondERP complies with Canadian PIPEDA privacy directives and enforces strict 5-tier role-based access control (Owner, Admin, Manager, Staff, Viewer)."
    },
    {
      category: "Deployment",
      q: "Can BeyondERP be deployed on our own private infrastructure?",
      a: "Yes. In addition to cloud SaaS hosting, BeyondERP offers a complete Docker Compose environment with PostgreSQL, Prisma ORM, and Node.js microservices for sovereign on-premise deployments."
    }
  ];

  const filteredFaqs = faqCategory === "All" ? faqs : faqs.filter(f => f.category === faqCategory);

  return (
    <>
      <footer
        className="beyond-footer"
        style={{
          width: "100%",
          background: dark ? "#070c17" : "#f8fafc",
          borderTop: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
          color: dark ? "#94a3b8" : "#475569",
          fontSize: "13px",
          padding: inApp ? "32px 20px 88px" : "48px 24px 32px",
          marginTop: inApp ? "36px" : "0",
          boxSizing: "border-box",
          transition: "background 0.2s ease, border 0.2s ease",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gap: 36 }}>
          
          {/* TOP BAR: Brand, Live Status, Newsletter */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 28,
              paddingBottom: 28,
              borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
              alignItems: "center"
            }}
          >
            {/* Brand & Mission */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <img
                  src="/logo.png"
                  alt="BeyondERP"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: 18, fontWeight: 800, color: dark ? "#f8fafc" : "#0f172a", letterSpacing: "-0.02em" }}>
                  Beyond<span style={{ color: "#2563eb" }}>ERP</span>
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 9px",
                    borderRadius: 99,
                    background: dark ? "rgba(16,185,129,0.15)" : "#d1fae5",
                    color: dark ? "#34d399" : "#065f46",
                    fontSize: "11px",
                    fontWeight: 700
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#10b981",
                      display: "inline-block",
                      boxShadow: "0 0 8px #10b981"
                    }}
                  />
                  Live v2.4 · 99.98% Uptime
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6, maxWidth: 420 }}>
                High-performance ERP & CRM engineered for retail, farming, healthcare, manufacturing, and modern global enterprises.
              </p>
            </div>

            {/* Newsletter Subscription */}
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: dark ? "#f1f5f9" : "#1e293b", display: "flex", alignItems: "center", gap: 6 }}>
                <Sparkles size={15} style={{ color: "#3b82f6" }} /> Get Product & Compliance Updates
              </div>
              <form onSubmit={handleNewsletterSubmit} style={{ display: "flex", gap: 8, maxWidth: 420 }}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter business email…"
                  required
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 8,
                    border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                    background: dark ? "#0d1527" : "#ffffff",
                    color: dark ? "#f8fafc" : "#0f172a",
                    padding: "0 12px",
                    fontSize: 13,
                    outline: "none"
                  }}
                />
                <button
                  type="submit"
                  style={{
                    height: 38,
                    padding: "0 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Join
                  <Send size={13} />
                </button>
              </form>
              {newsletterSubscribed ? (
                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={13} /> Thank you! You will receive our monthly compliance brief.
                </span>
              ) : null}
            </div>
          </div>

          {/* MAIN FOOTER NAVIGATION COLUMNS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 32,
              lineHeight: 1.8
            }}
          >
            {/* Column 1: Core Modules */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 12 }}>
                Sectors & Workflows
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                <li>
                  <Link href="/sectors" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>
                    Retail & POS Checkout
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>
                    Manufacturing & BOM Costing
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>
                    Healthcare Clinics & Pharmacy
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>
                    Agriculture & Harvest Cycles
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s" }}>
                    Construction Site BOQ Reports
                  </Link>
                </li>
                <li>
                  <Link href="/crm" style={{ color: "inherit", textDecoration: "none", transition: "color 0.15s", display: "flex", alignItems: "center", gap: 6 }}>
                    Deals & Pipeline CRM <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: "#2563eb", color: "white", fontWeight: 700 }}>NEW</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Financials & Compliance */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 12 }}>
                Finance & Regulations
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                <li>
                  <Link href="/finance" style={{ color: "inherit", textDecoration: "none" }}>
                    Chart of Accounts & General Ledger
                  </Link>
                </li>
                <li>
                  <span style={{ color: "inherit" }}>
                    CRA EDI Canadian Tax Engine (13 Prov.)
                  </span>
                </li>
                <li>
                  <span style={{ color: "inherit" }}>
                    15% Ethiopian VAT & TIN Verification
                  </span>
                </li>
                <li>
                  <span style={{ color: "inherit" }}>
                    Canadian Payroll (CPP / EI / PPIP)
                  </span>
                </li>
                <li>
                  <span style={{ color: "inherit" }}>
                    Telebirr & CBE Birr Payment Rails
                  </span>
                </li>
                <li>
                  <Link href="/reports" style={{ color: "inherit", textDecoration: "none" }}>
                    P&L, Cash Flow & Balance Sheets
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Dialog Actions (About, FAQ, Contact) */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 12 }}>
                Resources & Help
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("about")}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: dark ? "#93c5fd" : "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <Info size={14} /> About BeyondERP
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("faq")}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: dark ? "#93c5fd" : "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <HelpCircle size={14} /> Frequently Asked Questions (FAQ)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("contact")}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: dark ? "#93c5fd" : "#2563eb",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <MessageSquare size={14} /> Contact Support & Sales
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("privacy")}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <ShieldCheck size={14} /> Security & PIPEDA Privacy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      color: "inherit",
                      fontSize: 13,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6
                    }}
                  >
                    <FileText size={14} /> Terms of Service
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Office Locations */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: dark ? "#f8fafc" : "#0f172a", marginBottom: 12 }}>
                Global Offices & Reach
              </div>
              <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <MapPin size={16} style={{ color: "#2563eb", flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <strong style={{ color: dark ? "#f8fafc" : "#0f172a", display: "block" }}>Addis Ababa Hub</strong>
                    <span>Bole Sub-City, Commercial Corridor, Ethiopia</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <MapPin size={16} style={{ color: "#2563eb", flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <strong style={{ color: dark ? "#f8fafc" : "#0f172a", display: "block" }}>North America Tech</strong>
                    <span>Bay Street Financial District, Toronto, ON, Canada</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                  <Mail size={15} style={{ color: "#2563eb" }} />
                  <a href="mailto:support@beyonderp.com" style={{ color: "inherit", textDecoration: "none" }}>
                    support@beyonderp.com
                  </a>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Phone size={15} style={{ color: "#2563eb" }} />
                  <span>+1 (416) 555-0199 · +251 911 00 22 33</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & QUICK ACTIONS BAR */}
          <div
            style={{
              paddingTop: 24,
              borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              fontSize: 12
            }}
          >
            <div>
              © 2026 <strong>BeyondERP Inc.</strong> Built for modern commerce across Africa & North America.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <button
                type="button"
                onClick={() => router.push(inApp ? "/dashboard" : "/login")}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: dark ? "#93c5fd" : "#2563eb",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {inApp ? "Dashboard" : "Operator Sign In"}
              </button>

              <span>·</span>

              <button
                type="button"
                onClick={() => router.push("/register")}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  color: "inherit",
                  cursor: "pointer"
                }}
              >
                Start Free Trial
              </button>

              <span>·</span>

              <button
                type="button"
                onClick={scrollToTop}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: dark ? "#1e293b" : "#e2e8f0",
                  border: "none",
                  borderRadius: 6,
                  padding: "4px 8px",
                  color: dark ? "#e2e8f0" : "#1e293b",
                  fontWeight: 600,
                  fontSize: 11,
                  cursor: "pointer"
                }}
                aria-label="Scroll to top"
              >
                Top <ArrowUp size={12} />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* ================= MODAL: ABOUT US ================= */}
      <Modal
        title="About BeyondERP"
        isOpen={activeModal === "about"}
        onClose={() => setActiveModal(null)}
        maxWidth={620}
      >
        <div style={{ padding: "0 20px 24px", color: dark ? "#cbd5e1" : "#334155", fontSize: 14, lineHeight: 1.7 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
            <img
              src="/logo.png"
              alt="BeyondERP"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
                flexShrink: 0
              }}
            />
            <div>
              <h3 style={{ margin: 0, fontSize: 18, color: dark ? "#f8fafc" : "#0f172a" }}>Enterprise Resource Planning for the Modern World</h3>
              <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 700 }}>Mobile-First · Offline-Resilient · Multi-Jurisdiction</span>
            </div>
          </div>

          <p>
            <strong>BeyondERP</strong> was born from a fundamental realization: modern businesses in emerging and high-growth markets need enterprise software that works where they do—on shop floors, rural agricultural co-ops, busy clinics, construction sites, and corporate headquarters.
          </p>

          <h4 style={{ margin: "18px 0 8px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
            <Layers size={16} style={{ color: "#2563eb" }} /> Key Architectural Pillars
          </h4>
          <ul style={{ paddingLeft: 20, margin: 0, display: "grid", gap: 8 }}>
            <li>
              <strong>12 Industry-Specific Engines:</strong> Rather than generic forms, BeyondERP includes pre-engineered workflows for Retail POS, Farm Cycles, Healthcare EHR, School Tuition, Fleet Logs, and Construction BOQs.
            </li>
            <li>
              <strong>Offline-First Synchronization:</strong> Built with Service Workers and IndexedDB sync queues so operators can process sales and updates even during full network blackouts.
            </li>
            <li>
              <strong>Dual Market Compliance:</strong> Full Canadian CRA EDI tax reporting (HST/GST/PST across all 13 provinces) paired with Ethiopian 15% VAT, 10-digit TIN, and Meskerem-Pagume calendar handling.
            </li>
            <li>
              <strong>AI Copilot Integration:</strong> Google Gemini 2.5 Flash powers real-time ledger querying, inventory alerts, and conversational transaction logging.
            </li>
          </ul>

          <div
            style={{
              marginTop: 20,
              padding: 14,
              borderRadius: 10,
              background: dark ? "rgba(37,99,235,0.12)" : "#eff6ff",
              border: `1px solid ${dark ? "rgba(37,99,235,0.3)" : "#bfdbfe"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12
            }}
          >
            <div>
              <strong style={{ display: "block", color: dark ? "#93c5fd" : "#1e40af" }}>Ready to transform your business operations?</strong>
              <span style={{ fontSize: 12 }}>Deploy in cloud or on your own Docker servers today.</span>
            </div>
            <button
              type="button"
              onClick={() => { setActiveModal(null); router.push("/register"); }}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 14px",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL: FAQ ================= */}
      <Modal
        title="Frequently Asked Questions (FAQ)"
        isOpen={activeModal === "faq"}
        onClose={() => setActiveModal(null)}
        maxWidth={680}
      >
        <div style={{ padding: "0 20px 24px" }}>
          {/* Category Tabs */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
            {["All", "General", "Offline & PWA", "Tax & Compliance", "Payments", "AI & Automation", "Security"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFaqCategory(cat)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: faqCategory === cat ? "#2563eb" : dark ? "#1e293b" : "#f1f5f9",
                  color: faqCategory === cat ? "white" : dark ? "#94a3b8" : "#475569",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion Items */}
          <div style={{ display: "grid", gap: 10 }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={faq.q}
                  style={{
                    borderRadius: 10,
                    border: `1px solid ${dark ? "#233348" : "#e2e8f0"}`,
                    background: dark ? "#0d1525" : "#ffffff",
                    overflow: "hidden",
                    transition: "border 0.15s ease"
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    style={{
                      width: "100%",
                      padding: "14px 16px",
                      background: "transparent",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      cursor: "pointer",
                      textAlign: "left",
                      color: dark ? "#f8fafc" : "#0f172a",
                      fontSize: 14,
                      fontWeight: 700
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0)",
                        transition: "transform 0.2s ease",
                        color: "#2563eb",
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen ? (
                    <div
                      style={{
                        padding: "0 16px 14px",
                        color: dark ? "#94a3b8" : "#475569",
                        fontSize: 13,
                        lineHeight: 1.6,
                        borderTop: `1px solid ${dark ? "rgba(255,255,255,0.04)" : "#f1f5f9"}`
                      }}
                    >
                      {faq.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: dark ? "#94a3b8" : "#64748b" }}>
            Have a question not listed here?{" "}
            <button
              type="button"
              onClick={() => setActiveModal("contact")}
              style={{
                background: "transparent",
                border: "none",
                color: "#2563eb",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0
              }}
            >
              Speak with our engineering team
            </button>
          </div>
        </div>
      </Modal>

      {/* ================= MODAL: CONTACT US ================= */}
      <Modal
        title="Contact BeyondERP Support & Sales"
        isOpen={activeModal === "contact"}
        onClose={() => setActiveModal(null)}
        maxWidth={560}
      >
        <div style={{ padding: "0 20px 24px" }}>
          {contactSubmitted ? (
            <div style={{ textAlign: "center", padding: "28px 12px" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px"
                }}
              >
                <CheckCircle2 size={32} />
              </div>
              <h3 style={{ margin: "0 0 8px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 18 }}>Message Dispatched!</h3>
              <p style={{ margin: 0, fontSize: 13, color: dark ? "#94a3b8" : "#64748b" }}>
                Our enterprise advisory team will respond to <strong>{contactForm.email}</strong> within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: dark ? "#94a3b8" : "#64748b" }}>
                Need help with deployment, Canadian/Ethiopian tax rules, or custom sector workflows? Leave a note below.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: dark ? "#f8fafc" : "#0f172a" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="e.g. Marc Bouchard"
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 8,
                      border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                      background: dark ? "#0d1527" : "#ffffff",
                      color: dark ? "#f8fafc" : "#0f172a",
                      padding: "0 10px",
                      fontSize: 13,
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: dark ? "#f8fafc" : "#0f172a" }}>
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="m.bouchard@company.ca"
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 8,
                      border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                      background: dark ? "#0d1527" : "#ffffff",
                      color: dark ? "#f8fafc" : "#0f172a",
                      padding: "0 10px",
                      fontSize: 13,
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: dark ? "#f8fafc" : "#0f172a" }}>
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                    placeholder="e.g. Toronto Health Clinics"
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 8,
                      border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                      background: dark ? "#0d1527" : "#ffffff",
                      color: dark ? "#f8fafc" : "#0f172a",
                      padding: "0 10px",
                      fontSize: 13,
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: dark ? "#f8fafc" : "#0f172a" }}>
                    Primary Sector
                  </label>
                  <select
                    value={contactForm.sector}
                    onChange={(e) => setContactForm({ ...contactForm, sector: e.target.value })}
                    style={{
                      width: "100%",
                      height: 38,
                      borderRadius: 8,
                      border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                      background: dark ? "#0d1527" : "#ffffff",
                      color: dark ? "#f8fafc" : "#0f172a",
                      padding: "0 10px",
                      fontSize: 13,
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="retail-trading">Retail & Trading</option>
                    <option value="healthcare">Healthcare & Clinical</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="construction">Construction</option>
                    <option value="transport-logistics">Transport & Logistics</option>
                    <option value="other">Other / Multi-Sector</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 4, color: dark ? "#f8fafc" : "#0f172a" }}>
                  How can we help? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="Tell us about your requirements, user seats, and deployment preference..."
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: `1px solid ${dark ? "#26354a" : "#cbd5e1"}`,
                    background: dark ? "#0d1527" : "#ffffff",
                    color: dark ? "#f8fafc" : "#0f172a",
                    padding: "8px 10px",
                    fontSize: 13,
                    boxSizing: "border-box",
                    resize: "vertical"
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 11, color: dark ? "#94a3b8" : "#64748b" }}>
                  Direct line: <strong>+1 (416) 555-0199</strong>
                </div>
                <button
                  type="submit"
                  style={{
                    height: 40,
                    padding: "0 18px",
                    borderRadius: 8,
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  Send Inquiry <Send size={14} />
                </button>
              </div>
            </form>
          )}
        </div>
      </Modal>

      {/* ================= MODAL: PRIVACY & COMPLIANCE ================= */}
      <Modal
        title="Security & PIPEDA Privacy Policy"
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
        maxWidth={620}
      >
        <div style={{ padding: "0 20px 24px", color: dark ? "#cbd5e1" : "#334155", fontSize: 13, lineHeight: 1.7 }}>
          <p>
            BeyondERP is committed to enterprise data confidentiality, integrity, and sovereignty under Canadian (PIPEDA), Ethiopian, and international privacy standards.
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>1. Data Storage & Residency</h4>
          <p>
            Tenant records are isolated with strict multi-tenant boundaries. Customers may elect for Canadian domestic hosting or sovereign on-premise deployment via Docker to meet institutional compliance requirements.
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>2. Offline Queue Encryption</h4>
          <p>
            Locally stored mutations on offline mobile devices use hardware-accelerated AES-256 local storage encryption and are automatically purged upon successful synchronization.
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>3. No Data Selling or Third-Party Scraping</h4>
          <p>
            Your ledger entries, customer lists, and financial ratios are never shared, sold, or used to train public LLM models.
          </p>
        </div>
      </Modal>

      {/* ================= MODAL: TERMS OF SERVICE ================= */}
      <Modal
        title="Terms of Service"
        isOpen={activeModal === "terms"}
        onClose={() => setActiveModal(null)}
        maxWidth={620}
      >
        <div style={{ padding: "0 20px 24px", color: dark ? "#cbd5e1" : "#334155", fontSize: 13, lineHeight: 1.7 }}>
          <p>
            By accessing or operating the BeyondERP software suite, you agree to these operational terms:
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>1. Permitted Use</h4>
          <p>
            BeyondERP grants authorized commercial organizations non-exclusive licenses to execute financial calculations, invoice generation, customer relationship management, and sector-specific operations.
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>2. Fiscal Filing Responsibility</h4>
          <p>
            While BeyondERP automatically generates CRA EDI GST34 schedules and computes 15% VAT, each enterprise remains responsible for officially submitting statutory returns to their respective revenue agencies.
          </p>
          <h4 style={{ margin: "14px 0 6px", color: dark ? "#f8fafc" : "#0f172a", fontSize: 14 }}>3. Service Availability</h4>
          <p>
            Cloud instances maintain a 99.9% uptime SLA, supported by client-side offline caching to ensure zero disruption during intermittent network outages.
          </p>
        </div>
      </Modal>
    </>
  );
}
