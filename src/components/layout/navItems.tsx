import type { ReactNode } from 'react'
import {
  Home,
  MessageCircle,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
} from 'lucide-react'
import type { Role } from '@/lib/types'

export interface NavItem {
  to: string
  label: string
  icon: ReactNode
  /** Which badge counter, if any, this item shows. */
  badge?: 'cart' | 'chats'
  /** Renders as the raised centre action in the mobile bar. */
  fab?: boolean
  end?: boolean
}

const ICON = 'h-6 w-6'

export const BUYER_NAV: NavItem[] = [
  { to: '/buyer', label: 'Home', icon: <Home className={ICON} />, end: true },
  { to: '/buyer/orders', label: 'Order', icon: <ShoppingBag className={ICON} /> },
  { to: '/buyer/cart', label: 'Cart', icon: <ShoppingCart className={ICON} />, badge: 'cart' },
  { to: '/buyer/chats', label: 'Chats', icon: <MessageCircle className={ICON} />, badge: 'chats' },
  { to: '/buyer/account', label: 'Account', icon: <User className={ICON} /> },
]

export const FARMER_NAV: NavItem[] = [
  { to: '/farmer', label: 'Home', icon: <Home className={ICON} />, end: true },
  { to: '/farmer/marketplace', label: 'Marketplace', icon: <Store className={ICON} /> },
  { to: '/farmer/products/new', label: 'Add', icon: <Plus className="h-7 w-7" />, fab: true },
  { to: '/farmer/chats', label: 'Chats', icon: <MessageCircle className={ICON} />, badge: 'chats' },
  { to: '/farmer/profile', label: 'Profile', icon: <User className={ICON} /> },
]

/** The desktop rail drops the raised FAB in favour of a normal row. */
export const FARMER_SIDEBAR: NavItem[] = [
  { to: '/farmer', label: 'Home', icon: <Home className="h-5 w-5" />, end: true },
  { to: '/farmer/products/new', label: 'Add Product', icon: <Plus className="h-5 w-5" /> },
  { to: '/farmer/marketplace', label: 'Marketplace', icon: <Store className="h-5 w-5" /> },
  { to: '/farmer/chats', label: 'Chats', icon: <MessageCircle className="h-5 w-5" />, badge: 'chats' },
]

export function navFor(role: Role): NavItem[] {
  return role === 'farmer' ? FARMER_NAV : BUYER_NAV
}
