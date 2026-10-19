import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { sql } from "../db.js"
import { getPaymentSettings } from "../payment-settings.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadDir = path.join(__dirname, "../../uploads/licenses")
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".pdf"
    cb(null, `license-${Date.now()}${ext}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 8 * 1024 * 1024 } })

const router = Router()

router.get("/payment-info", async (_req, res) => {
  try {
    const settings = await getPaymentSettings()
    return res.json({ settings })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Could not load payment info" })
  }
})

router.post("/", upload.single("license"), async (req, res) => {
  try {
    const {
      companyName,
      sector,
      contactName,
      email,
      phone,
      address,
      paymentMethod,
      paymentReference,
    } = req.body

    if (!companyName || !sector || !contactName || !email || !phone || !address) {
      return res.status(400).json({ error: "Missing required fields" })
    }
    if (!["cbe", "telebirr"].includes(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method" })
    }
    if (!paymentReference?.trim()) {
      return res.status(400).json({ error: "Payment reference required" })
    }
    if (!req.file) {
      return res.status(400).json({ error: "Business license file required" })
    }

    const settings = await getPaymentSettings()
    const expectedAmount = settings?.registrationFeeEtb ?? 2500

    const rows = await sql`
      INSERT INTO registrations (
        company_name, sector, contact_name, email, phone, address,
        license_file, payment_method, payment_reference, expected_amount_etb
      ) VALUES (
        ${companyName}, ${sector}, ${contactName}, ${email}, ${phone}, ${address},
        ${req.file.filename}, ${paymentMethod}, ${paymentReference}, ${expectedAmount}
      )
      RETURNING id
    `

    return res.json({ ok: true, registrationId: rows[0].id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Registration failed" })
  }
})

export default router
