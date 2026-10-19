import { Router } from "express"
import bcrypt from "bcryptjs"
import { sql } from "../db.js"
import { requireAuth, requireCompany } from "../middleware/auth.js"

const router = Router()
router.get("/", requireAuth, requireCompany, async (req, res) => {
  const rows = await sql`
    SELECT id, name, email, role
    FROM users
    WHERE company_id = ${req.user.companyId}::uuid
      AND role = 'user'
      AND id <> ${req.user.sub}::uuid
    ORDER BY created_at DESC
  `
  return res.json({ members: rows })
})

router.post("/", requireAuth, requireCompany, async (req, res) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ error: "Only company users can add team access" })
  }

  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing fields" })
  }
  try {
    const hash = await bcrypt.hash(password, 10)
    const rows = await sql`
      INSERT INTO users (company_id, name, email, password_hash, role)
      VALUES (${req.user.companyId}::uuid, ${name}, ${email}, ${hash}, 'user')
      RETURNING id, name, email, role
    `
    return res.json({ member: rows[0] })
  } catch (error) {
    if (String(error).includes("unique")) {
      return res.status(400).json({ error: "Email already in use" })
    }
    console.error(error)
    return res.status(500).json({ error: "Could not add member" })
  }
})

export default router
