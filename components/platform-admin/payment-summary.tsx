"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api-client"
import type { PaymentSettings } from "@/lib/platform-admin-types"

export function PaymentSummaryBar() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null)

  useEffect(() => {
    apiFetch("/api/platform/payment-settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings))
  }, [])

  if (!settings) return null

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-slate-900">
          Registration fee:{" "}
          <span className="text-[#0033ad]">{settings.registrationFeeEtb.toLocaleString()} ETB</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Telebirr {settings.telebirrAccount} · CBE {settings.cbeAccount}
        </p>
      </div>
      <Link
        href="/platform-admin/payment-setup"
        className="text-sm font-medium text-[#0033ad] hover:underline"
      >
        Edit accounts & fee
      </Link>
    </div>
  )
}

function billingLabel(reg: {
  status: string
  billingType?: string | null
  amountEtb?: number | null
  expectedAmountEtb?: number | null
}) {
  if (reg.status === "pending") {
    const amt = reg.expectedAmountEtb ?? "—"
    return `Pending · ${amt} ETB due`
  }
  if (reg.billingType === "promotional") return "Promotional · 0 ETB"
  if (reg.billingType === "paid") return `Paid · ${(reg.amountEtb ?? 0).toLocaleString()} ETB`
  return "—"
}

export function BillingBadge({
  reg,
}: {
  reg: {
    status: string
    billingType?: string | null
    amountEtb?: number | null
    expectedAmountEtb?: number | null
  }
}) {
  const text = billingLabel(reg)
  const tone =
    reg.billingType === "paid"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : reg.billingType === "promotional"
        ? "bg-violet-50 text-violet-800 ring-violet-200"
        : reg.status === "pending"
          ? "bg-amber-50 text-amber-900 ring-amber-200"
          : "bg-slate-100 text-slate-600 ring-slate-200"

  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}>
      {text}
    </span>
  )
}
