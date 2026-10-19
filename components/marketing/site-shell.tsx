"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
]

export function SiteShell({
  children,
  ctaHref = "/register",
  ctaLabel = "Get started",
}: {
  children: React.ReactNode
  ctaHref?: string
  ctaLabel?: string
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#f4f7ff] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-[#dbe4ff] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Beyond Solution" width={36} height={36} className="rounded-full" />
            <span className="font-semibold text-[#0033ad]">Beyond Solution</span>
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-[#0033ad] text-white"
                    : "text-slate-600 hover:bg-[#e8eeff] hover:text-[#0033ad]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-[#0033ad] sm:inline"
            >
              Login
            </Link>
            <Link
              href={ctaHref}
              className="rounded-md bg-[#0033ad] px-3 py-2 text-sm font-medium text-white"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-[#dbe4ff] bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Beyond Solution · SME management</p>
          <p>
            Telegram:{" "}
            <a href="https://t.me/Beyondetbot" className="text-[#0033ad] font-medium">
              @Beyondetbot
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
