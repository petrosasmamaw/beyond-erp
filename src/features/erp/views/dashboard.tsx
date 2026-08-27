"use client";

import { ArrowDownRight, ArrowUpRight, CreditCard, Plus, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Dashboard, Transaction } from "@/lib/types";
import { t, type SectorDefinition } from "../config";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export function DashboardView({
  dashboard,
  sector,
  isLoading,
  revenueChart,
  maxChart,
  language = "English",
}: {
  dashboard: Dashboard;
  sector: SectorDefinition;
  isLoading: boolean;
  revenueChart: number[];
  maxChart: number;
  language?: string;
}) {
  const { openTransactionModal, openTelebirrModal } = useApp();
  const { user } = useAuth();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const firstName = user?.fullName?.split(" ")[0] ?? "there";

  const surface  = dark ? "#111827" : "#ffffff";
  const alt      = dark ? "#0d1828" : "#f8fafc";
  const border   = dark ? "#1a2d3d" : "#e8edf5";
  const ink      = dark ? "#e2e8f0" : "#0f172a";
  const muted    = dark ? "#566070" : "#64748b";

  const kpis = [
    {
      label: "Revenue",
      value: formatCurrency(dashboard.stats.revenue),
      icon: "fa-solid fa-arrow-trend-up",
      color: "#10b981",
      bg:   dark ? "#071812" : "#f0fdf4",
      bdr:  dark ? "#0f2e1e" : "#bbf7d0",
      trend: "+12%", up: true,
    },
    {
      label: "Expenses",
      value: formatCurrency(dashboard.stats.expenses),
      icon: "fa-solid fa-receipt",
      color: "#f43f5e",
      bg:   dark ? "#1c0a10" : "#fff1f2",
      bdr:  dark ? "#3a1520" : "#fecdd3",
      trend: "+3%", up: false,
    },
    {
      label: "Net Profit",
      value: formatCurrency(Math.abs(dashboard.stats.netProfit)),
      icon: "fa-solid fa-wallet",
      color: dashboard.stats.netProfit >= 0 ? "#2563eb" : "#f43f5e",
      bg:   dark ? "#08121e" : "#eff6ff",
      bdr:  dark ? "#142338" : "#bfdbfe",
      trend: dashboard.stats.netProfit >= 0 ? "+8%" : "-8%",
      up: dashboard.stats.netProfit >= 0,
    },
    {
      label: "Pending Sync",
      value: String(dashboard.stats.pendingSync),
      icon: "fa-solid fa-rotate",
      color: "#f59e0b",
      bg:   dark ? "#150f02" : "#fffbeb",
      bdr:  dark ? "#2e2008" : "#fde68a",
      trend: null, up: true,
    },
  ];

  const topChart = Math.max(...revenueChart, 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

      {/* ── Page header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Overview
          </p>
          <h2 style={{ margin: "3px 0 0", fontSize: 21, fontWeight: 700, color: ink, lineHeight: 1.15 }}>
            Good to see you, {firstName}
          </h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Sector chip */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 11px", borderRadius: 8, border: `1px solid ${border}`, background: surface }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: `${sector.color}22`, color: sector.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
              <i className={sector.icon} />
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: ink }}>{sector.shortName}</span>
          </div>
          <button
            onClick={() => openTransactionModal()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            <Plus size={13} /> {t("addTransaction", language)}
          </button>
          <button
            onClick={() => openTransactionModal()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 8, border: `1.5px solid ${border}`, background: surface, color: ink, fontWeight: 600, fontSize: 13, cursor: "pointer" }}
          >
            <CreditCard size={13} color="#2563eb" /> Card Payment
          </button>
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 11 }} className="kpi-grid">
        {kpis.map((k) => (
          <div key={k.label} style={{ padding: "15px 16px", borderRadius: 12, border: `1px solid ${k.bdr}`, background: k.bg }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{k.label}</span>
              <div style={{ width: 27, height: 27, borderRadius: 7, background: `${k.color}18`, color: k.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>
                <i className={k.icon} />
              </div>
            </div>
            <div style={{ fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 800, color: ink, lineHeight: 1.1, marginBottom: 7 }}>
              {k.value}
            </div>
            {k.trend ? (
              <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11.5 }}>
                {k.up
                  ? <ArrowUpRight size={12} style={{ color: "#10b981" }} />
                  : <ArrowDownRight size={12} style={{ color: "#f43f5e" }} />}
                <span style={{ color: k.up ? "#10b981" : "#f43f5e", fontWeight: 700 }}>{k.trend}</span>
                <span style={{ color: muted }}>vs last month</span>
              </div>
            ) : (
              <span style={{ fontSize: 11.5, color: muted }}>queued offline</span>
            )}
          </div>
        ))}
      </div>


      {/* ── Chart + Sector tools ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 12 }} className="chart-tools-grid">

        {/* Revenue bar chart */}
        <div style={{ padding: "18px 20px", borderRadius: 12, border: `1px solid ${border}`, background: surface }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Revenue</p>
              <h3 style={{ margin: "3px 0 0", fontSize: 15, fontWeight: 700, color: ink }}>12-month overview</h3>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 6, background: dark ? "#0c1424" : "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 700 }}>
              <TrendingUp size={11} /> CAD
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 96 }}>
            {revenueChart.map((v, i) => {
              const pct = (v / topChart) * 100;
              const isLast = i === revenueChart.length - 1;
              const isMax = v === Math.max(...revenueChart);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5, height: "100%" }}>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div title={`${MONTHS[i]}: ${formatCurrency(v)}`} style={{
                      width: "100%",
                      height: `${Math.max(pct, 4)}%`,
                      borderRadius: "3px 3px 1px 1px",
                      background: (isLast || isMax)
                        ? "linear-gradient(180deg,#3b82f6,#2563eb)"
                        : dark ? "#1a2e4a" : "#dbeafe",
                      transition: "height 0.3s ease",
                    }} />
                  </div>
                  <span style={{ fontSize: 8.5, color: muted, fontWeight: 600 }}>{MONTHS[i]?.[0]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector tools panel */}
        <div style={{ padding: "16px", borderRadius: 12, border: `1px solid ${border}`, background: surface, display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>
            {sector.shortName} modules
          </p>
          {sector.features.slice(0, 5).map((f) => (
            <div key={f.title} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 9px", borderRadius: 8, background: alt, border: `1px solid ${border}` }}>
              <div style={{ width: 27, height: 27, borderRadius: 6, background: `${f.color}18`, color: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
                <i className={f.icon} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</div>
                <div style={{ fontSize: 10.5, color: muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
}
