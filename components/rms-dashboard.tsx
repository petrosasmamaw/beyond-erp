"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  FileText, 
  Menu,
  X,
  Store,
  CreditCard,
  Banknote,
  Smartphone,
  Building2,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  User,
  Users,
  ChevronDown,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  BarChart3,
  UtensilsCrossed,
  Shield,
  LogOut,
  Search,
  PlusCircle,
  WifiOff,
  RefreshCw,
  Loader2,
  QrCode,
  DollarSign,
  Calendar,
  Download,
  RotateCcw,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Building,
  ChevronRight,
  Home,
  LayoutGrid
} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiFetch, clearAuthToken } from "@/lib/api-client"
import { catalogueCategories } from "@/lib/catalogue-categories"
import { applyAppStore, emptyBusiness, emptyFinance } from "@/lib/empty-store"
import type { FinanceSummary } from "@/lib/types"
import type { BusinessProfile } from "@/lib/types"

// Types
interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  isActive: boolean
  totalOrders: number
  lastWeekOrders: number
}

interface CartItem extends Product {
  quantity: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

interface Employee {
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

interface InventoryItem {
  id: string
  name: string
  stock: number
  unit: string
  minStock: number
  maxStock: number
  costPerUnit: number
  supplier: string
}

interface Supplier {
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

type UserRole = "admin" | "cashier" | "sales" | "inventory"

const categories = catalogueCategories

const paymentMethods: PaymentMethod[] = [
  { id: "telebirr", name: "Telebirr", icon: <Smartphone className="w-6 h-6 md:w-8 md:h-8" />, color: "bg-[#00A9E0] hover:bg-[#0095C8] active:bg-[#0085B8]" },
  { id: "cbe", name: "CBE Birr", icon: <Building2 className="w-6 h-6 md:w-8 md:h-8" />, color: "bg-[#1E3A8A] hover:bg-[#1E3070] active:bg-[#1E2860]" },
  { id: "cash", name: "Cash", icon: <Banknote className="w-6 h-6 md:w-8 md:h-8" />, color: "bg-[#16A34A] hover:bg-[#15803D] active:bg-[#14702D]" },
  { id: "card", name: "Card", icon: <CreditCard className="w-6 h-6 md:w-8 md:h-8" />, color: "bg-[#7C3AED] hover:bg-[#6D28D9] active:bg-[#5D18C9]" },
]

const roleLabels: Record<UserRole, string> = {
  admin: "Admin / Owner",
  cashier: "Cashier",
  sales: "Sales",
  inventory: "Inventory Manager"
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  admin: <Shield className="w-4 h-4" />,
  cashier: <Receipt className="w-4 h-4" />,
  sales: <User className="w-4 h-4" />,
  inventory: <Package className="w-4 h-4" />
}

// Splash Screen Component - Faster Animation
function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 5 // Faster progress
      })
    }, 20) // Faster interval

    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1000) // Faster fade

    const completeTimer = setTimeout(() => {
      onComplete()
    }, 1400) // Faster completion

    return () => {
      clearInterval(progressInterval)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[100] bg-[#0033AD] flex flex-col items-center justify-center transition-opacity duration-400",
        fadeOut && "opacity-0"
      )}
    >
      <div className="relative mb-6 animate-[pulse_1s_ease-in-out_infinite]">
        <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
          <Image 
            src="/logo.png" 
            alt="Beyond Solution logo" 
            width={70} 
            height={70} 
            className="object-contain animate-[fadeIn_0.3s_ease-out] md:w-[90px] md:h-[90px]"
            priority
          />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-[#FFFFFF]/20 blur-xl animate-pulse" />
      </div>

      <h1 className="text-xl md:text-2xl font-bold text-white mb-1 animate-[fadeIn_0.3s_ease-out]">
        Beyond Solution
      </h1>
      <p className="text-white/70 text-xs md:text-sm mb-6 animate-[fadeIn_0.3s_ease-out]">
        Business Management
      </p>

      <div className="w-40 md:w-56 h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#FFFFFF] transition-all duration-75 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-white/50 text-xs mt-3">
        Beyond Solution RMS
      </p>
    </div>
  )
}

// Offline Screen Component
function OfflineScreen({ onRetry }: { onRetry: () => void }) {
  const [retrying, setRetrying] = useState(false)

  const handleRetry = () => {
    setRetrying(true)
    setTimeout(() => {
      setRetrying(false)
      onRetry()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#0033AD] flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
        <Image 
          src="/logo.png" 
          alt="Beyond Solution logo" 
          width={70} 
          height={70} 
          className="object-contain opacity-50 md:w-[90px] md:h-[90px]"
          priority
        />
      </div>

      <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <WifiOff className="w-7 h-7 text-red-400" />
      </div>

      <h2 className="text-lg md:text-xl font-bold text-white mb-2 text-center">Poor Network</h2>
      <p className="text-white/60 text-sm text-center mb-6 max-w-xs">
        Unable to connect to the server. Please check your connection.
      </p>

      <button
        onClick={handleRetry}
        disabled={retrying}
        className="flex items-center gap-2 px-6 py-3 bg-[#FFFFFF] text-[#0033AD] font-semibold rounded-lg hover:bg-[#E8EEFF] active:bg-[#D0DCF5] transition-colors disabled:opacity-70"
      >
        {retrying ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <RefreshCw className="w-5 h-5" />
        )}
        {retrying ? "Connecting..." : "Try Again"}
      </button>

      <p className="absolute bottom-6 text-white/30 text-xs">
        Beyond Solution RMS
      </p>
    </div>
  )
}

// Loading Overlay Component
function LoadingOverlay({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[90] bg-[#0033AD]/90 flex flex-col items-center justify-center backdrop-blur-sm">
      <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-4 animate-pulse">
        <Loader2 className="w-7 h-7 text-[#FFFFFF] animate-spin" />
      </div>
      <p className="text-white/80 text-sm">{message}</p>
    </div>
  )
}

// QR Code Modal Component
function QRCodeModal({ onClose, menuUrl }: { onClose: () => void; menuUrl: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-sm p-6 animate-[scaleIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0033AD]">Catalogue link & QR</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center mb-4">
          <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
            <QRCodeSVG 
              value={menuUrl}
              size={180}
              level="H"
              includeMargin={false}
              bgColor="#FFFFFF"
              fgColor="#0033AD"
            />
          </div>
          <p className="text-sm text-gray-600 text-center mb-3">
            Share this link on social bio or print the QR for customers.
          </p>
          <div className="w-full flex gap-2">
            <input
              readOnly
              value={menuUrl}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-700"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(menuUrl)}
              className="shrink-0 rounded-lg bg-[#0033AD] px-3 py-2 text-xs font-medium text-white"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              const svg = document.querySelector('.qr-code-svg')
              if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg)
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const img = new window.Image()
                img.crossOrigin = "anonymous"
                img.onload = () => {
                  canvas.width = img.width
                  canvas.height = img.height
                  ctx?.drawImage(img, 0, 0)
                  const link = document.createElement('a')
                  link.download = 'catalogue-qr.png'
                  link.href = canvas.toDataURL()
                  link.click()
                }
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
              }
            }}
            className="flex-1 py-3 bg-[#0033AD] text-white rounded-lg font-semibold hover:bg-[#002A8C] active:bg-[#001F70] transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Reset Confirmation Modal
function ResetConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [confirmText, setConfirmText] = useState("")

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4" onClick={onCancel}>
      <div 
        className="bg-white rounded-2xl w-full max-w-md p-6 animate-[scaleIn_0.2s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#0033AD]">Reset All Data?</h3>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800 mb-2">
            This will reset all data including:
          </p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            <li>All employee records</li>
            <li>Inventory data</li>
            <li>Catalogue items and prices</li>
            <li>Supplier information</li>
          </ul>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-bold text-red-600">RESET</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Type RESET here"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={confirmText !== "RESET"}
            className={cn(
              "flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2",
              confirmText === "RESET"
                ? "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default function POSSystem() {
  // App State
  const [showSplash, setShowSplash] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  
  // Current User State
  const [currentRole, setCurrentRole] = useState<UserRole>("admin")
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false)
  
  // Navigation State
  const [activeNav, setActiveNav] = useState("pos")
  const [activeCategory, setActiveCategory] = useState("Services")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileCartOpen, setMobileCartOpen] = useState(false)
  
  // POS State
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null)
  const [orderComplete, setOrderComplete] = useState(false)
  
  // Data State
  const [products, setProducts] = useState<Product[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [business, setBusiness] = useState<BusinessProfile>(emptyBusiness)
  const [finance, setFinance] = useState<FinanceSummary>(emptyFinance)
  const [storeLoaded, setStoreLoaded] = useState(false)
  const [storeError, setStoreError] = useState<string | null>(null)
  
  // Modal States
  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showInventoryModal, setShowInventoryModal] = useState(false)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [showPayrollModal, setShowPayrollModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [viewingPayroll, setViewingPayroll] = useState<Employee | null>(null)
  
  // Employee Tab State
  const [employeeTab, setEmployeeTab] = useState<"employees" | "payroll">("employees")
  
  // Form States
  const [employeeForm, setEmployeeForm] = useState({
    name: "", role: "cashier" as UserRole, email: "", phone: "", status: "active" as "active" | "inactive", shift: "morning" as "morning" | "afternoon" | "evening", salary: 0, bankAccount: "", hireDate: ""
  })
  const [inventoryForm, setInventoryForm] = useState({
    name: "", stock: 0, unit: "", minStock: 0, maxStock: 0, costPerUnit: 0, supplier: ""
  })
  const [productForm, setProductForm] = useState({
    name: "", description: "", price: 0, category: "Services", type: "service" as "product" | "service", isActive: true
  })
  const [supplierForm, setSupplierForm] = useState({
    name: "", contact: "", email: "", phone: "", address: "", items: "", status: "Active" as "Active" | "Inactive", paymentTerms: ""
  })
  
  // Search States
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [inventorySearch, setInventorySearch] = useState("")

  // Network Status Detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    if (typeof window !== 'undefined' && !navigator.onLine) {
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Navigation items based on role
  const getNavItems = useCallback(() => {
    const allItems = [
      { id: "pos", name: "POS", icon: <ShoppingCart className="w-5 h-5" />, roles: ["admin", "cashier", "sales"] },
      { id: "inventory", name: "Inventory Tracker", icon: <Package className="w-5 h-5" />, roles: ["admin", "inventory"] },
      { id: "suppliers", name: "Suppliers", icon: <Truck className="w-5 h-5" />, roles: ["admin", "inventory"] },
      { id: "reports", name: "Tax & Reports", icon: <FileText className="w-5 h-5" />, roles: ["admin"] },
      { id: "analytics", name: "Product Analytics", icon: <BarChart3 className="w-5 h-5" />, roles: ["admin"] },
      { id: "employees", name: "Employees & Payroll", icon: <Users className="w-5 h-5" />, roles: ["admin"] },
      { id: "catalogue", name: "Catalogue", icon: <LayoutGrid className="w-5 h-5" />, roles: ["admin"] },
    ]
    return allItems.filter(item => item.roles.includes(currentRole))
  }, [currentRole])

  const navItems = getNavItems()

  const applyStore = useCallback((data: Partial<import("@/lib/types").AppStore>) => {
    applyAppStore(data, {
      setProducts,
      setEmployees,
      setInventory,
      setSuppliers,
      setBusiness,
      setFinance,
    })
  }, [])

  const persistStore = useCallback(
    async (patch: Record<string, unknown>) => {
      try {
        const res = await apiFetch("/api/store", {
          method: "PUT",
          body: JSON.stringify(patch),
        })
        const data = await res.json()
        if (res.ok) {
          applyStore(data)
          setStoreError(null)
          return true
        }
        setStoreError(data.error || "Could not save to database")
        return false
      } catch (e) {
        setStoreError(e instanceof Error ? e.message : "Could not reach API")
        return false
      }
    },
    [applyStore]
  )

  const loadStoreFromApi = useCallback(async () => {
    setStoreError(null)
    try {
      const res = await apiFetch("/api/store")
      const data = await res.json()
      if (!res.ok) {
        setStoreError(data.error || "Could not load workspace from database")
        return
      }
      applyStore(data)
    } catch (e) {
      setStoreError(e instanceof Error ? e.message : "Could not reach API")
    } finally {
      setStoreLoaded(true)
    }
  }, [applyStore])

  useEffect(() => {
    loadStoreFromApi()
  }, [loadStoreFromApi])

  const filteredProducts = products.filter(p => p.category === activeCategory && (currentRole === "admin" || p.isActive))

  // Cart Functions
  const addToCart = (product: Product) => {
    if (!product.isActive && currentRole !== "admin") return
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const vatRate = 0.15
  const vat = subtotal * vatRate
  const total = subtotal + vat

  const clearCart = () => {
    setCart([])
    setShowCheckout(false)
    setSelectedPayment(null)
    setOrderComplete(false)
  }

  const handlePayment = async () => {
    if (!selectedPayment) return
    setIsLoading(true)
    setLoadingMessage("Processing payment...")
    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax: vat,
      total,
      paymentMethod: selectedPayment,
    }
    try {
      const res = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderPayload),
      })
      const data = await res.json()
      if (res.ok && data.store) {
        applyStore(data.store)
      }
      setOrderComplete(true)
      setTimeout(() => {
        clearCart()
        setMobileCartOpen(false)
      }, 2000)
    } catch {
      /* show complete anyway for UX; data stays consistent on refresh */
    } finally {
      setIsLoading(false)
    }
  }

  // Employee Functions
  const openAddEmployee = () => {
    setEditingEmployee(null)
    setEmployeeForm({ name: "", role: "cashier", email: "", phone: "", status: "active", shift: "morning", salary: 0, bankAccount: "", hireDate: new Date().toISOString().split('T')[0] })
    setShowEmployeeModal(true)
  }

  const openEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp)
    setEmployeeForm({ name: emp.name, role: emp.role, email: emp.email, phone: emp.phone, status: emp.status, shift: emp.shift, salary: emp.salary, bankAccount: emp.bankAccount, hireDate: emp.hireDate })
    setShowEmployeeModal(true)
  }

  const saveEmployee = () => {
    const nextEmployees = editingEmployee
      ? employees.map((e) => (e.id === editingEmployee.id ? { ...e, ...employeeForm } : e))
      : [...employees, { id: `e${Date.now()}`, ...employeeForm } as Employee]
    setEmployees(nextEmployees)
    persistStore({ employees: nextEmployees })
    setShowEmployeeModal(false)
  }

  const deleteEmployee = (id: string) => {
    const nextEmployees = employees.filter((e) => e.id !== id)
    setEmployees(nextEmployees)
    persistStore({ employees: nextEmployees })
  }

  // Inventory Functions
  const openAddInventory = () => {
    setEditingInventoryItem(null)
    setInventoryForm({ name: "", stock: 0, unit: "", minStock: 0, maxStock: 0, costPerUnit: 0, supplier: "" })
    setShowInventoryModal(true)
  }

  const openEditInventory = (item: InventoryItem) => {
    setEditingInventoryItem(item)
    setInventoryForm({ name: item.name, stock: item.stock, unit: item.unit, minStock: item.minStock, maxStock: item.maxStock, costPerUnit: item.costPerUnit, supplier: item.supplier })
    setShowInventoryModal(true)
  }

  const saveInventory = () => {
    const nextInventory = editingInventoryItem
      ? inventory.map((i) =>
          i.id === editingInventoryItem.id ? { ...i, ...inventoryForm } : i
        )
      : [...inventory, { id: `inv${Date.now()}`, ...inventoryForm } as InventoryItem]
    setInventory(nextInventory)
    persistStore({ inventory: nextInventory })
    setShowInventoryModal(false)
  }

  const deleteInventoryItem = (id: string) => {
    const nextInventory = inventory.filter((i) => i.id !== id)
    setInventory(nextInventory)
    persistStore({ inventory: nextInventory })
  }

  // Menu/Product Functions
  const openAddProduct = () => {
    setEditingProduct(null)
    setProductForm({ name: "", description: "", price: 0, category: "Services", type: "service", isActive: true })
    setShowMenuModal(true)
  }

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      description: prod.description || "",
      price: prod.price,
      category: prod.category,
      type: prod.type,
      isActive: prod.isActive,
    })
    setShowMenuModal(true)
  }

  const saveProduct = () => {
    const nextProducts = editingProduct
      ? products.map((p) => (p.id === editingProduct.id ? { ...p, ...productForm } : p))
      : [...products, { id: `p${Date.now()}`, ...productForm, totalOrders: 0, lastWeekOrders: 0 }]
    setProducts(nextProducts)
    persistStore({ products: nextProducts })
    setShowMenuModal(false)
  }

  const toggleProductActive = (id: string) => {
    const nextProducts = products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    setProducts(nextProducts)
    persistStore({ products: nextProducts })
  }

  const deleteProduct = (id: string) => {
    const nextProducts = products.filter((p) => p.id !== id)
    setProducts(nextProducts)
    persistStore({ products: nextProducts })
  }

  // Supplier Functions
  const openAddSupplier = () => {
    setEditingSupplier(null)
    setSupplierForm({ name: "", contact: "", email: "", phone: "", address: "", items: "", status: "Active", paymentTerms: "" })
    setShowSupplierModal(true)
  }

  const openEditSupplier = (sup: Supplier) => {
    setEditingSupplier(sup)
    setSupplierForm({ name: sup.name, contact: sup.contact, email: sup.email, phone: sup.phone, address: sup.address, items: sup.items, status: sup.status, paymentTerms: sup.paymentTerms })
    setShowSupplierModal(true)
  }

  const saveSupplier = () => {
    const nextSuppliers = editingSupplier
      ? suppliers.map((s) =>
          s.id === editingSupplier.id
            ? { ...s, ...supplierForm, lastOrder: s.lastOrder, totalOrders: s.totalOrders }
            : s
        )
      : [
          ...suppliers,
          {
            id: `sup${Date.now()}`,
            ...supplierForm,
            lastOrder: "Not yet",
            totalOrders: 0,
          } as Supplier,
        ]
    setSuppliers(nextSuppliers)
    persistStore({ suppliers: nextSuppliers })
    setShowSupplierModal(false)
  }

  const deleteSupplier = (id: string) => {
    const nextSuppliers = suppliers.filter((s) => s.id !== id)
    setSuppliers(nextSuppliers)
    persistStore({ suppliers: nextSuppliers })
  }

  const handleResetData = async () => {
    setIsLoading(true)
    setLoadingMessage("Resetting workspace…")
    setStoreError(null)
    try {
      const res = await apiFetch("/api/store/reset", { method: "POST" })
      const data = await res.json()
      if (res.ok) {
        applyStore(data)
        setCart([])
        setShowResetModal(false)
      } else {
        setStoreError(data.error || "Reset failed")
      }
    } catch (e) {
      setStoreError(e instanceof Error ? e.message : "Reset failed")
    } finally {
      setIsLoading(false)
    }
  }

  // Analytics Helpers
  const getLowPerformingProducts = () => {
    return products.filter(p => p.isActive && p.lastWeekOrders < 10).sort((a, b) => a.lastWeekOrders - b.lastWeekOrders)
  }

  const getTopPerformingProducts = () => {
    return [...products].filter(p => p.isActive).sort((a, b) => b.lastWeekOrders - a.lastWeekOrders).slice(0, 5)
  }

  const getLowStockItems = () => {
    return inventory.filter(i => i.stock <= i.minStock)
  }

  const getInventoryStatus = (item: InventoryItem) => {
    const percentage = (item.stock / item.maxStock) * 100
    if (item.stock <= item.minStock) return "critical"
    if (percentage <= 30) return "warning"
    return "good"
  }

  // Payroll calculations
  const calculateMonthlyPayroll = () => {
    return employees.filter(e => e.status === "active").reduce((sum, e) => sum + e.salary, 0)
  }

  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
    e.email.toLowerCase().includes(employeeSearch.toLowerCase())
  )

  const filteredInventory = inventory.filter(i =>
    i.name.toLowerCase().includes(inventorySearch.toLowerCase())
  )

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOffline(false)
    }
  }

  const menuUrl =
    typeof window !== "undefined" && business.slug
      ? `${window.location.origin}/catalog/${business.slug}`
      : business.slug
        ? `/catalog/${business.slug}`
        : "/catalog"

  // Show splash screen
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  // Show offline screen
  if (isOffline) {
    return <OfflineScreen onRetry={handleRetry} />
  }

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-[#FAFAF8]">
      {/* Loading Overlay */}
      {isLoading && <LoadingOverlay message={loadingMessage} />}

      {/* QR Modal */}
      {showQRModal && <QRCodeModal onClose={() => setShowQRModal(false)} menuUrl={menuUrl} />}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <ResetConfirmModal 
          onConfirm={handleResetData} 
          onCancel={() => setShowResetModal(false)} 
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative bg-[#0033AD] text-white flex flex-col transition-all duration-300 ease-in-out z-50 h-full",
          sidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-[#1E4BB8] flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <Image src="/logo.png" alt="Beyond Solution logo" width={40} height={40} className="object-contain" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-lg text-white leading-tight">{business.name}</h1>
              <p className="text-xs text-white/70">{business.tagline}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id)
                if (window.innerWidth < 1024) setSidebarOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left min-h-[48px] active:scale-[0.98]",
                activeNav === item.id
                  ? "bg-[#FFFFFF] text-[#0033AD] font-semibold"
                  : "text-white/80 hover:bg-[#1E4BB8] hover:text-white active:bg-[#002A8C]"
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm truncate">{item.name}</span>}
            </button>
          ))}

          {/* Admin Quick Actions */}
          {currentRole === "admin" && sidebarOpen && (
            <div className="pt-4 mt-4 border-t border-[#1E4BB8]">
              <p className="px-3 mb-2 text-xs text-white/50 uppercase tracking-wider">Quick Actions</p>
              <button
                onClick={() => setShowQRModal(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:bg-[#1E4BB8] transition-colors min-h-[48px] active:scale-[0.98]"
              >
                <QrCode className="w-5 h-5" />
                <span className="text-sm">Catalogue link & QR</span>
              </button>
              <Link
                href="/dashboard/team"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-white/80 hover:bg-[#1E4BB8] transition-colors min-h-[48px] active:scale-[0.98]"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Team access</span>
              </Link>
              <button
                onClick={() => setShowResetModal(true)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors min-h-[48px] active:scale-[0.98]"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="text-sm">Reset Data</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Section with Role Switcher */}
        <div className="p-3 border-t border-[#1E4BB8]">
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1E4BB8] active:bg-[#4D3027] transition-colors min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFFFFF] flex items-center justify-center flex-shrink-0">
                {roleIcons[currentRole]}
              </div>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-sm">{roleLabels[currentRole]}</p>
                    <p className="text-xs text-white/60">Shift: Morning</p>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", showRoleSwitcher && "rotate-180")} />
                </>
              )}
            </button>

            {/* Role Dropdown */}
            {showRoleSwitcher && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#1E4BB8] rounded-lg shadow-xl overflow-hidden animate-[slideUp_0.2s_ease-out]">
                <div className="p-2 text-xs text-white/60 border-b border-[#0033AD]">Switch Role</div>
                {(["admin", "cashier", "sales", "inventory"] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role)
                      setShowRoleSwitcher(false)
                      setActiveNav("pos")
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-[#0033AD] active:bg-[#002A8C] transition-colors min-h-[48px]",
                      currentRole === role && "bg-[#0033AD]"
                    )}
                  >
                    {roleIcons[role]}
                    <span className="text-sm">{roleLabels[role]}</span>
                    {currentRole === role && <CheckCircle2 className="w-4 h-4 ml-auto text-[#FFFFFF]" />}
                  </button>
                ))}
                <div className="border-t border-[#0033AD]">
                  <button
                    type="button"
                    onClick={async () => {
                      await apiFetch("/api/auth/logout", { method: "POST" })
                      clearAuthToken()
                      window.location.href = "/login"
                    }}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left text-red-400 hover:bg-[#0033AD] active:bg-[#002A8C] transition-colors min-h-[48px]"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button - Desktop Only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:block p-4 border-t border-[#1E4BB8] hover:bg-[#1E4BB8] active:bg-[#4D3027] transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5 mx-auto" /> : <Menu className="w-5 h-5 mx-auto" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6 text-[#0033AD]" />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#0033AD]">
                {navItems.find(n => n.id === activeNav)?.name || "POS"}
              </h2>
              <p className="text-xs md:text-sm text-gray-500">{currentDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            {/* Low Stock Alert */}
            {getLowStockItems().length > 0 && currentRole !== "sales" && currentRole !== "cashier" && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-700">{getLowStockItems().length} items low stock</span>
              </div>
            )}
            {/* Mobile QR Button for Admin */}
            {currentRole === "admin" && (
              <button 
                onClick={() => setShowQRModal(true)}
                className="md:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <QrCode className="w-5 h-5 text-[#0033AD]" />
              </button>
            )}
            <div className="text-right">
              <p className="text-base md:text-lg font-semibold text-[#0033AD]">{currentTime}</p>
            </div>
          </div>
        </header>

        {storeError && (
          <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 md:px-6">
            <span>{storeError}</span>
            <button
              type="button"
              onClick={() => loadStoreFromApi()}
              className="shrink-0 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-red-800 ring-1 ring-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {activeNav === "pos" && (
            <>
              {/* Products Section */}
              <div className={cn(
                "flex-1 flex flex-col overflow-hidden transition-all duration-300",
                mobileCartOpen ? "hidden md:flex" : "flex"
              )}>
                {/* Category Tabs */}
                <div className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-3 md:px-4 py-2 rounded-lg font-medium text-xs md:text-sm whitespace-nowrap transition-all min-h-[40px] active:scale-95",
                        activeCategory === cat
                          ? "bg-[#0033AD] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Products Grid */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                    {storeLoaded && filteredProducts.length === 0 && (
                      <p className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                        Your workspace is empty. Open <strong>Catalogue</strong> to add services or
                        products, then sell from POS. Stock items with the same name as a product will
                        decrease when you sell.
                      </p>
                    )}
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        disabled={!product.isActive && currentRole !== "admin"}
                        className={cn(
                          "bg-white rounded-xl p-3 md:p-4 text-left transition-all duration-200 border-2 min-h-[100px] md:min-h-[120px] active:scale-[0.98]",
                          product.isActive 
                            ? "border-transparent hover:border-[#FFFFFF] hover:shadow-lg active:border-[#E8EEFF]" 
                            : "border-gray-200 opacity-60",
                          cart.some(item => item.id === product.id) && "border-[#FFFFFF] bg-[#FFFFFF]/5"
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Store className={cn(
                            "w-6 h-6 md:w-8 md:h-8",
                            product.isActive ? "text-[#0033AD]" : "text-gray-400"
                          )} />
                          {!product.isActive && (
                            <span className="text-[10px] md:text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                              Inactive
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-[#0033AD] text-sm md:text-base mb-0.5 line-clamp-2">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-[10px] md:text-xs text-gray-500 mb-2">{product.description}</p>
                        )}
                        <p className="text-base md:text-lg font-bold text-[#0033AD]">
                          {product.price.toFixed(2)} ETB
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Cart Button */}
                {cart.length > 0 && (
                  <div className="md:hidden fixed bottom-4 left-4 right-4 z-30 safe-area-bottom">
                    <button
                      onClick={() => setMobileCartOpen(true)}
                      className="w-full bg-[#FFFFFF] text-[#0033AD] py-4 rounded-xl font-semibold flex items-center justify-center gap-3 shadow-lg active:bg-[#E8EEFF] active:scale-[0.98] transition-all"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>View Cart ({cart.length})</span>
                      <span className="bg-[#0033AD] text-[#FFFFFF] px-3 py-1 rounded-lg text-sm">
                        {total.toFixed(2)} ETB
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Receipt/Cart Section */}
              <div className={cn(
                "bg-white border-l border-gray-200 flex flex-col overflow-hidden",
                mobileCartOpen 
                  ? "fixed inset-0 z-50 md:relative md:w-[40%] lg:w-[35%] animate-[slideUp_0.2s_ease-out]" 
                  : "hidden md:flex md:w-[40%] lg:w-[35%]"
              )}>
                {/* Cart Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-[#0033AD]" />
                    <h3 className="font-bold text-lg text-[#0033AD]">Current Order</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="p-2 hover:bg-red-50 active:bg-red-100 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setMobileCartOpen(false)}
                      className="md:hidden p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                      <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
                      <p className="text-lg">No items yet</p>
                      <p className="text-sm">Tap products to add</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 animate-[fadeIn_0.2s_ease-out]"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[#0033AD] text-sm truncate">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.price.toFixed(2)} ETB each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-[#0033AD] w-16 text-right text-sm">
                            {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0 safe-area-bottom">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VAT (15%)</span>
                        <span className="font-medium">{vat.toFixed(2)} ETB</span>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div className="flex justify-between">
                        <span className="font-bold text-lg text-[#0033AD]">Total</span>
                        <span className="font-bold text-lg text-[#0033AD]">{total.toFixed(2)} ETB</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-[#0033AD] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#002A8C] active:bg-[#001F70] active:scale-[0.98] transition-all"
                    >
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Inventory Tracker */}
          {activeNav === "inventory" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] focus:border-transparent"
                  />
                </div>
                {currentRole === "admin" && (
                  <button
                    onClick={openAddInventory}
                    className="flex items-center gap-2 px-4 py-3 bg-[#0033AD] text-white rounded-lg hover:bg-[#002A8C] active:bg-[#001F70] transition-colors whitespace-nowrap active:scale-[0.98]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Item</span>
                  </button>
                )}
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredInventory.map((item) => {
                  const status = getInventoryStatus(item)
                  const percentage = Math.min((item.stock / item.maxStock) * 100, 100)
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "bg-white rounded-xl p-4 border-2 transition-all",
                        status === "critical" && "border-red-200 bg-red-50",
                        status === "warning" && "border-yellow-200 bg-yellow-50",
                        status === "good" && "border-gray-200"
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#0033AD]">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.supplier}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          status === "critical" && "bg-red-100 text-red-700",
                          status === "warning" && "bg-yellow-100 text-yellow-700",
                          status === "good" && "bg-green-100 text-green-700"
                        )}>
                          {status === "critical" ? "Critical" : status === "warning" ? "Low" : "In Stock"}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Stock Level</span>
                          <span className="font-medium">{item.stock} / {item.maxStock} {item.unit}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              status === "critical" && "bg-red-500",
                              status === "warning" && "bg-yellow-500",
                              status === "good" && "bg-green-500"
                            )}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Min: {item.minStock} {item.unit}</p>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cost/Unit</span>
                        <span className="font-medium">{item.costPerUnit.toFixed(2)} ETB</span>
                      </div>

                      {currentRole === "admin" && (
                        <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => openEditInventory(item)}
                            className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteInventoryItem(item.id)}
                            className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Supplier Logs */}
          {activeNav === "suppliers" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {currentRole === "admin" && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={openAddSupplier}
                    className="flex items-center gap-2 px-4 py-3 bg-[#0033AD] text-white rounded-lg hover:bg-[#002A8C] active:bg-[#001F70] transition-colors active:scale-[0.98]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Supplier</span>
                  </button>
                </div>
              )}

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[#0033AD]">{sup.name}</h4>
                        <p className="text-sm text-gray-500">{sup.items}</p>
                      </div>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        sup.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      )}>
                        {sup.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{sup.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{sup.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Last: {sup.lastOrder}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <span className="font-semibold text-[#0033AD]">{sup.totalOrders.toLocaleString()} ETB</span>
                      {currentRole === "admin" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditSupplier(sup)}
                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteSupplier(sup.id)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Supplier</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Contact</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Items</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Last Order</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Total</th>
                        {currentRole === "admin" && (
                          <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {suppliers.map((sup) => (
                        <tr key={sup.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-[#0033AD]">{sup.name}</div>
                            <div className="text-xs text-gray-500">{sup.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div>{sup.contact}</div>
                            <div className="text-xs text-gray-500">{sup.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sup.items}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{sup.lastOrder}</td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-xs font-medium",
                              sup.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                            )}>
                              {sup.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium text-[#0033AD]">
                            {sup.totalOrders.toLocaleString()} ETB
                          </td>
                          {currentRole === "admin" && (
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => openEditSupplier(sup)}
                                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSupplier(sup.id)}
                                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ERCA VAT Reports */}
          {activeNav === "reports" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 mb-6">
                {[
                  {
                    label: "Total revenue",
                    value: `${finance.totalRevenue.toLocaleString()} ETB`,
                  },
                  {
                    label: "VAT collected (15%)",
                    value: `${finance.totalVat.toLocaleString()} ETB`,
                  },
                  {
                    label: "Transactions",
                    value: finance.totalOrders.toLocaleString(),
                  },
                  {
                    label: "Avg. transaction",
                    value:
                      finance.totalOrders > 0
                        ? `${(finance.totalRevenue / finance.totalOrders).toFixed(2)} ETB`
                        : "0 ETB",
                  },
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                    <p className="text-xs md:text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-lg md:text-2xl font-bold text-[#0033AD]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="font-bold text-lg text-[#0033AD] mb-2">Sales summary</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Live totals from POS sales saved to your company database.
                </p>
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg bg-[#f4f7ff] p-4">
                    <dt className="text-gray-600">Subtotal (excl. VAT)</dt>
                    <dd className="text-lg font-semibold text-[#0033AD]">
                      {finance.totalSubtotal.toLocaleString()} ETB
                    </dd>
                  </div>
                  <div className="rounded-lg bg-[#f4f7ff] p-4">
                    <dt className="text-gray-600">VAT output</dt>
                    <dd className="text-lg font-semibold text-[#0033AD]">
                      {finance.totalVat.toLocaleString()} ETB
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {/* Product Analytics */}
          {activeNav === "analytics" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid gap-6 lg:grid-cols-2 mb-6">
                {/* Low Performing Products */}
                <div className="bg-white rounded-xl border border-red-200 p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-lg text-[#0033AD]">Waste Risk Items</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Products with less than 10 orders this week</p>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {getLowPerformingProducts().map((prod) => (
                      <div key={prod.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium text-[#0033AD] text-sm">{prod.name}</p>
                          <p className="text-xs text-gray-500">{prod.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-red-600 text-sm">{prod.lastWeekOrders} orders/week</p>
                          <p className="text-xs text-gray-500">Action: Promote or Remove</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performing Products */}
                <div className="bg-white rounded-xl border border-green-200 p-4 md:p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <h3 className="font-bold text-lg text-[#0033AD]">Top Performers</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Best selling products this week</p>
                  <div className="space-y-3">
                    {getTopPerformingProducts().map((prod, i) => (
                      <div key={prod.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-[#0033AD] text-sm">{prod.name}</p>
                            <p className="text-xs text-gray-500">{prod.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 text-sm">{prod.lastWeekOrders} orders</p>
                          <p className="text-xs text-gray-500">{(prod.lastWeekOrders * prod.price).toLocaleString()} ETB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Category Performance */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h3 className="font-bold text-lg text-[#0033AD] mb-4">Category Performance</h3>
                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  {categories.map((cat) => {
                    const catProducts = products.filter(p => p.category === cat && p.isActive)
                    const totalOrders = catProducts.reduce((sum, p) => sum + p.lastWeekOrders, 0)
                    const revenue = catProducts.reduce((sum, p) => sum + (p.lastWeekOrders * p.price), 0)
                    return (
                      <div key={cat} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-[#0033AD] text-sm mb-2">{cat}</h4>
                        <p className="text-2xl font-bold text-[#0033AD]">{totalOrders}</p>
                        <p className="text-xs text-gray-500">orders this week</p>
                        <p className="text-sm font-medium text-gray-700 mt-2">{revenue.toLocaleString()} ETB</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Employee Management with Payroll */}
          {activeNav === "employees" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setEmployeeTab("employees")}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all min-h-[40px] active:scale-95",
                    employeeTab === "employees"
                      ? "bg-[#0033AD] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  )}
                >
                  Employees
                </button>
                <button
                  onClick={() => setEmployeeTab("payroll")}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all min-h-[40px] active:scale-95",
                    employeeTab === "payroll"
                      ? "bg-[#0033AD] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                  )}
                >
                  Payroll
                </button>
              </div>

              {employeeTab === "employees" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={employeeSearch}
                        onChange={(e) => setEmployeeSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD] focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={openAddEmployee}
                      className="flex items-center gap-2 px-4 py-3 bg-[#0033AD] text-white rounded-lg hover:bg-[#002A8C] active:bg-[#001F70] transition-colors whitespace-nowrap active:scale-[0.98]"
                    >
                      <PlusCircle className="w-5 h-5" />
                      <span className="hidden sm:inline">Add Employee</span>
                    </button>
                  </div>

                  {/* Employee Stats */}
                  <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
                    {(["admin", "cashier", "sales", "inventory"] as UserRole[]).map((role) => (
                      <div key={role} className="bg-white rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          {roleIcons[role]}
                          <span className="text-sm text-gray-600">{roleLabels[role]}s</span>
                        </div>
                        <p className="text-2xl font-bold text-[#0033AD]">
                          {employees.filter(e => e.role === role && e.status === "active").length}
                        </p>
                        <p className="text-xs text-gray-500">active</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.id}
                        className={cn(
                          "bg-white rounded-xl p-4 border-2 transition-all",
                          emp.status === "active" ? "border-gray-200" : "border-gray-100 opacity-60"
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#0033AD] flex items-center justify-center text-white font-semibold">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#0033AD]">{emp.name}</h4>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                {roleIcons[emp.role]}
                                <span>{roleLabels[emp.role]}</span>
                              </div>
                            </div>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            emp.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                          )}>
                            {emp.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p className="truncate">{emp.email}</p>
                          <p>{emp.phone}</p>
                          <div className="flex justify-between">
                            <span className="capitalize">Shift: {emp.shift}</span>
                            <span className="font-semibold text-[#0033AD]">{emp.salary.toLocaleString()} ETB</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => openEditEmployee(emp)}
                            className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setViewingPayroll(emp)
                              setShowPayrollModal(true)
                            }}
                            className="px-4 py-2 text-sm bg-[#FFFFFF]/10 text-[#FFFFFF] rounded-lg hover:bg-[#FFFFFF]/20 active:bg-[#FFFFFF]/30 transition-colors"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEmployee(emp.id)}
                            className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {employeeTab === "payroll" && (
                <>
                  {/* Payroll Summary */}
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
                    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Monthly Payroll</p>
                      <p className="text-2xl font-bold text-[#0033AD]">{calculateMonthlyPayroll().toLocaleString()} ETB</p>
                      <p className="text-xs text-gray-500 mt-1">{employees.filter(e => e.status === "active").length} active employees</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Next Payday</p>
                      <p className="text-2xl font-bold text-[#0033AD]">Dec 30, 2024</p>
                      <p className="text-xs text-gray-500 mt-1">8 days remaining</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">Avg. Salary</p>
                      <p className="text-2xl font-bold text-[#0033AD]">
                        {Math.round(calculateMonthlyPayroll() / employees.filter(e => e.status === "active").length).toLocaleString()} ETB
                      </p>
                      <p className="text-xs text-gray-500 mt-1">per employee</p>
                    </div>
                  </div>

                  {/* Payroll List */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-bold text-[#0033AD]">Payroll Details</h3>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] text-[#0033AD] rounded-lg font-semibold hover:bg-[#E8EEFF] active:bg-[#D0DCF5] transition-colors text-sm active:scale-[0.98]">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Employee</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">Role</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 hidden md:table-cell">Bank Account</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Salary</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {employees.map((emp) => (
                            <tr key={emp.id} className={cn("hover:bg-gray-50 transition-colors", emp.status === "inactive" && "opacity-50")}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#0033AD] flex items-center justify-center text-white text-xs font-semibold">
                                    {emp.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-medium text-[#0033AD] text-sm">{emp.name}</p>
                                    <p className="text-xs text-gray-500 sm:hidden">{roleLabels[emp.role]}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{roleLabels[emp.role]}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{emp.bankAccount}</td>
                              <td className="px-4 py-3 font-semibold text-[#0033AD]">{emp.salary.toLocaleString()} ETB</td>
                              <td className="px-4 py-3">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  emp.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>
                                  {emp.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td colSpan={3} className="px-4 py-3 font-bold text-[#0033AD]">Total Monthly Payroll</td>
                            <td colSpan={2} className="px-4 py-3 font-bold text-[#0033AD] text-lg">
                              {calculateMonthlyPayroll().toLocaleString()} ETB
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Catalogue */}
          {activeNav === "catalogue" && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all min-h-[40px] active:scale-95",
                        activeCategory === cat
                          ? "bg-[#0033AD] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                      )}
                    >
                      {cat} ({products.filter(p => p.category === cat).length})
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowQRModal(true)}
                    className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors active:scale-[0.98]"
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="hidden sm:inline">QR Code</span>
                  </button>
                  <button
                    onClick={openAddProduct}
                    className="flex items-center gap-2 px-4 py-3 bg-[#FFFFFF] text-[#0033AD] rounded-lg hover:bg-[#E8EEFF] active:bg-[#D0DCF5] transition-colors whitespace-nowrap font-semibold active:scale-[0.98]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span className="hidden sm:inline">Add Item</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {products.filter(p => p.category === activeCategory).map((prod) => (
                  <div
                    key={prod.id}
                    className={cn(
                      "bg-white rounded-xl p-4 border-2 transition-all",
                      prod.isActive ? "border-gray-200" : "border-gray-100"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[#0033AD]">{prod.name}</h4>
                        {prod.description && (
                          <p className="text-sm text-gray-500">{prod.description}</p>
                        )}
                      </div>
                      {/* Toggle Switch */}
                      <button
                        onClick={() => toggleProductActive(prod.id)}
                        className={cn(
                          "relative w-12 h-6 rounded-full transition-colors",
                          prod.isActive ? "bg-green-500" : "bg-gray-300"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
                          prod.isActive ? "translate-x-7" : "translate-x-1"
                        )} />
                      </button>
                    </div>

                    <p className="text-xl font-bold text-[#0033AD] mb-2">{prod.price.toFixed(2)} ETB</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span>Total: {prod.totalOrders} orders</span>
                      <span>Week: {prod.lastWeekOrders}</span>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => openEditProduct(prod)}
                        className="flex-1 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 active:bg-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowCheckout(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            {orderComplete ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-[scaleIn_0.3s_ease-out]">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-[#0033AD] mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Order #{Date.now().toString().slice(-6)}</p>
                <p className="text-3xl font-bold text-[#0033AD]">{total.toFixed(2)} ETB</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#0033AD]">Select Payment Method</h3>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={cn(
                          "p-4 md:p-6 rounded-xl flex flex-col items-center gap-3 transition-all text-white min-h-[100px] md:min-h-[120px] active:scale-[0.98]",
                          method.color,
                          selectedPayment === method.id && "ring-4 ring-[#FFFFFF] ring-offset-2"
                        )}
                      >
                        {method.icon}
                        <span className="font-semibold text-base md:text-lg">{method.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{subtotal.toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">VAT (15%)</span>
                      <span>{vat.toFixed(2)} ETB</span>
                    </div>
                    <div className="h-px bg-gray-200 my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-[#0033AD]">Total</span>
                      <span className="text-[#FFFFFF]">{total.toFixed(2)} ETB</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!selectedPayment}
                    className={cn(
                      "w-full py-4 rounded-xl font-semibold text-lg transition-all active:scale-[0.98]",
                      selectedPayment
                        ? "bg-[#0033AD] text-white hover:bg-[#002A8C] active:bg-[#001F70]"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    )}
                  >
                    Complete Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Employee Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowEmployeeModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0033AD]">
                {editingEmployee ? "Edit Employee" : "Add Employee"}
              </h3>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={employeeForm.name}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={employeeForm.role}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, role: e.target.value as UserRole })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                >
                  <option value="cashier">Cashier</option>
                  <option value="sales">Waiter</option>
                  <option value="inventory">Inventory Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={employeeForm.email}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  placeholder="email@luwak.et"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={employeeForm.phone}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  placeholder="+251..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={employeeForm.status}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, status: e.target.value as "active" | "inactive" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={employeeForm.shift}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, shift: e.target.value as "morning" | "afternoon" | "evening" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary (ETB)</label>
                  <input
                    type="number"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, salary: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                  <input
                    type="date"
                    value={employeeForm.hireDate}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
                <input
                  type="text"
                  value={employeeForm.bankAccount}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, bankAccount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  placeholder="CBE-1000234567"
                />
              </div>
              <button
                onClick={saveEmployee}
                className="w-full py-3 bg-[#0033AD] text-white rounded-lg font-semibold hover:bg-[#002A8C] active:bg-[#001F70] transition-colors active:scale-[0.98]"
              >
                {editingEmployee ? "Update Employee" : "Add Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payroll Detail Modal */}
      {showPayrollModal && viewingPayroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowPayrollModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0033AD]">Payroll Details</h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#0033AD] flex items-center justify-center text-white text-xl font-semibold">
                  {viewingPayroll.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-[#0033AD] text-lg">{viewingPayroll.name}</h4>
                  <p className="text-gray-500">{roleLabels[viewingPayroll.role]}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Monthly Salary</span>
                  <span className="font-bold text-[#0033AD]">{viewingPayroll.salary.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Bank Account</span>
                  <span className="font-medium">{viewingPayroll.bankAccount}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Hire Date</span>
                  <span className="font-medium">{new Date(viewingPayroll.hireDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Status</span>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    viewingPayroll.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  )}>
                    {viewingPayroll.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowPayrollModal(false)}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowInventoryModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0033AD]">
                {editingInventoryItem ? "Edit Inventory Item" : "Add Inventory Item"}
              </h3>
              <button
                onClick={() => setShowInventoryModal(false)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={inventoryForm.name}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                  <input
                    type="number"
                    value={inventoryForm.stock}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={inventoryForm.unit}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, unit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                    placeholder="kg, L, pcs..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                  <input
                    type="number"
                    value={inventoryForm.minStock}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, minStock: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                  <input
                    type="number"
                    value={inventoryForm.maxStock}
                    onChange={(e) => setInventoryForm({ ...inventoryForm, maxStock: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost per Unit (ETB)</label>
                <input
                  type="number"
                  value={inventoryForm.costPerUnit}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, costPerUnit: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <select
                  value={inventoryForm.supplier}
                  onChange={(e) => setInventoryForm({ ...inventoryForm, supplier: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                >
                  <option value="">Select supplier</option>
                  {suppliers.filter(s => s.status === "Active").map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={saveInventory}
                className="w-full py-3 bg-[#0033AD] text-white rounded-lg font-semibold hover:bg-[#002A8C] active:bg-[#001F70] transition-colors active:scale-[0.98]"
              >
                {editingInventoryItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowSupplierModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0033AD]">
                {editingSupplier ? "Edit Supplier" : "Add Supplier"}
              </h3>
              <button
                onClick={() => setShowSupplierModal(false)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={supplierForm.name}
                  onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  value={supplierForm.contact}
                  onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={supplierForm.email}
                    onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={supplierForm.phone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Items Supplied</label>
                <input
                  type="text"
                  value={supplierForm.items}
                  onChange={(e) => setSupplierForm({ ...supplierForm, items: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  placeholder="e.g., Store Beans, Milk"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={supplierForm.status}
                    onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value as "Active" | "Inactive" })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                  <select
                    value={supplierForm.paymentTerms}
                    onChange={(e) => setSupplierForm({ ...supplierForm, paymentTerms: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                  >
                    <option value="">Select terms</option>
                    <option value="COD">COD (Cash on Delivery)</option>
                    <option value="Net 15">Net 15</option>
                    <option value="Net 30">Net 30</option>
                    <option value="Net 45">Net 45</option>
                  </select>
                </div>
              </div>
              <button
                onClick={saveSupplier}
                className="w-full py-3 bg-[#0033AD] text-white rounded-lg font-semibold hover:bg-[#002A8C] active:bg-[#001F70] transition-colors active:scale-[0.98]"
              >
                {editingSupplier ? "Update Supplier" : "Add Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu/Product Modal */}
      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowMenuModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-[scaleIn_0.2s_ease-out]" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#0033AD]">
                {editingProduct ? "Edit catalogue item" : "Add catalogue item"}
              </h3>
              <button
                onClick={() => setShowMenuModal(false)}
                className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (ETB)</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={productForm.type}
                  onChange={(e) => setProductForm({ ...productForm, type: e.target.value as "product" | "service" })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                >
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0033AD]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">Published on public catalogue</span>
                <button
                  onClick={() => setProductForm({ ...productForm, isActive: !productForm.isActive })}
                  className={cn(
                    "relative w-12 h-6 rounded-full transition-colors",
                    productForm.isActive ? "bg-green-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
                    productForm.isActive ? "translate-x-7" : "translate-x-1"
                  )} />
                </button>
              </div>
              <button
                onClick={saveProduct}
                className="w-full py-3 bg-[#0033AD] text-white rounded-lg font-semibold hover:bg-[#002A8C] active:bg-[#001F70] transition-colors active:scale-[0.98]"
              >
                {editingProduct ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes steam {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scaleY(1.2); opacity: 0; }
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </div>
  )
}
