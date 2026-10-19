"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { apiFetch } from "@/lib/api-client"

type Member = { id: string; name: string; email: string; role: string }

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")

  const load = () => {
    apiFetch("/api/team")
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
  }

  useEffect(() => {
    load()
  }, [])

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    const res = await apiFetch("/api/team", {
      method: "POST",
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error || "Could not add member")
      return
    }
    setForm({ name: "", email: "", password: "" })
    setMessage("Team member added. Share these login details with them.")
    load()
  }

  return (
    <div className="min-h-screen bg-[#f4f7ff] px-4 py-6">
      <div className="mx-auto max-w-lg">
        <Link href="/dashboard" className="text-sm font-medium text-[#0033ad]">← Dashboard</Link>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">Team access</h1>
        <p className="mt-1 text-sm text-slate-600">Add employees who can sign in to your company workspace.</p>

        <form onSubmit={addMember} className="mt-6 space-y-3 rounded-xl border border-[#dbe4ff] bg-white p-4">
          <input
            placeholder="Full name"
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Temporary password"
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit" className="w-full rounded-lg bg-[#0033ad] py-3 text-sm font-semibold text-white">
            Add member
          </button>
          {message && <p className="text-sm text-green-700">{message}</p>}
        </form>

        <ul className="mt-6 divide-y rounded-xl border border-[#dbe4ff] bg-white">
          {members.map((m) => (
            <li key={m.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-slate-500">{m.email}</p>
              </div>
              <span className="rounded-full bg-[#e8eeff] px-2 py-1 text-xs text-[#0033ad]">{m.role}</span>
            </li>
          ))}
          {members.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-slate-500">No team members yet.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
