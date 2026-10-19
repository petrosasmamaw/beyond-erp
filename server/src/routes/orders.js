import { Router } from "express"
import { sql } from "../db.js"
import { requireAuth, requireCompany } from "../middleware/auth.js"
import { applyOrderToStore } from "../store-mutations.js"

const router = Router()

router.post("/", requireAuth, requireCompany, async (req, res) => {
  try {
    const order = {
      id: `ord-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
    }

    await sql`
      INSERT INTO orders (company_id, payload)
      VALUES (${req.user.companyId}::uuid, ${order})
    `

    const storeRows = await sql`
      SELECT data FROM company_data WHERE company_id = ${req.user.companyId}::uuid LIMIT 1
    `
    if (storeRows[0]) {
      const next = applyOrderToStore(storeRows[0].data, order)
      await sql`
        UPDATE company_data SET data = ${next}, updated_at = NOW()
        WHERE company_id = ${req.user.companyId}::uuid
      `
      return res.json({ order, store: next })
    }

    return res.json({ order })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: "Could not create order" })
  }
})

export default router
