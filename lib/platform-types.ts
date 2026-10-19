export type UserRole = "platform_admin" | "owner" | "admin" | "cashier" | "sales" | "inventory"

export interface Company {
  id: string
  name: string
  slug: string
  sector: string
  email: string
  phone: string
  status: "active" | "suspended"
  createdAt: string
}

export interface PlatformUser {
  id: string
  companyId: string | null
  name: string
  email: string
  passwordHash: string
  role: UserRole
  status: "active" | "disabled"
  createdAt: string
}

export type RegistrationStatus = "pending" | "approved" | "rejected"

export interface RegistrationRequest {
  id: string
  companyName: string
  sector: string
  contactName: string
  email: string
  phone: string
  address: string
  licenseFileName: string
  paymentMethod: "cbe" | "telebirr"
  paymentReference: string
  plan: "starter"
  status: RegistrationStatus
  createdAt: string
  reviewedAt?: string
  companyId?: string
}

export interface PlatformStore {
  companies: Company[]
  users: PlatformUser[]
  registrations: RegistrationRequest[]
  updatedAt: string
}
