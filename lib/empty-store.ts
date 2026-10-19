import type {
  AppStore,
  BusinessProfile,
  Employee,
  FinanceSummary,
  InventoryItem,
  Product,
  Supplier,
} from "./types"

export const emptyBusiness: BusinessProfile = {
  name: "",
  tagline: "",
  slug: "",
  email: "",
  phone: "",
  address: "",
}

export const emptyFinance = {
  totalRevenue: 0,
  totalOrders: 0,
  totalVat: 0,
  totalSubtotal: 0,
}

export function applyAppStore(
  data: Partial<AppStore> & { finance?: FinanceSummary },
  setters: {
    setProducts: (v: Product[]) => void
    setEmployees: (v: Employee[]) => void
    setInventory: (v: InventoryItem[]) => void
    setSuppliers: (v: Supplier[]) => void
    setBusiness: (v: BusinessProfile) => void
    setFinance: (v: FinanceSummary) => void
  }
) {
  if (data.products) setters.setProducts(data.products)
  if (data.employees) setters.setEmployees(data.employees)
  if (data.inventory) setters.setInventory(data.inventory)
  if (data.suppliers) setters.setSuppliers(data.suppliers)
  if (data.business) setters.setBusiness(data.business)
  if (data.finance) setters.setFinance(data.finance)
  else if (data.orders) {
    const subtotal = data.orders.reduce((s, o) => s + (o.subtotal || 0), 0)
    const tax = data.orders.reduce((s, o) => s + (o.tax || 0), 0)
    const total = data.orders.reduce((s, o) => s + (o.total || 0), 0)
    setters.setFinance({
      totalRevenue: total,
      totalOrders: data.orders.length,
      totalVat: tax,
      totalSubtotal: subtotal,
    })
  }
}
