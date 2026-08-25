import { NextResponse, NextRequest } from "next/server";
import { db } from "../db";

export async function GET(req: NextRequest) {
  db.logAudit("READ_SECTORS", "GET", "/api/sectors", req);

  const sectors = [
    {
      id: "retail-trading",
      name: "Retail & Trading",
      icon: "ShoppingCart",
      color: "blue",
      lightColor: "#eff6ff",
      textColor: "#1d4ed8",
      description: "Point of sale, inventory tracking, POS terminals, and multi-branch retail operations.",
      features: ["Inventory", "POS", "Suppliers", "Invoices", "Reports"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "manufacturing",
      name: "Manufacturing & Production",
      icon: "Factory",
      color: "amber",
      lightColor: "#fffbeb",
      textColor: "#b45309",
      description: "BOM management, production work orders, raw material stocks, and factory output quality control.",
      features: ["BOM", "Work Orders", "Quality Control", "Suppliers", "Equipment"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "healthcare",
      name: "Healthcare & Clinics",
      icon: "HeartPulse",
      color: "emerald",
      lightColor: "#ecfdf5",
      textColor: "#047857",
      description: "Patient electronic records, pharmaceutical inventory, appointment scheduling, and billing.",
      features: ["Patients", "Pharmacy", "Appointments", "Billing", "Staff Rosters"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "finance-banking",
      name: "Finance & Banking",
      icon: "Landmark",
      color: "indigo",
      lightColor: "#eef2ff",
      textColor: "#4338ca",
      description: "General ledger, loan portfolios, compliance reporting, and multi-currency treasury management.",
      features: ["General Ledger", "Loans", "Compliance", "Treasury", "Audits"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "transport-logistics",
      name: "Transport & Logistics",
      icon: "Truck",
      color: "violet",
      lightColor: "#f5f3ff",
      textColor: "#6d28d9",
      description: "Fleet management, dispatch routing, fuel logs, and cross-border transport tracking.",
      features: ["Fleet", "Dispatch", "Fuel Logs", "Waybills", "Maintenance"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "construction",
      name: "Construction & Engineering",
      icon: "HardHat",
      color: "orange",
      lightColor: "#fff7ed",
      textColor: "#c2410c",
      description: "Project milestones, subcontractor billing, equipment allocation, and site safety logs.",
      features: ["Projects", "Subcontractors", "Equipment", "Safety Logs", "Materials"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "agriculture",
      name: "Agriculture & Agribusiness",
      icon: "Sprout",
      color: "green",
      lightColor: "#f0fdf4",
      textColor: "#15803d",
      description: "Crop yield tracking, livestock management, commodity supply chain, and export compliance.",
      features: ["Crops", "Livestock", "Supply Chain", "Exports", "Weather Logs"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "real-estate",
      name: "Real Estate & Property",
      icon: "Building2",
      color: "teal",
      lightColor: "#f0fdfa",
      textColor: "#0f766e",
      description: "Property leasing, tenant management, maintenance ticketing, and portfolio financials.",
      features: ["Properties", "Leases", "Maintenance", "Rent Collection", "Tenants"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "education",
      name: "Education & Schools",
      icon: "GraduationCap",
      color: "cyan",
      lightColor: "#ecfeff",
      textColor: "#0e7490",
      description: "Student admissions, tuition billing, attendance registers, and academic transcripts.",
      features: ["Students", "Tuition Billing", "Attendance", "Gradebook", "Courses"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "hospitality",
      name: "Hospitality & Tourism",
      icon: "Utensils",
      color: "rose",
      lightColor: "#fff1f2",
      textColor: "#be123c",
      description: "Hotel room bookings, restaurant point of sale, guest housekeeping, and tour itineraries.",
      features: ["Reservations", "POS", "Housekeeping", "Events", "Guest CRM"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "government-services",
      name: "Government & Public Services",
      icon: "ShieldCheck",
      color: "slate",
      lightColor: "#f8fafc",
      textColor: "#475569",
      description: "Public permit issuance, citizen registries, municipal asset tracking, and budget disbursement.",
      features: ["Permits", "Citizen Registry", "Assets", "Budgets", "Disbursements"],
      teamMembers: [],
      sectorRecords: []
    },
    {
      id: "ngo-development",
      name: "NGO & Development",
      icon: "Globe",
      color: "sky",
      lightColor: "#f0f9ff",
      textColor: "#0369a1",
      description: "Grant tracking, donor reporting, humanitarian field distribution, and impact metrics.",
      features: ["Grants", "Donors", "Field Distribution", "Impact Metrics", "Budgets"],
      teamMembers: [],
      sectorRecords: []
    }
  ];

  return NextResponse.json(sectors);
}
