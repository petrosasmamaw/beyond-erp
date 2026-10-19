import { Router } from "express"
import bcrypt from "bcryptjs"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { sql } from "../db.js"
import { requireAuth, requirePlatformAdmin } from "../middleware/auth.js"
import { createDefaultStore } from "../default-store.js"
import { slugify } from "../slug.js"
import { sendLoginCredentialsEmail } from "../email.js"
import { getPaymentSettings, updatePaymentSettings } from "../payment-settings.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, "../../uploads/licenses")

const router = Router()

function mapRegistration(r) {
  return {
    id: r.id,
    companyName: r.company_name,
    sector: r.sector,
    contactName: r.contact_name,
    email: r.email,
    phone: r.phone,
    address: r.address,
    licenseFile: r.license_file,
    paymentMethod: r.payment_method,
    paymentReference: r.payment_reference,
    plan: r.plan,
    status: r.status,
    expectedAmountEtb: r.expected_amount_etb,
    billingType: r.billing_type,
    amountEtb: r.amount_etb,
    companyId: r.company_id,
    createdAt: r.created_at,
    reviewedAt: r.reviewed_at,
  }
}

router.get("/payment-settings", requireAuth, requirePlatformAdmin, async (_req, res) => {
  try {
    const settings = await getPaymentSettings()
    return res.json({ settings })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load payment settings" })
  }
})

router.put("/payment-settings", requireAuth, requirePlatformAdmin, async (req, res) => {
  try {
    const settings = await updatePaymentSettings(req.body ?? {})
    return res.json({ settings })
  } catch (error) {
    console.error(error)
    return res.status(400).json({ error: error.message || "Invalid settings" })
  }
})

router.get("/stats", requireAuth, requirePlatformAdmin, async (_req, res) => {
  const [regStats] = await sql`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::int AS pending,
      COUNT(*) FILTER (WHERE status = 'approved')::int AS approved,
      COUNT(*)::int AS total
    FROM registrations
  `
  const [companyCount] = await sql`SELECT COUNT(*)::int AS count FROM companies`
  const paymentRows = await sql`
    SELECT payment_method, COUNT(*)::int AS count
    FROM registrations
    GROUP BY payment_method
  `
  const [billingStats] = await sql`
    SELECT
      COALESCE(SUM(amount_etb) FILTER (WHERE status = 'approved' AND billing_type = 'paid'), 0)::int AS collected_etb,
      COUNT(*) FILTER (WHERE status = 'approved' AND billing_type = 'paid')::int AS paid_count,
      COUNT(*) FILTER (WHERE status = 'approved' AND billing_type = 'promotional')::int AS promotional_count,
      COALESCE(SUM(expected_amount_etb) FILTER (WHERE status = 'pending'), 0)::int AS pending_expected_etb
    FROM registrations
  `
  const settings = await getPaymentSettings()

  return res.json({
    stats: {
      registrationsPending: regStats?.pending ?? 0,
      registrationsApproved: regStats?.approved ?? 0,
      registrationsTotal: regStats?.total ?? 0,
      activeCompanies: companyCount?.count ?? 0,
      registrationFeeEtb: settings?.registrationFeeEtb ?? 2500,
      collectedRevenueEtb: billingStats?.collected_etb ?? 0,
      paidApprovals: billingStats?.paid_count ?? 0,
      promotionalApprovals: billingStats?.promotional_count ?? 0,
      pendingExpectedEtb: billingStats?.pending_expected_etb ?? 0,
      paymentsByMethod: paymentRows.map((r) => ({
        method: r.payment_method,
        count: r.count,
      })),
    },
  })
})

router.get("/companies", requireAuth, requirePlatformAdmin, async (_req, res) => {
  const rows = await sql`
    SELECT
      c.id,
      c.name,
      c.slug,
      c.sector,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      (SELECT COUNT(*)::int FROM users u WHERE u.company_id = c.id) AS user_count
    FROM companies c
    ORDER BY c.created_at DESC
  `
  return res.json({
    companies: rows.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      sector: c.sector,
      email: c.email,
      phone: c.phone,
      status: c.status,
      userCount: c.user_count,
      createdAt: c.created_at,
    })),
  })
})

router.get("/registrations", requireAuth, requirePlatformAdmin, async (_req, res) => {
  const rows = await sql`
    SELECT id, company_name, sector, contact_name, email, phone, address, license_file,
           payment_method, payment_reference, plan, status,
           expected_amount_etb, billing_type, amount_etb,
           company_id, created_at, reviewed_at
    FROM registrations
    ORDER BY created_at DESC
  `
  return res.json({ registrations: rows.map(mapRegistration) })
})

