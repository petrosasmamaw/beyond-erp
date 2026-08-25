import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "BeyondERP Enterprise Backend Service", timestamp: new Date().toISOString() });
}
