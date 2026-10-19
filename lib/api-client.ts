const TOKEN_KEY = "bs_token"

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
}

export function apiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, "")
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
  document.cookie = `bs_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export function clearAuthToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
  document.cookie = "bs_token=; path=/; max-age=0"
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  const token = getAuthToken()
  if (token) headers.set("Authorization", `Bearer ${token}`)
  if (!(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  try {
    return await fetch(apiUrl(path), { ...init, headers })
  } catch {
    const base = getApiBaseUrl()
    throw new Error(
      `Cannot reach the API at ${base}. Start it with: cd server && npm run dev`
    )
  }
}
