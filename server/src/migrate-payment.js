import dotenv from "dotenv"
import { ensurePaymentSchema } from "./payment-settings.js"

dotenv.config()

ensurePaymentSchema()
  .then(() => {
    console.log("Payment settings schema ready.")
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
