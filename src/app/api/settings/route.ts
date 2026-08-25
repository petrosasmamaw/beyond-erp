import { NextResponse, NextRequest } from "next/server";
import { db } from "../db";

export async function GET(req: NextRequest) {
  db.logAudit("READ_SETTINGS", "GET", "/api/settings", req);
  return NextResponse.json(db.settings);
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    db.settings = { ...db.settings, ...body };
    db.logAudit("UPDATE_SETTINGS", "PATCH", "/api/settings", req);
    return NextResponse.json(db.settings);
  } catch (err) {
    return NextResponse.json({ message: err instanceof Error ? err.message : "Failed to update settings" }, { status: 500 });
  }
}