router.get("/registrations/:id", requireAuth, requirePlatformAdmin, async (req, res) => {
  const rows = await sql`
    SELECT id, company_name, sector, contact_name, email, phone, address, license_file,
           payment_method, payment_reference, plan, status,
           expected_amount_etb, billing_type, amount_etb,
           company_id, created_at, reviewed_at
    FROM registrations WHERE id = ${req.params.id}::uuid LIMIT 1
  `
  if (!rows[0]) return res.status(404).json({ error: "Registration not found" })
  return res.json({ registration: mapRegistration(rows[0]) })
})

router.get("/registrations/:id/license", requireAuth, requirePlatformAdmin, async (req, res) => {
  const rows = await sql`
    SELECT license_file FROM registrations WHERE id = ${req.params.id}::uuid LIMIT 1
  `
  const fileName = rows[0]?.license_file
  if (!fileName) return res.status(404).json({ error: "License not found" })

  const filePath = path.join(uploadDir, fileName)
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: "License file missing on server" })

  return res.download(filePath, fileName)
})

router.post("/registrations", requireAuth, requirePlatformAdmin, async (req, res) => {
  const { id, action, billingType } = req.body
  if (action !== "approve") {
    return res.status(400).json({ error: "Unsupported action" })
  }
  if (!["paid", "promotional"].includes(billingType)) {
    return res.status(400).json({ error: "Choose billing type: paid or promotional" })
  }

  try {
    const regRows = await sql`
      SELECT * FROM registrations WHERE id = ${id}::uuid AND status = 'pending' LIMIT 1
    `
    const reg = regRows[0]
    if (!reg) return res.status(404).json({ error: "Registration not found" })

    let slug = slugify(reg.company_name)
    const slugRows = await sql`SELECT id FROM companies WHERE slug = ${slug} LIMIT 1`
    if (slugRows[0]) slug = `${slug}-${Date.now().toString(36)}`

    const companyRows = await sql`
      INSERT INTO companies (name, slug, sector, email, phone, address)
      VALUES (
        ${reg.company_name}, ${slug}, ${reg.sector}, ${reg.email}, ${reg.phone}, ${reg.address}
      )
      RETURNING id, name, slug, sector, email, phone, address
    `
    const company = companyRows[0]

    const tempPassword = `BS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const hash = await bcrypt.hash(tempPassword, 10)

    await sql`
      INSERT INTO users (company_id, name, email, password_hash, role)
      VALUES (${company.id}::uuid, ${reg.contact_name}, ${reg.email}, ${hash}, 'user')
    `

    const store = createDefaultStore(company)
    await sql`
      INSERT INTO company_data (company_id, data)
      VALUES (${company.id}::uuid, ${store})
    `

    const settings = await getPaymentSettings()
    const fee = reg.expected_amount_etb ?? settings?.registrationFeeEtb ?? 2500
    const amountEtb = billingType === "paid" ? fee : 0

    await sql`
      UPDATE registrations
      SET
        status = 'approved',
        reviewed_at = NOW(),
        company_id = ${company.id}::uuid,
        billing_type = ${billingType},
        amount_etb = ${amountEtb}
      WHERE id = ${reg.id}::uuid
    `

    const emailResult = await sendLoginCredentialsEmail({
      to: reg.email,
      name: reg.contact_name,
      companyName: reg.company_name,
      email: reg.email,
      password: tempPassword,
    })

    return res.json({
      registration: mapRegistration({
        ...reg,
        status: "approved",
        company_id: company.id,
        reviewed_at: new Date().toISOString(),
        billing_type: billingType,
        amount_etb: amountEtb,
      }),
      credentials: { email: reg.email, password: tempPassword },
      email: emailResult,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Approval failed" })
  }
})

router.post("/registrations/:id/resend-credentials", requireAuth, requirePlatformAdmin, async (req, res) => {
  try {
    const regRows = await sql`
      SELECT * FROM registrations WHERE id = ${req.params.id}::uuid LIMIT 1
    `
    const reg = regRows[0]
    if (!reg) return res.status(404).json({ error: "Registration not found" })
    if (reg.status !== "approved" || !reg.company_id) {
      return res.status(400).json({ error: "Only approved companies can receive credential resends" })
    }

    const userRows = await sql`
      SELECT id FROM users
      WHERE lower(email) = lower(${reg.email})
        AND company_id = ${reg.company_id}::uuid
        AND role = 'user'
      LIMIT 1
    `
    if (!userRows[0]) {
      return res.status(404).json({ error: "Company login account not found" })
    }

    const tempPassword = `BS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    const hash = await bcrypt.hash(tempPassword, 10)

    await sql`
      UPDATE users SET password_hash = ${hash}, status = 'active'
      WHERE id = ${userRows[0].id}::uuid
    `

    const emailResult = await sendLoginCredentialsEmail({
      to: reg.email,
      name: reg.contact_name,
      companyName: reg.company_name,
      email: reg.email,
      password: tempPassword,
    })

    return res.json({
      credentials: { email: reg.email, password: tempPassword },
      email: emailResult,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not resend credentials" })
  }
})

export default router
