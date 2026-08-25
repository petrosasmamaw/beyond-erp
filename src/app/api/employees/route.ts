import { NextResponse, NextRequest } from "next/server";
import { db } from "../db";
import type { Employee } from "@/lib/types";

export async function GET(req: NextRequest) {
  db.logAudit("READ_EMPLOYEES", "GET", "/api/employees", req);
  return NextResponse.json(db.employees);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, position, department, phone, email, salary, status, hiredDate } = body;

    if (!fullName || !position || typeof salary !== "number") {
      return NextResponse.json({ message: "Full name, position, and salary are required" }, { status: 400 });
    }

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      fullName,
      position,
      department: department ?? "General",
      phone: phone ?? "+251900000000",
      email: email ?? null,
      salary,
      status: status ?? "ACTIVE",
      hiredDate: hiredDate ?? new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString()
    };

    db.employees.unshift(newEmp);
    db.logAudit("CREATE_EMPLOYEE", "POST", "/api/employees", req);

    return NextResponse.json(newEmp, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Failed to create employee" }, { status: 500 });
  }
}
