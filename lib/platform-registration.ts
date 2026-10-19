export type PlatformRegistration = {
  id: string
  companyName: string
  sector: string
  contactName: string
  email: string
  phone: string
  address: string
  licenseFile: string
  paymentMethod: string
  paymentReference: string
  plan: string
  status: string
  companyId?: string
  createdAt: string
  reviewedAt?: string
}

export type PlatformStats = {
  pendingRegistrations: number
  approvedRegistrations: number
  totalRegistrations: number
  activeCompanies: number
  monthlyRevenueEtb: number
  paymentsByMethod: { method: string; count: number }[]
}

export type PlatformCompany = {
  id: string
  name: string
  slug: string
  sector: string
  email: string
  phone: string
  teamMembers: number
  createdAt: string
}

export function formatPaymentMethod(method: string) {
  const m = method?.toLowerCase() ?? ""
  if (m === "cbe") return "CBE"
  if (m === "telebirr") return "Telebirr"
  return method?.toUpperCase() || "—"
}

export function statusBadgeClass(status: string) {
  if (status === "approved") return "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
  if (status === "pending") return "bg-amber-50 text-amber-800 ring-amber-600/20"
  return "bg-slate-100 text-slate-600 ring-slate-500/20"
}
