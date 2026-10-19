"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  ClipboardList,
  CreditCard,
  Settings,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { apiFetch, clearAuthToken } from "@/lib/api-client"
import { cn } from "@/lib/utils"

const mainNav = [
  { href: "/platform-admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/platform-admin/registrations", label: "Registrations", icon: ClipboardList },
  { href: "/platform-admin/payments", label: "Payments", icon: CreditCard },
  { href: "/platform-admin/payment-setup", label: "Payment setup", icon: Settings },
  { href: "/platform-admin/companies", label: "Companies", icon: Building2 },
]

const websiteNav = [
  { href: "/", label: "Marketing home" },
  { href: "/services", label: "Services & pricing" },
  { href: "/about", label: "About" },
  { href: "/register", label: "New registration" },
]

export function PlatformAdminShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title?: string
  subtitle?: string
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const activeMain =
    mainNav.find((item) =>
      item.exact ? pathname === item.href : pathname.startsWith(item.href)
    ) ?? mainNav[0]

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" })
    } catch {
      /* offline */
    }
    clearAuthToken()
    window.location.href = "/login"
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7ff]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:relative z-50 flex h-full flex-col bg-[#0033AD] text-white transition-all duration-300",
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div className="flex items-center gap-3 border-b border-[#1E4BB8] p-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
            <Image src="/logo.png" alt="Beyond Solution" width={40} height={40} className="object-contain" />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-tight">Beyond Solution</p>
              <p className="text-xs text-white/70">Platform console</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {sidebarOpen && (
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-white/45">
              ERP & finance
            </p>
          )}
          {mainNav.map((item) => {
            const active =
              item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false)
                }}
                className={cn(
                  "flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-white font-semibold text-[#0033AD]"
                    : "text-white/85 hover:bg-[#1E4BB8] hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            )
          })}

          {sidebarOpen && (
            <div className="mt-4 border-t border-[#1E4BB8] pt-4">
              <p className="flex items-center gap-2 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/45">
                <Globe className="h-3.5 w-3.5" />
                Public website
              </p>
              {websiteNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.href === "/" ? undefined : undefined}
                  className="flex min-h-[40px] items-center rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-[#1E4BB8] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-[#1E4BB8] p-3">
          <button
            type="button"
            onClick={logout}
            className="flex w-full min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-300 hover:bg-[#1E4BB8]"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {sidebarOpen && <span>Log out</span>}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden border-t border-[#1E4BB8] p-4 hover:bg-[#1E4BB8] lg:block"
        >
          {sidebarOpen ? <X className="mx-auto h-5 w-5" /> : <Menu className="mx-auto h-5 w-5" />}
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-[#0033AD]" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-[#0033AD] md:text-xl">
                {title ?? activeMain.label}
              </h1>
              <p className="text-xs text-slate-500 md:text-sm">
                {subtitle ?? now.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600">
            {now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">{children}</div>
      </main>
    </div>
  )
}
