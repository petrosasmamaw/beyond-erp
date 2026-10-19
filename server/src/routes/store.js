import { Router } from "express"
import { sql } from "../db.js"
import { requireAuth, requireCompany } from "../middleware/auth.js"
import { createDefaultStore } from "../default-store.js"
import { databaseErrorResponse } from "../db-errors.js"

const router = Router()

function normalizeStore(data) {
  if (!data) return data
  return {
    ...data,
    products: data.products ?? [],
    employees: data.employees ?? [],
    inventory: data.inventory ?? [],
    suppliers: data.suppliers ?? [],
    orders: data.orders ?? [],
    finance: data.finance ?? {
      totalRevenue: 0,
      totalOrders: 0,
      totalVat: 0,
      totalSubtotal: 0,
    },
  }
}

async function getCompanyStore(companyId) {
  const rows = await sql`
    SELECT data FROM company_data WHERE company_id = ${companyId}::uuid LIMIT 1
  `
  if (rows[0]) return normalizeStore(rows[0].data)

  const companyRows = await sql`
    SELECT id, name, slug, sector, email, phone, address
    FROM companies WHERE id = ${companyId}::uuid LIMIT 1
  `
  const company = companyRows[0]
  if (!company) return null

  const data = createDefaultStore(company)
  await sql`
    INSERT INTO company_data (company_id, data)
    VALUES (${companyId}::uuid, ${data})
    ON CONFLICT (company_id) DO NOTHING
  `
  return normalizeStore(data)
}

router.get("/", requireAuth, requireCompany, async (req, res) => {
  try {
    const data = await getCompanyStore(req.user.companyId)
    if (!data) return res.status(404).json({ error: "Company not found" })
    return res.json(data)
  } catch (error) {
    return databaseErrorResponse(res, error, "Failed to load store")
  }
})

router.post("/reset", requireAuth, requireCompany, async (req, res) => {
  try {
    const companyRows = await sql`
      SELECT id, name, slug, sector, email, phone, address
      FROM companies WHERE id = ${req.user.companyId}::uuid LIMIT 1
    `
    const company = companyRows[0]
    if (!company) return res.status(404).json({ error: "Company not found" })

    const data = createDefaultStore(company)
    await sql`
      INSERT INTO company_data (company_id, data, updated_at)
      VALUES (${req.user.companyId}::uuid, ${data}, NOW())
      ON CONFLICT (company_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `
    await sql`DELETE FROM orders WHERE company_id = ${req.user.companyId}::uuid`

    return res.json(data)
  } catch (error) {
    return databaseErrorResponse(res, error, "Reset failed")
  }
})

router.put("/", requireAuth, requireCompany, async (req, res) => {
  try {
    const current = await getCompanyStore(req.user.companyId)
    if (!current) return res.status(404).json({ error: "Company not found" })

    const body = req.body
    const merged = normalizeStore({
      ...current,
      ...body,
      business: { ...current.business, ...body.business },
      finance: body.finance ?? current.finance,
      updatedAt: new Date().toISOString(),
    })

    await sql`
      INSERT INTO company_data (company_id, data, updated_at)
      VALUES (${req.user.companyId}::uuid, ${merged}, NOW())
      ON CONFLICT (company_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `
    return res.json(merged)
  } catch (error) {
    return databaseErrorResponse(res, error, "Invalid store payload")
  }
})

export default router
