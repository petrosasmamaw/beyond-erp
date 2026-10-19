import { sql } from "./db.js"

const DEFAULTS = {
  registration_fee_etb: 2500,
  telebirr_account: "0911000000",
  telebirr_account_name: "Beyond Solution PLC",
  cbe_account: "1000000000000",
  cbe_account_name: "Beyond Solution PLC",
}

export function mapPaymentSettings(row) {
  if (!row) return null
  return {
    registrationFeeEtb: row.registration_fee_etb,
    telebirrAccount: row.telebirr_account,
    telebirrAccountName: row.telebirr_account_name,
    cbeAccount: row.cbe_account,
    cbeAccountName: row.cbe_account_name,
    updatedAt: row.updated_at,
  }
}

export async function ensurePaymentSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS platform_settings (
      id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      registration_fee_etb INT NOT NULL DEFAULT 2500,
      telebirr_account TEXT NOT NULL DEFAULT '0911000000',
      telebirr_account_name TEXT NOT NULL DEFAULT 'Beyond Solution PLC',
      cbe_account TEXT NOT NULL DEFAULT '1000000000000',
      cbe_account_name TEXT NOT NULL DEFAULT 'Beyond Solution PLC',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
  await sql`
    INSERT INTO platform_settings (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING
  `
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS expected_amount_etb INT`
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS billing_type TEXT`
  await sql`ALTER TABLE registrations ADD COLUMN IF NOT EXISTS amount_etb INT`
}

export async function getPaymentSettings() {
  await ensurePaymentSchema()
  const rows = await sql`SELECT * FROM platform_settings WHERE id = 1 LIMIT 1`
  return mapPaymentSettings(rows[0])
}

export async function updatePaymentSettings(patch) {
  await ensurePaymentSchema()
  const current = await getPaymentSettings()
  const fee = Number(patch.registrationFeeEtb ?? current.registrationFeeEtb ?? DEFAULTS.registration_fee_etb)
  if (!Number.isFinite(fee) || fee < 0) {
    throw new Error("Invalid registration fee")
  }

  const rows = await sql`
    UPDATE platform_settings
    SET
      registration_fee_etb = ${fee},
      telebirr_account = ${String(patch.telebirrAccount ?? current.telebirrAccount).trim()},
      telebirr_account_name = ${String(patch.telebirrAccountName ?? current.telebirrAccountName).trim()},
      cbe_account = ${String(patch.cbeAccount ?? current.cbeAccount).trim()},
      cbe_account_name = ${String(patch.cbeAccountName ?? current.cbeAccountName).trim()},
      updated_at = NOW()
    WHERE id = 1
    RETURNING *
  `
  return mapPaymentSettings(rows[0])
}
