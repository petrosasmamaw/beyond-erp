/**
 * Legacy in-memory platform store (unused). Registrations use the Express API + Neon.
 */
export type PlatformStore = {
  registrations: unknown[]
  companies: unknown[]
}

export async function readPlatformStore(): Promise<PlatformStore> {
  return { registrations: [], companies: [] }
}
