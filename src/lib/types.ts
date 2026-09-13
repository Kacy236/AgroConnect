export type Role = 'farmer' | 'buyer'

export type CategorySlug =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'proteins'
  | 'roots'
  | 'processed'
  | 'spices'

export interface Category {
  slug: CategorySlug
  name: string
  image: string
}

export interface Review {
  id: string
  author: string
  rating: number
  title: string
  body: string
  verified: boolean
  date: string
}

export interface Product {
  id: string
  name: string
  category: CategorySlug
  price: number
  unit: string
  available: number
  image: string
  description: string
  farmerId: string
  farmName: string
  location: string
  inStock: boolean
  rating: number
  reviews: Review[]
  createdAt: string
}

export type OrderStatus = 'pending' | 'processing' | 'in-transit' | 'delivered' | 'cancelled'

export interface OrderLine {
  productId: string
  name: string
  image: string
  price: number
  unit: string
  qty: number
}

export interface Order {
  id: string
  buyerId: string
  buyerName: string
  farmerId: string
  farmerName: string
  lines: OrderLine[]
  subtotal: number
  deliveryFee: number
  total: number
  status: OrderStatus
  placedAt: string
  deliveryEstimate: string
  address: string
  rated?: boolean
  riderId?: string
}

export interface Message {
  id: string
  from: string
  body: string
  at: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  online: boolean
  lastSeen: string
  messages: Message[]
}

export interface Person {
  id: string
  name: string
  role: Role
  phone: string
  email: string
  avatar: string
  location: string
  /** Farmer-only profile fields. */
  farmName?: string
  farmSize?: string
  farmType?: string
  crops?: string[]
  verified?: boolean
  verificationScore?: number
  rating?: number
  bank?: { name: string; accountName: string; accountNumber: string }
}

export interface Withdrawal {
  id: string
  amount: number
  bank: string
  reference: string
  date: string
  status: 'Processing' | 'Paid'
}

export interface HarvestEntry {
  id: string
  productName: string
  image: string
  date: string
  progress: number
}
