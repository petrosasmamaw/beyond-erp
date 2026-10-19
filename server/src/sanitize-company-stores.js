/**
 * One-time: clear demo catalogue/inventory from all companies; keep business profile.
 * Run: npm run db:sanitize-stores
 */
import dotenv from "dotenv"
import { neon } from "@neondatabase/serverless"
import { createDefaultStore } from "./default-store.js"

dotenv.config()

const sql = neon(process.env.DATABASE_URL || "")

async function main() {
  const companies = await sql`
    SELECT id, name, slug, sector, email, phone, address FROM companies
  `
  for (const company of companies) {
    const data = createDefaultStore(company)
    await sql`
      INSERT INTO company_data (company_id, data, updated_at)
      VALUES (${company.id}::uuid, ${data}, NOW())
      ON CONFLICT (company_id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
    `
    console.log(`Reset workspace data for ${company.name}`)
  }
  console.log(`Done. ${companies.length} companies updated.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
