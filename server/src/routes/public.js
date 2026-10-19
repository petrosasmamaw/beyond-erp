import { Router } from "express"
import { sql } from "../db.js"

const router = Router()

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params
    const companyRows = await sql`
      SELECT id, name, slug, sector, email, phone, address, status
      FROM companies WHERE slug = ${slug} AND status = 'active' LIMIT 1
    `
    const company = companyRows[0]
    if (!company) return res.status(404).json({ error: "Catalogue not found" })

    const dataRows = await sql`
      SELECT data FROM company_data WHERE company_id = ${company.id}::uuid LIMIT 1
    `
    const data = dataRows[0]?.data
    if (!data) return res.status(404).json({ error: "Catalogue not found" })

    return res.json({
      business: data.business,
      products: (data.products || []).filter((p) => p.isActive),
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to load catalogue" })
  }
})

export default router
