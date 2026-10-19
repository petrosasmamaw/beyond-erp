"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SiteShell } from "@/components/marketing/site-shell"
import { apiFetch } from "@/lib/api-client"
import type { PaymentSettings } from "@/lib/platform-admin-types"

const sectors = [
  "Retail",
  "Hospitality",
  "Technology",
  "Manufacturing",
  "Healthcare",
  "Professional services",
  "Other",
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [paymentInfo, setPaymentInfo] = useState<PaymentSettings | null>(null)
  const [form, setForm] = useState({
    companyName: "",
    sector: "Retail",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "telebirr" as "cbe" | "telebirr",
    paymentReference: "",
  })
  const [license, setLicense] = useState<File | null>(null)

  useEffect(() => {
    apiFetch("/api/register/payment-info")
      .then((r) => r.json())
      .then((d) => setPaymentInfo(d.settings))
      .catch(() => setPaymentInfo(null))
  }, [])

  const fee = paymentInfo?.registrationFeeEtb ?? 2500

  const submit = async () => {
    setError("")
    setLoading(true)
    try {
      const body = new FormData()
      Object.entries(form).forEach(([k, v]) => body.append(k, v))
      if (license) body.append("license", license)
      const res = await apiFetch("/api/register", { method: "POST", body })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")
      router.push("/register/confirmation")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const accountBlock =
    form.paymentMethod === "telebirr"
      ? {
          label: "Telebirr",
          number: paymentInfo?.telebirrAccount ?? "0911000000",
          name: paymentInfo?.telebirrAccountName ?? "Beyond Solution PLC",
        }
      : {
          label: "CBE Birr",
          number: paymentInfo?.cbeAccount ?? "1000000000000",
          name: paymentInfo?.cbeAccountName ?? "Beyond Solution PLC",
        }

  return (
    <SiteShell ctaHref="/login" ctaLabel="Login">
      <section className="mx-auto max-w-lg px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900">Company registration</h1>
        <p className="mt-2 text-sm text-slate-600">
          Step {step} of 2 · We review payment and license, then email your login details.
        </p>

        {step === 1 ? (
          <div className="mt-6 space-y-4 rounded-xl border border-[#dbe4ff] bg-white p-5">
            <Field label="Company name" value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} />
            <label className="block text-sm font-medium text-slate-700">
              Sector
              <select
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
              >
                {sectors.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <Field label="Contact person" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            <label className="block text-sm font-medium text-slate-700">
              Business license (PDF or image)
              <input
                type="file"
                accept=".pdf,image/*"
                className="mt-1 w-full text-sm"
                onChange={(e) => setLicense(e.target.files?.[0] ?? null)}
              />
            </label>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full rounded-lg bg-[#0033ad] py-3 text-sm font-semibold text-white"
            >
              Continue to payment
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4 rounded-xl border border-[#dbe4ff] bg-white p-5">
            <p className="text-sm text-slate-600">
              Transfer <strong>{fee.toLocaleString()} ETB</strong> manually, then enter your
              transaction ID below.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["telebirr", "cbe"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setForm({ ...form, paymentMethod: method })}
                  className={`rounded-lg border py-3 text-sm font-medium capitalize ${
                    form.paymentMethod === method
                      ? "border-[#0033ad] bg-[#e8eeff] text-[#0033ad]"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {method === "cbe" ? "CBE Birr" : "Telebirr"}
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-[#f4f7ff] p-4 text-sm text-slate-700">
              <p className="font-semibold text-[#0033ad]">{accountBlock.label}</p>
              <p className="mt-1 font-mono text-base">{accountBlock.number}</p>
              <p className="text-slate-600">{accountBlock.name}</p>
            </div>
            <Field
              label="Payment reference / transaction ID"
              value={form.paymentReference}
              onChange={(v) => setForm({ ...form, paymentReference: v })}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-lg border py-3 text-sm">
                Back
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={submit}
                className="flex-1 rounded-lg bg-[#0033ad] py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {loading ? "Submitting…" : "Submit registration"}
              </button>
            </div>
          </div>
        )}
      </section>
    </SiteShell>
  )
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
      />
    </label>
  )
}
