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
  expectedAmountEtb?: number | null
  billingType?: string | null
  amountEtb?: number | null
  companyId?: string
  createdAt: string
  reviewedAt?: string
}

export type PaymentSettings = {
  registrationFeeEtb: number
  telebirrAccount: string
  telebirrAccountName: string
  cbeAccount: string
  cbeAccountName: string
  updatedAt?: string
}

export type PlatformCompany = {
  id: string
  name: string
  slug: string
  sector: string
  email: string
  phone: string
  status: string
  userCount: number
  createdAt: string
}

export type PlatformStats = {
  registrationsPending: number
  registrationsApproved: number
  registrationsTotal: number
  activeCompanies: number
  registrationFeeEtb: number
  collectedRevenueEtb: number
  paidApprovals: number
  promotionalApprovals: number
  pendingExpectedEtb: number
  paymentsByMethod: { method: string; count: number }[]
}
