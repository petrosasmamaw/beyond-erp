"use client"

import { useEffect, useState } from "react"
import { apiFetch } from "@/lib/api-client"
import type { PaymentSettings } from "@/lib/platform-admin-types"

export function PaymentSetupForm() {
  const [form, setForm] = useState<PaymentSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    apiFetch("/api/platform/payment-settings")
      .then((r) => r.json())
      .then((d) => setForm(d.settings))
  }, [])

  const save = async () => {
    if (!form) return
    setSaving(true)
    setNotice(null)
    try {
      const res = await apiFetch("/api/platform/payment-settings", {
        method: "PUT",
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice(data.error || "Could not save")
        return
      }
      setForm(data.settings)
      setNotice("Payment settings saved. New registrations will use these details.")
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  if (!form) {
    return <p className="text-sm text-slate-500">Loading payment setup…</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <p className="text-sm text-slate-600">
        These values appear on the public registration page and define how much ETB customers should
        transfer before submitting their transaction ID.
      </p>

      {notice && (
        <div className="rounded-lg border border-[#dbe4ff] bg-white px-4 py-3 text-sm text-slate-700">
          {notice}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-slate-900">Registration fee</h2>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Amount (ETB)
          <input
            type="number"
            min={0}
            value={form.registrationFeeEtb}
            onChange={(e) =>
              setForm({ ...form, registrationFeeEtb: Number(e.target.value) || 0 })
            }
            className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2.5"
          />
        </label>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-900">Telebirr</h2>
        <Field
          label="Account / phone number"
          value={form.telebirrAccount}
          onChange={(v) => setForm({ ...form, telebirrAccount: v })}
        />
        <Field
          label="Account name"
          value={form.telebirrAccountName}
          onChange={(v) => setForm({ ...form, telebirrAccountName: v })}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-semibold text-slate-900">CBE Birr</h2>
        <Field
          label="Account number"
          value={form.cbeAccount}
          onChange={(v) => setForm({ ...form, cbeAccount: v })}
        />
        <Field
          label="Account name"
          value={form.cbeAccountName}
          onChange={(v) => setForm({ ...form, cbeAccountName: v })}
        />
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={save}
        className="rounded-lg bg-[#0033ad] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save payment setup"}
      </button>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5"
      />
    </label>
  )
}
