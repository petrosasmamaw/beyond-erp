import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"
import { createDefaultStore } from "./default-store.js"

dotenv.config()

const sql = neon(process.env.DATABASE_URL)

async function ensurePlatformAdmin() {
  const hash = await bcrypt.hash("admin123", 10)
  const existing = await sql`
    SELECT id FROM users WHERE lower(email) = lower('admin@beyondsolution.et') LIMIT 1
  `
  if (existing[0]) {
    await sql`
      UPDATE users
      SET role = 'admin', password_hash = ${hash}, status = 'active', company_id = NULL
      WHERE id = ${existing[0].id}::uuid
    `
    console.log("Platform admin updated: admin@beyondsolution.et / admin123")
    return
  }
  await sql`
    INSERT INTO users (company_id, name, email, password_hash, role)
    VALUES (NULL, 'Platform Admin', 'admin@beyondsolution.et', ${hash}, 'admin')
  `
  console.log("Platform admin created: admin@beyondsolution.et / admin123")
}

async function ensureDemoCompanyUser() {
  const existing = await sql`SELECT id FROM users WHERE lower(email) = lower('user@demo.et') LIMIT 1`
  if (existing[0]) {
    console.log("Demo company user already exists: user@demo.et / demo123")
    return
  }

  let company = await sql`SELECT id, name, slug, sector, email, phone, address FROM companies WHERE slug = 'beyond-solution' LIMIT 1`
  if (!company[0]) {
    company = await sql`
      INSERT INTO companies (name, slug, sector, email, phone, address)
      VALUES (
        'Beyond Solution Demo',
        'beyond-solution',
        'Technology',
        'user@demo.et',
        '+251 911 000 000',
        'Addis Ababa, Ethiopia'
      )
      RETURNING id, name, slug, sector, email, phone, address
    `
  }

  const row = company[0]
  const hash = await bcrypt.hash("demo123", 10)
  await sql`
    INSERT INTO users (company_id, name, email, password_hash, role)
    VALUES (${row.id}::uuid, 'Demo User', 'user@demo.et', ${hash}, 'user')
  `

  const dataExists = await sql`SELECT company_id FROM company_data WHERE company_id = ${row.id}::uuid LIMIT 1`
  if (!dataExists[0]) {
    const store = createDefaultStore(row)
    await sql`INSERT INTO company_data (company_id, data) VALUES (${row.id}::uuid, ${store})`
  }

  console.log("Demo company user created: user@demo.et / demo123")
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required")
  }
  await ensurePlatformAdmin()
  if (process.env.SEED_DEMO === "true") {
    await ensureDemoCompanyUser()
  } else {
    console.log("Skipping demo company (set SEED_DEMO=true to create user@demo.et).")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
