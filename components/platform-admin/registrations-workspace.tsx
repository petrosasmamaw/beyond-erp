"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { apiFetch, apiUrl, getAuthToken } from "@/lib/api-client"
import type { PlatformRegistration } from "@/lib/platform-admin-types"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { BillingBadge } from "@/components/platform-admin/payment-summary"

type FilterMode = "all" | "pending" | "approved"

function statusBadge(status: string) {
  const s = status.toLowerCase()
  if (s === "approved") return "bg-emerald-50 text-emerald-800 ring-emerald-200"
  if (s === "pending") return "bg-amber-50 text-amber-900 ring-amber-200"
  return "bg-slate-100 text-slate-700 ring-slate-200"
}

export function RegistrationsWorkspace({
  filter = "all",
  showPaymentColumn = true,
}: {
  filter?: FilterMode
  showPaymentColumn?: boolean
}) {
  const [items, setItems] = useState<PlatformRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<PlatformRegistration | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [approving, setApproving] = useState(false)
  const [resending, setResending] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [manualCredentials, setManualCredentials] = useState<{
    email: string
    password: string
  } | null>(null)
  const [billingType, setBillingType] = useState<"paid" | "promotional">("paid")

  const load = useCallback(() => {
    setLoading(true)
    apiFetch("/api/platform/registrations")
      .then((r) => r.json())
      .then((d) => setItems(d.registrations ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    let list = items
    if (filter === "pending") list = list.filter((r) => r.status === "pending")
    if (filter === "approved") list = list.filter((r) => r.status === "approved")
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter(
      (r) =>
        r.companyName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.paymentReference.toLowerCase().includes(q) ||
        r.sector.toLowerCase().includes(q)
    )
  }, [items, filter, query])

  const applyEmailResult = (
    prefix: string,
    credentials: { email: string; password: string },
    email?: { sent?: boolean; reason?: string }
  ) => {
    if (email?.sent) {
      setManualCredentials(null)
      setNotice(`${prefix} Login email sent to ${credentials.email}.`)
      return
    }
    setManualCredentials(credentials)
    setNotice(
      `${prefix} Email could not be sent. Copy the credentials below and share them with the client.`
    )
  }

  const copyCredentials = async () => {
    if (!manualCredentials) return
    const text = `Beyond Solution login\nEmail: ${manualCredentials.email}\nPassword: ${manualCredentials.password}\nURL: ${window.location.origin}/login`
    await navigator.clipboard.writeText(text)
    setNotice("Credentials copied to clipboard.")
  }

  const openDetail = async (id: string) => {
    setLoadingDetail(true)
    setNotice(null)
    try {
      const res = await apiFetch(`/api/platform/registrations/${id}`)
      const data = await res.json()
      if (res.ok) {
        setSelected(data.registration)
        setBillingType("paid")
      }
    } finally {
      setLoadingDetail(false)
    }
  }

  const downloadLicense = async (id: string, fileName: string) => {
    const token = getAuthToken()
    const res = await fetch(apiUrl(`/api/platform/registrations/${id}/license`), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName || "license"
    a.click()
    URL.revokeObjectURL(url)
  }

  const approve = async (id: string) => {
    setApproving(true)
    setNotice(null)
    try {
      const res = await apiFetch("/api/platform/registrations", {
        method: "POST",
        body: JSON.stringify({ id, action: "approve", billingType }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice(data.error || "Approval failed")
        return
      }
      applyEmailResult("Approved.", data.credentials, data.email)
      setSelected(data.registration)
      load()
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Approval failed")
    } finally {
      setApproving(false)
    }
  }

  const resendCredentials = async (id: string) => {
    setResending(true)
    setNotice(null)
    try {
      const res = await apiFetch(`/api/platform/registrations/${id}/resend-credentials`, {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice(data.error || "Resend failed")
        return
      }
      applyEmailResult("New password created.", data.credentials, data.email)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Resend failed")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search company, email, reference…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none ring-[#0033ad]/20 focus:ring-2"
          />
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {notice && (
        <div className="rounded-lg border border-[#dbe4ff] bg-white px-4 py-3 text-sm text-slate-700">
          {notice}
        </div>
      )}

      {manualCredentials && (
        <div className="rounded-lg border border-[#0033ad]/20 bg-white p-4 text-sm shadow-sm">
          <p className="font-semibold text-[#0033ad]">Login credentials</p>
          <p className="mt-2 font-mono text-slate-800">{manualCredentials.email}</p>
          <p className="font-mono font-semibold text-slate-900">{manualCredentials.password}</p>
          <button
            type="button"
            onClick={copyCredentials}
            className="mt-3 rounded-lg bg-[#0033ad] px-3 py-2 text-xs font-semibold text-white"
          >
            Copy credentials
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="hidden px-4 py-3 md:table-cell">Contact</th>
                {showPaymentColumn && (
                  <th className="hidden px-4 py-3 lg:table-cell">Payment</th>
                )}
                <th className="px-4 py-3">Billing</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No registrations match this view.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-[#f8faff]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{reg.companyName}</p>
                      <p className="text-xs text-slate-500">{reg.sector}</p>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <p className="text-slate-800">{reg.contactName}</p>
                      <p className="text-xs text-slate-500">{reg.email}</p>
                    </td>
                    {showPaymentColumn && (
                      <td className="hidden px-4 py-3 lg:table-cell">
                        <p className="uppercase text-xs font-medium text-slate-600">
                          {reg.paymentMethod}
                        </p>
                        <p className="font-mono text-xs text-slate-500">{reg.paymentReference}</p>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <BillingBadge reg={reg} />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                          statusBadge(reg.status)
                        )}
                      >
                        {reg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(reg.id)}
                        className="rounded-lg px-3 py-1.5 text-sm font-medium text-[#0033ad] hover:bg-[#0033ad]/5"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {(selected || loadingDetail) && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => !loadingDetail && setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loadingDetail && !selected ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : selected ? (
              <>
                <h2 className="text-xl font-bold text-[#0033ad]">{selected.companyName}</h2>
                <p className="text-sm capitalize text-slate-500">{selected.status}</p>

                <dl className="mt-6 space-y-3 text-sm">
                  <DetailRow label="Sector" value={selected.sector} />
                  <DetailRow label="Contact" value={selected.contactName} />
                  <DetailRow label="Email" value={selected.email} />
                  <DetailRow label="Phone" value={selected.phone} />
                  <DetailRow label="Address" value={selected.address} />
                  <DetailRow
                    label="Payment"
                    value={`${selected.paymentMethod?.toUpperCase()} · ${selected.paymentReference}`}
                  />
                  <DetailRow label="Plan" value={selected.plan} />
                  <DetailRow
                    label="Amount due"
                    value={
                      selected.expectedAmountEtb != null
                        ? `${selected.expectedAmountEtb.toLocaleString()} ETB`
                        : "—"
                    }
                  />
                  {selected.status === "approved" && (
                    <DetailRow
                      label="Billing"
                      value={
                        selected.billingType === "promotional"
                          ? "Promotional (0 ETB)"
                          : `Paid (${(selected.amountEtb ?? 0).toLocaleString()} ETB)`
                      }
                    />
                  )}
                  <DetailRow
                    label="Submitted"
                    value={new Date(selected.createdAt).toLocaleString()}
                  />
                  {selected.reviewedAt && (
                    <DetailRow
                      label="Reviewed"
                      value={new Date(selected.reviewedAt).toLocaleString()}
                    />
                  )}
                  {selected.licenseFile && (
                    <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span className="text-slate-500">License</span>
                      <button
                        type="button"
                        onClick={() => downloadLicense(selected.id, selected.licenseFile)}
                        className="font-medium text-[#0033ad]"
                      >
                        Download
                      </button>
                    </div>
                  )}
                </dl>

                {selected.status === "pending" && (
                  <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Billing on approval
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setBillingType("paid")}
                        className={cn(
                          "rounded-lg border py-2.5 text-sm font-medium",
                          billingType === "paid"
                            ? "border-[#0033ad] bg-[#e8eeff] text-[#0033ad]"
                            : "border-slate-200 bg-white text-slate-600"
                        )}
                      >
                        Paid · {(selected.expectedAmountEtb ?? 0).toLocaleString()} ETB
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingType("promotional")}
                        className={cn(
                          "rounded-lg border py-2.5 text-sm font-medium",
                          billingType === "promotional"
                            ? "border-violet-600 bg-violet-50 text-violet-800"
                            : "border-slate-200 bg-white text-slate-600"
                        )}
                      >
                        Promotional · 0 ETB
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  {selected.status === "pending" && (
                    <button
                      type="button"
                      disabled={approving}
                      onClick={() => approve(selected.id)}
                      className="flex-1 rounded-lg bg-[#0033ad] py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {approving ? "Approving…" : "Approve & send login"}
                    </button>
                  )}
                  {selected.status === "approved" && (
                    <button
                      type="button"
                      disabled={resending}
                      onClick={() => resendCredentials(selected.id)}
                      className="flex-1 rounded-lg border border-[#0033ad] py-3 text-sm font-semibold text-[#0033ad] disabled:opacity-60"
                    >
                      {resending ? "Sending…" : "Resend credentials"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-sm"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 border-b border-slate-50 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="col-span-2 font-medium text-slate-900">{value}</dd>
    </div>
  )
}
