import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"
import { neon } from "@neondatabase/serverless"

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
const sql = neon(process.env.DATABASE_URL)

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required")
  }
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)

  for (const statement of statements) {
    await sql(statement)
  }
  console.log("Database schema applied.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
