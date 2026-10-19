import { neon, neonConfig } from "@neondatabase/serverless"
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. API will fail until you configure server/.env")
}

neonConfig.fetchFunction = (input, init) =>
  fetch(input, {
    ...init,
    signal: AbortSignal.timeout(30_000),
  })

function normalizeDatabaseUrl(url) {
  if (!url) return ""
  try {
    const parsed = new URL(url)
    parsed.searchParams.delete("channel_binding")
    return parsed.toString()
  } catch {
    return url.replace(/[?&]channel_binding=[^&]*/g, "")
  }
}

export const sql = neon(normalizeDatabaseUrl(process.env.DATABASE_URL || ""))
