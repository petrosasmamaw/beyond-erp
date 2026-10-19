/**
 * Legacy file-based store (unused). All company data lives in PostgreSQL via the Express API.
 */
import type { AppStore } from "./types"
import { emptyBusiness, emptyFinance } from "./empty-store"

export function emptyAppStore(): AppStore {
  return {
    business: { ...emptyBusiness },
    products: [],
    employees: [],
    inventory: [],
    suppliers: [],
    orders: [],
    finance: { ...emptyFinance },
    updatedAt: new Date().toISOString(),
  }
}

export async function readStore(): Promise<AppStore> {
  return emptyAppStore()
}

export async function writeStore(): Promise<AppStore> {
  return emptyAppStore()
}
