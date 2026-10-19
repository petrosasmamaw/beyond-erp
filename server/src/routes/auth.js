import { Router } from "express"
import bcrypt from "bcryptjs"
import { sql } from "../db.js"
import { signToken, requireAuth } from "../middleware/auth.js"

const router = Router()

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" })
    }

    const rows = await sql`
      SELECT id, company_id, name, email, password_hash, role, status
      FROM users WHERE lower(email) = lower(${email}) LIMIT 1
    `
    const user = rows[0]
    if (!user || user.status !== "active") {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = signToken(user)
    return res.json({
      token,
      role: user.role,
      companyId: user.company_id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.company_id,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Login failed" })
  }
})

router.get("/me", requireAuth, async (req, res) => {
  let company = null
  if (req.user.companyId) {
    const rows = await sql`
      SELECT id, name, slug, sector, email, phone, status
      FROM companies WHERE id = ${req.user.companyId}::uuid LIMIT 1
    `
    company = rows[0] || null
  }
  return res.json({ user: req.user, company })
})

router.post("/logout", (_req, res) => {
  return res.json({ ok: true })
})

export default router
