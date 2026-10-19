import { NextResponse } from "next/server"
import { getSession, type SessionPayload } from "./session"

export async function requireSession(): Promise<SessionPayload | NextResponse> {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return session
}

export async function requireCompanySession(): Promise<SessionPayload | NextResponse> {
  const session = await requireSession()
  if (session instanceof NextResponse) return session
  if (!session.companyId) {
    return NextResponse.json({ error: "Company access required" }, { status: 403 })
  }
  return session
}

export async function requirePlatformAdmin(): Promise<SessionPayload | NextResponse> {
  const session = await requireSession()
  if (session instanceof NextResponse) return session
  if (session.role !== "platform_admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return session
}
