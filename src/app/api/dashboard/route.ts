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
    companyName: db.settings.companyName,
    sectorId: db.settings.companySectorId ?? "retail-trading",
    currency: db.settings.currency,
    totalIncome,
    totalExpense,
    netBalance,
    employeeCount: db.employees.length,
    recentTransactions: db.transactions.slice(0, 10),
    activeUsersCount: db.users.length,
    complianceStatus: {
      pipedaCompliant: true,
      quebecLaw25Ready: true,
      dataRetentionYears: 6,
      lastAuditDate: new Date().toISOString()
    }
  });
}
