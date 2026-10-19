import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySessionToken, AUTH_COOKIE } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value
  const session = token ? await verifySessionToken(token) : null

  if (pathname.startsWith("/dashboard")) {
    if (!session?.companyId) {
      const login = new URL("/login", request.url)
      login.searchParams.set("next", pathname)
      return NextResponse.redirect(login)
    }
  }

  if (pathname.startsWith("/platform-admin")) {
    if (session?.role !== "admin") {
      return NextResponse.redirect(new URL("/login?role=platform", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/platform-admin/:path*"],
}
