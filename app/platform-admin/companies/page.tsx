"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api-client"
import type { PlatformCompany } from "@/lib/platform-admin-types"
import { ExternalLink } from "lucide-react"

export default function PlatformCompaniesPage() {
  const [companies, setCompanies] = useState<PlatformCompany[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch("/api/platform/companies")
      .then((r) => r.json())
      .then((d) => setCompanies(d.companies ?? []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <p className="text-sm text-slate-600">
        Active tenants with ERP dashboards, catalogue pages, and team accounts.
      </p>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Company</th>
              <th className="hidden px-4 py-3 md:table-cell">Sector</th>
              <th className="hidden px-4 py-3 lg:table-cell">Users</th>
              <th className="px-4 py-3">Catalogue</th>
              <th className="px-4 py-3 text-right">Since</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Loading…</td>
              </tr>
            )}
            {!loading && companies.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  No companies yet. Approve a registration to create one.
                </td>
              </tr>
            )}
            {!loading &&
              companies.map((c) => (
                <tr key={c.id} className="hover:bg-[#f8faff]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.email}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-700 md:table-cell">{c.sector}</td>
                  <td className="hidden px-4 py-3 lg:table-cell">{c.userCount}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/catalog/${c.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-[#0033ad] font-medium"
                    >
                      /catalog/{c.slug}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
