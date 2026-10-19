import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import registerRoutes from "./routes/register.js"
import storeRoutes from "./routes/store.js"
import orderRoutes from "./routes/orders.js"
import teamRoutes from "./routes/team.js"
import platformRoutes from "./routes/platform.js"
import publicRoutes from "./routes/public.js"

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set")
}

const origins = (process.env.CLIENT_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

function isAllowedOrigin(origin) {
  if (!origin) return true
  if (origins.includes(origin)) return true
  if (process.env.NODE_ENV === "production") return false
  try {
    const { hostname, protocol } = new URL(origin)
    return (
      (hostname === "localhost" || hostname === "127.0.0.1") &&
      (protocol === "http:" || protocol === "https:")
    )
  } catch {
    return false
  }
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, origin || origins[0])
      } else {
        callback(null, false)
      }
    },
    credentials: true,
  })
)
app.use(express.json({ limit: "2mb" }))

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "beyond-solution-api" })
})

app.use("/api/auth", authRoutes)
app.use("/api/register", registerRoutes)
app.use("/api/store", storeRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/team", teamRoutes)
app.use("/api/platform", platformRoutes)
app.use("/api/public", publicRoutes)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: "Internal server error" })
})

app.listen(port, () => {
  console.log(`Beyond Solution API listening on port ${port}`)
})
