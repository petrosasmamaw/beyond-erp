import { NextResponse, NextRequest } from "next/server";
import { db } from "../db";

export async function GET(req: NextRequest) {
  db.logAudit("READ_DASHBOARD", "GET", "/api/dashboard", req);
  
  const totalIncome = db.transactions
    .filter((t) => t.type === "INCOME" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = db.transactions
    .filter((t) => t.type === "EXPENSE" && t.status === "COMPLETED")
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return NextResponse.json({
    stats: {
      revenue: totalIncome,
      expenses: totalExpense,
      netProfit: netBalance,
      pendingSync: 0,
      employeeCount: db.employees.length,
      sectorCount: 12
    },
    taxSummary: {
      taxableRevenue: totalIncome,
      vat: totalIncome * 0.15,
      withholding: totalIncome * 0.02,
      totalTaxLiability: totalIncome * 0.17
    },
    revenueChart: [35, 55, 40, 75, 60, 90, 70, 85, 65, 95, 80, 100],
    sectorBreakdown: [
      { sector: "Retail & Trading", amount: totalIncome * 0.4, percentage: 40 },
      { sector: "Finance & Banking", amount: totalIncome * 0.3, percentage: 30 },
      { sector: "Consulting", amount: totalIncome * 0.3, percentage: 30 }
    ],
    recentTransactions: db.transactions.slice(0, 10),
    companyName: db.settings.companyName,
    sectorId: db.settings.companySectorId ?? "retail-trading",
    currency: db.settings.currency,
    employeeCount: db.employees.length,
    activeUsersCount: db.users.length,
    complianceStatus: {
      pipedaCompliant: true,
      quebecLaw25Ready: true,
      dataRetentionYears: 6,
      lastAuditDate: new Date().toISOString()
    }
  });
}

