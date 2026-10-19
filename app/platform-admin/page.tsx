"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api-client"
import type { PlatformRegistration, PlatformStats } from "@/lib/platform-admin-types"
import { BillingBadge } from "@/components/platform-admin/payment-summary"
import { ArrowRight, Building2, CreditCard, Gift, Users } from "lucide-react"

export default function PlatformAdminOverviewPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [recent, setRecent] = useState<PlatformRegistration[]>([])

  useEffect(() => {
    apiFetch("/api/platform/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats ?? null))
    apiFetch("/api/platform/registrations")
      .then((r) => r.json())
      .then((d) => setRecent((d.registrations ?? []).slice(0, 5)))
  }, [])

  const cards = [
    {
      label: "Pending payments",
      value: stats?.registrationsPending ?? "—",
      hint: stats ? `${stats.pendingExpectedEtb.toLocaleString()} ETB expected` : "",
      icon: CreditCard,
      href: "/platform-admin/payments",
    },
    {
      label: "Collected (ETB)",
      value: stats ? stats.collectedRevenueEtb.toLocaleString() : "—",
      hint: `${stats?.paidApprovals ?? 0} paid approvals`,
      icon: CreditCard,
      href: "/platform-admin/payments",
    },
    {
      label: "Promotional",
      value: stats?.promotionalApprovals ?? "—",
      hint: "Free / partner access",
      icon: Gift,
      href: "/platform-admin/registrations",
    },
    {
      label: "Active companies",
      value: stats?.activeCompanies ?? "—",
      hint: "ERP tenants live",
      icon: Building2,
      href: "/platform-admin/companies",
    },
    {
      label: "Registration fee",
      value: stats ? `${stats.registrationFeeEtb.toLocaleString()} ETB` : "—",
      hint: "Current public price",
      icon: Users,
      href: "/platform-admin/payment-setup",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <p className="text-sm text-slate-600">
        Finance overview: registration fees, payment references, and paid vs promotional onboarding.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#0033ad]/30 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <card.icon className="h-5 w-5 text-[#0033ad]" />
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-[#0033ad]" />
            </div>
            <p className="mt-4 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{card.label}</p>
            <p className="text-xs text-slate-500">{card.hint}</p>
          </Link>
        ))}
      </div>

      {stats && stats.paymentsByMethod.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Payments by channel</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.paymentsByMethod.map((row) => (
              <div key={row.method} className="rounded-lg bg-[#f4f7ff] px-4 py-2 text-sm">
                <span className="font-medium uppercase text-[#0033ad]">{row.method}</span>
                <span className="ml-2 text-slate-600">{row.count} registration(s)</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Recent registrations</h2>
          <Link href="/platform-admin/registrations" className="text-sm font-medium text-[#0033ad]">
            View all
          </Link>
        </div>
        <ul className="divide-y divide-slate-100">
          {recent.map((reg) => (
            <li
              key={reg.id}
              className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900">{reg.companyName}</p>
                <p className="text-xs text-slate-500">
                  {reg.paymentMethod?.toUpperCase()} · {reg.paymentReference}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <BillingBadge reg={reg} />
                <span className="text-xs font-medium uppercase text-slate-500">{reg.status}</span>
              </div>
            </li>
          ))}
          {recent.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-slate-500">No registrations yet.</li>
          )}
        </ul>
      </section>
    </div>
  )
}
