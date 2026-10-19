import jwt from "jsonwebtoken"

export function signToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      companyId: user.company_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: "Invalid token" })
  }
}

export function requireCompany(req, res, next) {
  if (!req.user?.companyId) {
    return res.status(403).json({ error: "Company access required" })
  }
  next()
}

export function requirePlatformAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" })
  }
  next()
}
