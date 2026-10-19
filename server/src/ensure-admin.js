import dotenv from "dotenv"
import bcrypt from "bcryptjs"
import { neon } from "@neondatabase/serverless"

dotenv.config()

const email = process.env.ADMIN_EMAIL || "admin@gmail.com"
const password = process.env.ADMIN_PASSWORD || "12345678"

const sql = neon(process.env.DATABASE_URL)

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")

  const hash = await bcrypt.hash(password, 10)
  const existing = await sql`SELECT id FROM users WHERE lower(email) = lower(${email}) LIMIT 1`

  if (existing[0]) {
    await sql`
      UPDATE users
      SET role = 'admin', password_hash = ${hash}, status = 'active', company_id = NULL, name = 'Platform Admin'
      WHERE id = ${existing[0].id}::uuid
    `
    console.log(`Updated admin: ${email}`)
  } else {
    await sql`
      INSERT INTO users (company_id, name, email, password_hash, role)
      VALUES (NULL, 'Platform Admin', ${email}, ${hash}, 'admin')
    `
    console.log(`Created admin: ${email}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
