"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/contexts/AppContext";
import { useTheme } from "@/contexts/ThemeContext";
import { sectorDefinitions } from "@/features/erp/config";
import { 
  Users, Building2, Phone, Mail, Plus, Search, Filter, 
  TrendingUp, CheckCircle2, Clock, XCircle, ArrowRight, DollarSign, Calendar, MessageSquare, Briefcase, Award 
} from "lucide-react";

type PipelineStage = "PROSPECT" | "CONTACTED" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";
type Priority = "LOW" | "MEDIUM" | "HIGH";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  sectorId: string;
  dealValue: number;
  stage: PipelineStage;
  priority: Priority;
  lastContactDate: string;
  notes: string;
}

interface Interaction {
  id: string;
  leadId: string;
  leadName: string;
  type: "Call" | "Email" | "Meeting" | "Demo" | "Site Visit";
  date: string;
  summary: string;
  outcome: string;
}

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: "PROSPECT", label: "Prospecting", color: "#64748b" },
  { key: "CONTACTED", label: "Contacted", color: "#3b82f6" },
  { key: "PROPOSAL", label: "Proposal Sent", color: "#8b5cf6" },
  { key: "NEGOTIATION", label: "Negotiation", color: "#f59e0b" },
  { key: "WON", label: "Closed Won", color: "#10b981" },
  { key: "LOST", label: "Closed Lost", color: "#ef4444" },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Marc Bouchard",
    company: "Montreal Logistics Hub",
    email: "m.bouchard@mtllogistics.ca",
    phone: "+1 (514) 882-3921",
    sectorId: "transport-logistics",
    dealValue: 45000,
    stage: "NEGOTIATION",
    priority: "HIGH",
    lastContactDate: "2026-08-22",
    notes: "Discussed custom fleet tracking and bilingual dispatch integrations."
  },
  {
    id: "lead-2",
    name: "Dr. Sarah Jenkins",
    company: "Vancouver Health Clinic",
    email: "s.jenkins@vancouverhealth.org",
    phone: "+1 (604) 555-1982",
    sectorId: "healthcare",
    dealValue: 28000,
    stage: "PROPOSAL",
    priority: "HIGH",
    lastContactDate: "2026-08-23",
    notes: "Sent patient billing and insurance claim reconciliation proposal."
  },
  {
    id: "lead-3",
    name: "Jean-Luc Picard",
    company: "Quebec Agri-Tech Co.",
    email: "jl.picard@agriquebec.ca",
    phone: "+1 (418) 771-4902",
    sectorId: "agriculture",
    dealValue: 62000,
    stage: "CONTACTED",
    priority: "MEDIUM",
    lastContactDate: "2026-08-20",
    notes: "Interested in crop cycle tracking and harvest yield forecasting modules."
  },
  {
    id: "lead-4",
    name: "Emily Vance",
    company: "Toronto Retail Group",
    email: "evance@torontoretail.ca",
    phone: "+1 (416) 332-9011",
    sectorId: "retail-trading",
    dealValue: 18500,
    stage: "WON",
    priority: "HIGH",
    lastContactDate: "2026-08-24",
    notes: "Contract signed for 5 POS terminals and inventory sync."
  },
  {
    id: "lead-5",
    name: "David Chen",
    company: "Pacific Construct Corp",
    email: "d.chen@pacificconstruct.ca",
    phone: "+1 (604) 991-2244",
    sectorId: "construction",
    dealValue: 95000,
    stage: "PROSPECT",
    priority: "MEDIUM",
    lastContactDate: "2026-08-19",
    notes: "Initial outreach regarding sub-contractor payroll and milestone billing."
  }
];

const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: "int-1",
    leadId: "lead-1",
    leadName: "Marc Bouchard",
    type: "Meeting",
    date: "2026-08-22",
    summary: "Zoom call with executive team",
    outcome: "Agreed on pricing structure; preparing final contract."
  },
  {
    id: "int-2",
    leadId: "lead-2",
    leadName: "Dr. Sarah Jenkins",
    type: "Email",
    date: "2026-08-23",
    summary: "Sent CAD quotation and SLA document",
    outcome: "Awaiting board review."
  },
  {
    id: "int-3",
    leadId: "lead-4",
    leadName: "Emily Vance",
    type: "Demo",
    date: "2026-08-24",
    summary: "Live POS checkout & barcode walkthrough",
    outcome: "Closed Won! Onboarding scheduled."
  }
];

