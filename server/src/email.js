function getAppUrl() {
  const origins = (process.env.CLIENT_ORIGINS || "http://localhost:3000").split(",")
  return (process.env.APP_URL || origins[0] || "http://localhost:3000").trim()
}

function parseSender() {
  const from = process.env.EMAIL_FROM || ""
  const match = from.match(/^(.+?)\s*<([^>]+)>$/)
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() }
  }
  return {
    name: process.env.EMAIL_FROM_NAME || "Beyond Solution",
    email: process.env.EMAIL_FROM_ADDRESS || "agrishop49@gmail.com",
  }
}

function parseBrevoError(body) {
  try {
    const data = JSON.parse(body)
    const message = data.message || data.error || "Brevo could not send this email"
    return { code: "brevo_error", message }
  } catch {
    return { code: "brevo_error", message: body || "Brevo API error" }
  }
}

export async function sendLoginCredentialsEmail({ to, name, companyName, email, password }) {
  const apiKey = process.env.BREVO_API_KEY
  const sender = parseSender()
  const loginUrl = `${getAppUrl()}/login`

  if (!apiKey) {
    return { sent: false, code: "missing_key", reason: "BREVO_API_KEY is not configured" }
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:520px">
      <h2 style="color:#0033ad">Welcome to Beyond Solution RMS</h2>
      <p>Hello ${name},</p>
      <p>Your company <strong>${companyName}</strong> has been approved. Use the credentials below to sign in:</p>
      <table style="margin:16px 0;background:#f4f7ff;border-radius:8px;padding:12px;width:100%">
        <tr><td style="padding:8px 12px"><strong>Login URL</strong></td><td style="padding:8px 12px"><a href="${loginUrl}">${loginUrl}</a></td></tr>
        <tr><td style="padding:8px 12px"><strong>Email</strong></td><td style="padding:8px 12px">${email}</td></tr>
        <tr><td style="padding:8px 12px"><strong>Password</strong></td><td style="padding:8px 12px">${password}</td></tr>
      </table>
      <p style="font-size:13px;color:#64748b">Please change your password after your first login when that feature is available.</p>
      <p>— Beyond Solution Team</p>
    </div>
  `

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        to: [{ email: to, name: name || to }],
        subject: `Your Beyond Solution login — ${companyName}`,
        htmlContent: html,
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error("Brevo error:", body)
      const parsed = parseBrevoError(body)
      return { sent: false, code: parsed.code, reason: parsed.message }
    }

    const data = await response.json()
    return { sent: true, id: data.messageId || data.message }
  } catch (error) {
    console.error("Brevo request failed:", error)
    return {
      sent: false,
      code: "brevo_network",
      reason: error instanceof Error ? error.message : "Could not reach Brevo",
    }
  }
}
