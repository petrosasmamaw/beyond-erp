import dotenv from "dotenv"
import { sendLoginCredentialsEmail } from "./email.js"

dotenv.config()

const to = process.argv[2] || "admin@gmail.com"

const result = await sendLoginCredentialsEmail({
  to,
  name: "Test User",
  companyName: "Beyond Solution Test Co.",
  email: to,
  password: "BS-TEST99",
})

console.log(JSON.stringify(result, null, 2))