export default function CRMPage() {
  const { showToast } = useApp();
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [interactions, setInteractions] = useState<Interaction[]>(INITIAL_INTERACTIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedStage, setSelectedStage] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"pipeline" | "leads" | "interactions">("pipeline");

  // Modals
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showInteractionModal, setShowInteractionModal] = useState(false);

  // New lead form
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    sectorId: "retail-trading",
    dealValue: "10000",
    stage: "PROSPECT" as PipelineStage,
    priority: "MEDIUM" as Priority,
    notes: ""
  });

  // New interaction form
  const [newInt, setNewInt] = useState({
    leadId: INITIAL_LEADS[0].id,
    type: "Call" as Interaction["type"],
    summary: "",
    outcome: ""
  });

  // Theme colors
  const bg = dark ? "#0b1120" : "#f8fafc";
  const surface = dark ? "#111c2e" : "#ffffff";
  const border = dark ? "#1e293b" : "#e2e8f0";
  const text = dark ? "#f1f5f9" : "#0f172a";
  const muted = dark ? "#94a3b8" : "#64748b";

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSector = selectedSector === "ALL" || l.sectorId === selectedSector;
      const matchStage = selectedStage === "ALL" || l.stage === selectedStage;
      return matchSearch && matchSector && matchStage;
    });
  }, [leads, searchQuery, selectedSector, selectedStage]);

  // Stats
  const totalPipelineValue = useMemo(() => leads.filter(l => l.stage !== "LOST" && l.stage !== "WON").reduce((sum, l) => sum + l.dealValue, 0), [leads]);
  const totalWonValue = useMemo(() => leads.filter(l => l.stage === "WON").reduce((sum, l) => sum + l.dealValue, 0), [leads]);
  const activeLeadsCount = useMemo(() => leads.filter(l => l.stage !== "LOST" && l.stage !== "WON").length, [leads]);
  const wonLeadsCount = useMemo(() => leads.filter(l => l.stage === "WON").length, [leads]);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.company) {
      showToast("Please enter lead name and company");
      return;
    }
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLead.name,
      company: newLead.company,
      email: newLead.email || "contact@company.ca",
      phone: newLead.phone || "+1 (416) 555-0192",
      sectorId: newLead.sectorId,
      dealValue: parseFloat(newLead.dealValue) || 10000,
      stage: newLead.stage,
      priority: newLead.priority,
      lastContactDate: new Date().toISOString().split("T")[0],
      notes: newLead.notes
    };
    setLeads([lead, ...leads]);
    setShowLeadModal(false);
    setNewLead({ name: "", company: "", email: "", phone: "", sectorId: "retail-trading", dealValue: "10000", stage: "PROSPECT", priority: "MEDIUM", notes: "" });
    showToast(`Lead "${lead.name}" added successfully.`);
  };

  const handleCreateInteraction = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find(l => l.id === newInt.leadId);
    if (!lead || !newInt.summary) {
      showToast("Please select a lead and provide summary");
      return;
    }
    const interaction: Interaction = {
      id: `int-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      type: newInt.type,
      date: new Date().toISOString().split("T")[0],
      summary: newInt.summary,
      outcome: newInt.outcome || "Follow-up scheduled"
    };
    setInteractions([interaction, ...interactions]);
    setShowInteractionModal(false);
    setNewInt({ leadId: leads[0]?.id || "", type: "Call", summary: "", outcome: "" });
    showToast("Interaction logged successfully.");
  };

  const moveStage = (leadId: string, direction: "next" | "prev") => {
    const stageOrder: PipelineStage[] = ["PROSPECT", "CONTACTED", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
    setLeads(leads.map(l => {
      if (l.id !== leadId) return l;
      const idx = stageOrder.indexOf(l.stage);
      let newIdx = direction === "next" ? idx + 1 : idx - 1;
      if (newIdx < 0) newIdx = 0;
      if (newIdx >= stageOrder.length) newIdx = stageOrder.length - 1;
      return { ...l, stage: stageOrder[newIdx] };
    }));
  };

  return (
    <div style={{ padding: 24, background: bg, minHeight: "100vh", color: text, boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Customer Relationship Management (CRM)</h1>
          <p style={{ fontSize: 13, color: muted, margin: 0 }}>Track customer leads, sales pipeline stages, and interactions across all 12 enterprise sectors.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowInteractionModal(true)}
            style={{
              padding: "9px 14px", borderRadius: 9, background: surface, border: `1px solid ${border}`,
              color: text, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7
            }}
          >
            <MessageSquare size={14} /> Log Interaction
          </button>
          <button
            onClick={() => setShowLeadModal(true)}
            style={{
              padding: "9px 16px", borderRadius: 9, background: "#2563eb", border: 0,
              color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 7
            }}
          >
            <Plus size={15} /> Add New Lead
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase" }}>Active Pipeline</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb18", color: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: text }}>CAD {totalPipelineValue.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{activeLeadsCount} active opportunities in progress</div>
        </div>

        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase" }}>Won Deals Revenue</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#10b98118", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={16} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: text }}>CAD {totalWonValue.toLocaleString()}</div>
          <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginTop: 4 }}>{wonLeadsCount} closed won accounts</div>
        </div>

        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase" }}>Total Leads Tracked</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#8b5cf618", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: text }}>{leads.length}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>Across all 12 sectors</div>
        </div>

        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: muted, textTransform: "uppercase" }}>Interactions Logged</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f59e0b18", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <MessageSquare size={16} />
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: text }}>{interactions.length}</div>
          <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>Calls, emails, meetings & demos</div>
        </div>
      </div>

      {/* Tabs & Filters bar */}
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 16, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 6, background: bg, padding: 4, borderRadius: 10, border: `1px solid ${border}` }}>
            <button
              onClick={() => setActiveTab("pipeline")}
              style={{
                padding: "7px 14px", borderRadius: 8, border: 0,
                background: activeTab === "pipeline" ? "#2563eb" : "transparent",
                color: activeTab === "pipeline" ? "#fff" : text,
                fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              style={{
                padding: "7px 14px", borderRadius: 8, border: 0,
                background: activeTab === "leads" ? "#2563eb" : "transparent",
                color: activeTab === "leads" ? "#fff" : text,
                fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}
            >
              Leads Table ({filteredLeads.length})
            </button>
            <button
              onClick={() => setActiveTab("interactions")}
              style={{
                padding: "7px 14px", borderRadius: 8, border: 0,
                background: activeTab === "interactions" ? "#2563eb" : "transparent",
                color: activeTab === "interactions" ? "#fff" : text,
                fontSize: 12, fontWeight: 700, cursor: "pointer"
              }}
            >
              Interactions Log ({interactions.length})
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: muted }} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: 36, width: 200, borderRadius: 8, border: `1px solid ${border}`,
                  background: bg, padding: "0 10px 0 32px", color: text, fontSize: 13, outline: "none"
                }}
              />
            </div>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                height: 36, borderRadius: 8, border: `1px solid ${border}`,
                background: bg, padding: "0 10px", color: text, fontSize: 13, outline: "none"
              }}
            >
              <option value="ALL">All 12 Sectors</option>
              {sectorDefinitions.map((sec) => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PIPELINE KANBAN VIEW */}
        {activeTab === "pipeline" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, overflowX: "auto", paddingBottom: 8 }}>
            {STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.key);
              const stageTotal = stageLeads.reduce((sum, l) => sum + l.dealValue, 0);

              return (
                <div key={stage.key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: stage.color }} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{stage.label}</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, background: surface, padding: "2px 7px", borderRadius: 6, border: `1px solid ${border}`, color: muted }}>
                      {stageLeads.length}
                    </span>
                  </div>

                  <div style={{ fontSize: 11, color: muted, fontWeight: 600 }}>
                    Value: CAD {stageTotal.toLocaleString()}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 200 }}>
                    {stageLeads.map((lead) => {
                      const secDef = sectorDefinitions.find(s => s.id === lead.sectorId);
                      return (
                        <div key={lead.id} style={{ background: surface, border: `1px solid ${border}`, borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{lead.name}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: lead.priority === "HIGH" ? "#ef444422" : "#f59e0b22", color: lead.priority === "HIGH" ? "#ef4444" : "#f59e0b" }}>
                              {lead.priority}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: muted, display: "flex", alignItems: "center", gap: 5 }}>
                            <Building2 size={12} /> {lead.company}
                          </div>
                          <div style={{ fontSize: 11, color: "#2563eb", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                            <DollarSign size={12} /> {lead.dealValue.toLocaleString()} CAD
                          </div>
                          {secDef && (
                            <div style={{ fontSize: 10, color: secDef.color, background: secDef.tint, padding: "2px 6px", borderRadius: 4, display: "inline-block", alignSelf: "flex-start", fontWeight: 600 }}>
                              {secDef.shortName}
                            </div>
                          )}
                          <p style={{ fontSize: 11, color: muted, margin: "4px 0", lineHeight: 1.3 }}>{lead.notes}</p>
                          
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${border}`, paddingTop: 6, marginTop: 4 }}>
                            <span style={{ fontSize: 10, color: muted }}>{lead.lastContactDate}</span>
                            <div style={{ display: "flex", gap: 4 }}>
                              {stage.key !== "PROSPECT" && (
                                <button onClick={() => moveStage(lead.id, "prev")} title="Move Back" style={{ background: bg, border: `1px solid ${border}`, borderRadius: 4, padding: "2px 6px", fontSize: 10, cursor: "pointer", color: text }}>
                                  ←
                                </button>
                              )}
                              {stage.key !== "WON" && stage.key !== "LOST" && (
                                <button onClick={() => moveStage(lead.id, "next")} title="Advance Stage" style={{ background: "#2563eb", border: 0, borderRadius: 4, padding: "2px 6px", fontSize: 10, cursor: "pointer", color: "#fff", fontWeight: 700 }}>
                                  →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {stageLeads.length === 0 && (
                      <div style={{ textAlign: "center", padding: "24px 0", fontSize: 12, color: muted, fontStyle: "italic" }}>
                        No leads in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LEADS TABLE VIEW */}
        {activeTab === "leads" && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${border}`, color: muted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th style={{ padding: "10px 12px" }}>Lead / Contact</th>
                  <th style={{ padding: "10px 12px" }}>Company</th>
                  <th style={{ padding: "10px 12px" }}>Sector</th>
                  <th style={{ padding: "10px 12px" }}>Deal Value (CAD)</th>
                  <th style={{ padding: "10px 12px" }}>Stage</th>
                  <th style={{ padding: "10px 12px" }}>Priority</th>
                  <th style={{ padding: "10px 12px" }}>Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const secDef = sectorDefinitions.find(s => s.id === lead.sectorId);
                  const stageObj = STAGES.find(s => s.key === lead.stage);
                  return (
                    <tr key={lead.id} style={{ borderBottom: `1px solid ${border}` }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: 700, color: text }}>{lead.name}</div>
                        <div style={{ fontSize: 11, color: muted }}>{lead.email} · {lead.phone}</div>
                      </td>
                      <td style={{ padding: "12px", fontWeight: 600, color: text }}>{lead.company}</td>
                      <td style={{ padding: "12px" }}>
                        {secDef ? (
                          <span style={{ fontSize: 11, fontWeight: 600, color: secDef.color, background: secDef.tint, padding: "3px 8px", borderRadius: 6 }}>
                            {secDef.shortName}
                          </span>
                        ) : lead.sectorId}
                      </td>
                      <td style={{ padding: "12px", fontWeight: 700, color: "#2563eb" }}>
                        CAD {lead.dealValue.toLocaleString()}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, background: `${stageObj?.color || "#64748b"}22`, color: stageObj?.color || "#64748b" }}>
                          {stageObj?.label || lead.stage}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: lead.priority === "HIGH" ? "#ef4444" : "#f59e0b" }}>
                          {lead.priority}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontSize: 12, color: muted }}>{lead.lastContactDate}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* INTERACTIONS LOG VIEW */}
        {activeTab === "interactions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {interactions.map((int) => (
              <div key={int.id} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6, background: "#2563eb22", color: "#2563eb" }}>
                      {int.type}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: text }}>{int.leadName}</span>
                    <span style={{ fontSize: 11, color: muted }}>· {int.date}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 4 }}>{int.summary}</div>
                  <div style={{ fontSize: 12, color: muted }}>Outcome: {int.outcome}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD LEAD MODAL */}
      {showLeadModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, width: "100%", maxWidth: 500, padding: 24, boxSizing: "border-box" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px", color: text }}>Add New Customer Lead</h2>
            <form onSubmit={handleCreateLead} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Contact Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jean Dupont"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  />
                </label>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Company Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Montreal Logistics"
                    value={newLead.company}
                    onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Email
                  <input
                    type="email"
                    placeholder="jean@company.ca"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  />
                </label>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Phone
                  <input
                    type="text"
                    placeholder="+1 (514) ..."
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Sector
                  <select
                    value={newLead.sectorId}
                    onChange={(e) => setNewLead({ ...newLead, sectorId: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  >
                    {sectorDefinitions.map(sec => (
                      <option key={sec.id} value={sec.id}>{sec.name}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Deal Value (CAD)
                  <input
                    type="number"
                    min="0"
                    value={newLead.dealValue}
                    onChange={(e) => setNewLead({ ...newLead, dealValue: e.target.value })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Pipeline Stage
                  <select
                    value={newLead.stage}
                    onChange={(e) => setNewLead({ ...newLead, stage: e.target.value as PipelineStage })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  >
                    {STAGES.map(s => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </label>
                <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                  Priority
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value as Priority })}
                    style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </label>
              </div>

              <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                Notes / Requirements
                <textarea
                  rows={3}
                  placeholder="Lead details, requirements, or next steps..."
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  style={{ width: "100%", borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "8px 10px", color: text, marginTop: 4, boxSizing: "border-box", resize: "vertical" }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${border}`, background: surface, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG INTERACTION MODAL */}
      {showInteractionModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
          <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, width: "100%", maxWidth: 460, padding: 24, boxSizing: "border-box" }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: "0 0 16px", color: text }}>Log Interaction</h2>
            <form onSubmit={handleCreateInteraction} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                Select Lead *
                <select
                  value={newInt.leadId}
                  onChange={(e) => setNewInt({ ...newInt, leadId: e.target.value })}
                  style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                >
                  {leads.map(l => (
                    <option key={l.id} value={l.id}>{l.name} ({l.company})</option>
                  ))}
                </select>
              </label>

              <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                Interaction Type
                <select
                  value={newInt.type}
                  onChange={(e) => setNewInt({ ...newInt, type: e.target.value as Interaction["type"] })}
                  style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Demo">Demo</option>
                  <option value="Site Visit">Site Visit</option>
                </select>
              </label>

              <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                Summary / Discussion *
                <input
                  type="text"
                  required
                  placeholder="e.g. Reviewed pricing & deployment schedule"
                  value={newInt.summary}
                  onChange={(e) => setNewInt({ ...newInt, summary: e.target.value })}
                  style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                />
              </label>

              <label style={{ fontSize: 12, fontWeight: 600, color: muted }}>
                Outcome / Next Steps
                <input
                  type="text"
                  placeholder="e.g. Follow up next Tuesday"
                  value={newInt.outcome}
                  onChange={(e) => setNewInt({ ...newInt, outcome: e.target.value })}
                  style={{ width: "100%", height: 36, borderRadius: 8, border: `1px solid ${border}`, background: bg, padding: "0 10px", color: text, marginTop: 4, boxSizing: "border-box" }}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowInteractionModal(false)}
                  style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${border}`, background: surface, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: "8px 16px", borderRadius: 8, border: 0, background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                >
                  Save Interaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
