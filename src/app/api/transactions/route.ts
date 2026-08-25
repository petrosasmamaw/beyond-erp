import { NextResponse, NextRequest } from "next/server";
import { db } from "../db";
import type { Transaction } from "@/lib/types";

export async function GET(req: NextRequest) {
  db.logAudit("READ_TRANSACTIONS", "GET", "/api/transactions", req);

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "ALL";
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const sectorId = searchParams.get("sectorId") ?? "";

  let list = [...db.transactions];

  if (type !== "ALL") {
    list = list.filter((t) => t.type === type);
  }
  if (sectorId) {
    list = list.filter((t) => t.sectorId === sectorId);
  }
  if (q) {
    list = list.filter((t) => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
  }

  const total = list.length;
  const start = (page - 1) * limit;
  const items = list.slice(start, start + limit);

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, amount, description, category, sectorId, paymentMethod, vatAmount, status } = body;

    if (!type || typeof amount !== "number" || !description) {
      return NextResponse.json({ message: "Type, amount, and description are required" }, { status: 400 });
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      amount,
      description,
      category: category ?? "General",
      sectorId: sectorId ?? db.settings.companySectorId,
      paymentMethod: paymentMethod ?? "Bank Transfer",
      vatAmount: vatAmount ?? amount * 0.15,
      status: status ?? "COMPLETED",
      synced: true,
      occurredAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    db.transactions.unshift(newTx);
    db.logAudit("CREATE_TRANSACTION", "POST", "/api/transactions", req);

    return NextResponse.json(newTx, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Failed to create transaction" }, { status: 500 });
  }
}
