export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  type: "product" | "service"
  isActive: boolean
  totalOrders: number
  lastWeekOrders: number
}

export interface Employee {
  id: string
  name: string
  role: "admin" | "cashier" | "sales" | "inventory"
  email: string
  phone: string
  status: "active" | "inactive"
  shift: "morning" | "afternoon" | "evening"
  salary: number
  bankAccount: string
  hireDate: string
}

export interface InventoryItem {
  id: string
  name: string
  stock: number
  unit: string
  minStock: number
  maxStock: number
  costPerUnit: number
  supplier: string
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  items: string
  lastOrder: string
  status: "Active" | "Inactive"
  totalOrders: number
  paymentTerms: string
}

export interface OrderRecord {
  id: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  createdAt: string
}

export interface BusinessProfile {
  name: string
  tagline: string
  slug: string
  email: string
  phone: string
  address: string
}

export interface FinanceSummary {
  totalRevenue: number
  totalOrders: number
  totalVat: number
  totalSubtotal: number
}

export interface AppStore {
  business: BusinessProfile
  products: Product[]
  employees: Employee[]
  inventory: InventoryItem[]
  suppliers: Supplier[]
  orders: OrderRecord[]
  finance?: FinanceSummary
  updatedAt: string
}
