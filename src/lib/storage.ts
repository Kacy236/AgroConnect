/**
 * Thin localStorage wrapper used by every context.
 *
 * Each context owns one key and hydrates from it on mount, so swapping this
 * module for a REST/Supabase client later only touches these two functions.
 */
const PREFIX = 'agroconnect:'

export function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* quota or private-mode failures are non-fatal — state still lives in memory */
  }
}

export function clearAll(): void {
  if (typeof window === 'undefined') return
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => window.localStorage.removeItem(k))
}

export const KEYS = {
  auth: 'auth',
  products: 'products',
  cart: 'cart',
  orders: 'orders',
  chats: 'chats',
  verification: 'verification',
  earnings: 'earnings',
  favourites: 'favourites',
} as const
