export function isDatabaseUnreachable(error) {
  const msg = String(error?.message || error || "").toLowerCase()
  const cause = String(error?.sourceError?.cause?.code || error?.cause?.code || "")
  return (
    msg.includes("fetch failed") ||
    msg.includes("connect timeout") ||
    msg.includes("econnrefused") ||
    msg.includes("enotfound") ||
    cause.includes("UND_ERR_CONNECT_TIMEOUT")
  )
}

export function databaseErrorResponse(res, error, fallback = "Database unavailable") {
  console.error(error)
  if (isDatabaseUnreachable(error)) {
    return res.status(503).json({
      error:
        "Cannot reach the database. Check your internet connection and DATABASE_URL in server/.env (use the Neon pooler URL with sslmode=require).",
    })
  }
  return res.status(500).json({ error: fallback })
}
