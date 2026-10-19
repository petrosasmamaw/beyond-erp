export function applyOrderToStore(data, order) {
  const items = order.items || []

  const products = (data.products || []).map((p) => {
    const qty = items
      .filter((i) => i.productId === p.id)
      .reduce((sum, i) => sum + (i.quantity || 0), 0)
    if (qty === 0) return p
    return {
      ...p,
      totalOrders: (p.totalOrders || 0) + qty,
      lastWeekOrders: (p.lastWeekOrders || 0) + qty,
    }
  })

  let inventory = [...(data.inventory || [])]
  for (const line of items) {
    const product = products.find((p) => p.id === line.productId)
    if (!product || product.type !== "product") continue
    const nameKey = product.name.trim().toLowerCase()
    inventory = inventory.map((inv) => {
      if (inv.name.trim().toLowerCase() !== nameKey) return inv
      return {
        ...inv,
        stock: Math.max(0, (inv.stock || 0) - (line.quantity || 0)),
      }
    })
  }

  const finance = {
    totalRevenue: (data.finance?.totalRevenue || 0) + (order.total || 0),
    totalOrders: (data.finance?.totalOrders || 0) + 1,
    totalVat: (data.finance?.totalVat || 0) + (order.tax || 0),
    totalSubtotal: (data.finance?.totalSubtotal || 0) + (order.subtotal || 0),
  }

  const orders = [order, ...(data.orders || [])].slice(0, 500)

  return {
    ...data,
    products,
    inventory,
    orders,
    finance,
    updatedAt: new Date().toISOString(),
  }
}
