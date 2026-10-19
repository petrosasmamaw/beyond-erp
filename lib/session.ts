import { jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { UserRole } from "./platform-types"

export const AUTH_COOKIE = "bs_token"

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "beyond-solution-dev-secret-change-me"
)

export interface SessionPayload {
  sub: string
  email: string
  name: string
  role: UserRole
  companyId: string | null
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name),
      role: payload.role as UserRole,
      companyId: payload.companyId ? String(payload.companyId) : null,
    }
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  return verifySessionToken(token)
}
