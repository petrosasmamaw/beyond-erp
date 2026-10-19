import { execSync } from "node:child_process"

const port = String(process.env.PORT || 4000)

function killWindowsPort(p) {
  let out = ""
  try {
    out = execSync(`netstat -ano | findstr LISTENING | findstr :${p}`, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    })
  } catch {
    return
  }

  const pids = new Set()
  for (const line of out.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/)
    if (parts.length < 5 || parts[3] !== "LISTENING") continue
    const local = parts[1]
    const onPort =
      local === `0.0.0.0:${p}` ||
      local === `[::]:${p}` ||
      local?.endsWith(`:${p}`)
    if (!onPort) continue
    const pid = parts[parts.length - 1]
    if (pid && pid !== "0") pids.add(pid)
  }

  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" })
      console.log(`[dev] Freed port ${p} (stopped PID ${pid})`)
    } catch {
      // already gone
    }
  }
}

function killUnixPort(p) {
  try {
    const pids = execSync(`lsof -ti tcp:${p} -sTCP:LISTEN 2>/dev/null || true`, {
      encoding: "utf8",
      shell: true,
    })
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    for (const pid of pids) {
      try {
        execSync(`kill -9 ${pid}`, { stdio: "ignore" })
        console.log(`[dev] Freed port ${p} (stopped PID ${pid})`)
      } catch {
        // ignore
      }
    }
  } catch {
    // port free
  }
}

if (process.platform === "win32") {
  killWindowsPort(port)
} else {
  killUnixPort(port)
}
