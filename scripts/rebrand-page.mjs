import fs from "fs"
import path from "path"

const file = path.join(process.cwd(), "app", "page.tsx")
let content = fs.readFileSync(file, "utf8")

const seedImport = `import { defaultStore, catalogueCategories } from "@/lib/seed"\nimport type { BusinessProfile } from "@/lib/types"\n`
if (!content.includes('from "@/lib/seed"')) {
  content = content.replace(
    'import { cn } from "@/lib/utils"\n',
    `import { cn } from "@/lib/utils"\n${seedImport}`
  )
}

// Remove legacy inline seed block
content = content.replace(
  /\/\/ Initial Data[\s\S]*?^const categories = \[[^\]]+\]\n/m,
  "const categories = catalogueCategories\n"
)

// Types
content = content.replace(
  /interface Product \{[\s\S]*?lastWeekOrders: number\n\}/,
  `interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  type: "product" | "service"
  isActive: boolean
  totalOrders: number
  lastWeekOrders: number
}`
)

content = content.replace(
  /role: "admin" \| "cashier" \| "waiter" \| "inventory"/g,
  'role: "admin" | "cashier" | "sales" | "inventory"'
)
content = content.replace(
  /type UserRole = "admin" \| "cashier" \| "waiter" \| "inventory"/,
  'type UserRole = "admin" | "cashier" | "sales" | "inventory"'
)

content = content.replace(/nameAmharic/g, "description")

const colorMap = [
  ["#3E2723", "#0033AD"],
  ["#2E1713", "#002A8C"],
  ["#1E0703", "#001F70"],
  ["#5D4037", "#1E4BB8"],
  ["#D4AF37", "#FFFFFF"],
  ["#C9A432", "#E8EEFF"],
  ["#B89428", "#D0DCF5"],
  ["#C9A432", "#E8EEFF"],
]
for (const [from, to] of colorMap) {
  content = content.split(from).join(to)
}

const textMap = [
  ["/logo.svg", "/logo.png"],
  ["Luwak Coffee Logo", "Beyond Solution logo"],
  ["Luwak Coffee", "Beyond Solution"],
  ["Addis Ababa", "Business Management"],
  ["Beyond Solution RMS", "Beyond Solution RMS"],
  ['{ id: "menu", name: "Menu Management"', '{ id: "catalogue", name: "Catalogue"'],
  ['{ id: "suppliers", name: "Addis Supplier Logs"', '{ id: "suppliers", name: "Suppliers"'],
  ['{ id: "reports", name: "ERCA VAT Reports"', '{ id: "reports", name: "Tax & Reports"'],
  ["Menu QR Code", "Catalogue link & QR"],
  ["Menu QR", "Catalogue QR"],
  ["Menu items and prices", "Catalogue items and prices"],
  ["luwak-coffee-menu-qr.png", "catalogue-qr.png"],
  ["https://luwak-coffee.et/menu", "/catalog/beyond-solution"],
  ["waiter: \"Waiter\"", 'sales: "Sales"'],
  ["\"waiter\"", '"sales"'],
  ["Restaurant", "Business"],
  ["Coffee", "Store"],
  ['activeNav === "menu"', 'activeNav === "catalogue"'],
  ['setActiveNav("menu")', 'setActiveNav("catalogue")'],
  ['useState("Signature Luwak")', 'useState("Services")'],
  ['category: "Signature Luwak"', 'category: "Services"'],
  ["Signature Luwak", "Services"],
  ["Espresso Bar", "Products"],
  ["Pastries", "Packages"],
  ["Breakfast", "Add-ons"],
]

for (const [from, to] of textMap) {
  content = content.split(from).join(to)
}

content = content.replace(
  /const \[products, setProducts\] = useState<Product\[]>\(initialProducts\)/,
  "const [products, setProducts] = useState<Product[]>(defaultStore.products)"
)
content = content.replace(
  /const \[employees, setEmployees\] = useState<Employee\[]>\(initialEmployees\)/,
  "const [employees, setEmployees] = useState<Employee[]>(defaultStore.employees)"
)
content = content.replace(
  /const \[inventory, setInventory\] = useState<InventoryItem\[]>\(initialInventory\)/,
  "const [inventory, setInventory] = useState<InventoryItem[]>(defaultStore.inventory)"
)
content = content.replace(
  /const \[suppliers, setSuppliers\] = useState<Supplier\[]>\(initialSuppliers\)/,
  "const [suppliers, setSuppliers] = useState<Supplier[]>(defaultStore.suppliers)"
)

if (!content.includes("business, setBusiness")) {
  content = content.replace(
    /const \[suppliers, setSuppliers\] = useState<Supplier\[]>\(defaultStore\.suppliers\)\n/,
    `const [suppliers, setSuppliers] = useState<Supplier[]>(defaultStore.suppliers)
  const [business, setBusiness] = useState<BusinessProfile>(defaultStore.business)
`
  )
}

if (!content.includes("persistStore")) {
  content = content.replace(
    /const navItems = getNavItems\(\)\n/,
    `const navItems = getNavItems()

  const persistStore = useCallback(async (patch: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/store", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.business) setBusiness(data.business)
      }
    } catch {
      /* keep local state if offline */
    }
  }, [])

  useEffect(() => {
    fetch("/api/store")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setProducts(data.products)
        if (data.employees) setEmployees(data.employees)
        if (data.inventory) setInventory(data.inventory)
        if (data.suppliers) setSuppliers(data.suppliers)
        if (data.business) setBusiness(data.business)
      })
      .catch(() => {})
  }, [])
`
  )
}

content = content.replace(
  /const menuUrl = typeof window !== 'undefined' \? `\$\{window\.location\.origin\}\/menu` : '[^']*'/,
  "const menuUrl = typeof window !== 'undefined' ? `${window.location.origin}/catalog/${business.slug}` : `/catalog/${defaultStore.business.slug}`"
)

fs.writeFileSync(file, content)
console.log("Rebranded app/page.tsx")
