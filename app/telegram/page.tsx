"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { apiFetch } from "@/lib/api-client"

export default function TelegramEntryPage() {
  const router = useRouter()

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user?.companyId) {
          router.replace("/dashboard")
        } else {
          router.replace("/login?next=/dashboard")
        }
      })
      .catch(() => router.replace("/login?next=/dashboard"))
  }, [router])

  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      <div className="flex min-h-screen items-center justify-center bg-[#0033ad] text-white">
        <p className="text-sm">Opening Beyond Solution…</p>
      </div>
    </>
  )
}
