export function createDefaultStore(company) {
  return {
    business: {
      name: company.name,
      tagline: `${company.sector || "Business"} · SME workspace`,
      slug: company.slug,
      email: company.email,
      phone: company.phone,
      address: company.address || "",
    },
    products: [],
    employees: [],
    inventory: [],
    suppliers: [],
    orders: [],
    finance: {
      totalRevenue: 0,
      totalOrders: 0,
      totalVat: 0,
      totalSubtotal: 0,
    },
    updatedAt: new Date().toISOString(),
  }
}
