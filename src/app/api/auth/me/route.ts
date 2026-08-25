import { NextResponse, NextRequest } from "next/server";
import { db } from "../../db";

export async function GET(req: NextRequest) {
  db.logAudit("READ_ME", "GET", "/api/auth/me", req);
  return NextResponse.json({ user: db.currentUser });
}
