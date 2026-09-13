import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Order, OrderLine, OrderStatus, Withdrawal } from '@/lib/types'
import { ORDERS, RIDER, WITHDRAWALS } from '@/data/seed'
import { KEYS, load, save } from '@/lib/storage'
import { addDays, nextOrderId, uid } from '@/lib/utils'

interface EarningsState {
  totalEarnings: number
  withdrawn: number
  withdrawals: Withdrawal[]
}

const initialEarnings: EarningsState = {
  totalEarnings: 500_000,
  withdrawn: 296_350,
  withdrawals: WITHDRAWALS,
}

interface PlaceOrderInput {
  buyerId: string
  buyerName: string
  lines: OrderLine[]
  subtotal: number
  deliveryFee: number
  address: string
}

interface OrderValue {
  orders: Order[]
  byId: (id: string) => Order | undefined
  buyerOrders: (buyerId: string) => Order[]
  farmerOrders: (farmerId: string) => Order[]
  placeOrder: (input: PlaceOrderInput) => Order
  setStatus: (id: string, status: OrderStatus) => void
  markRated: (id: string) => void
  earnings: EarningsState
  availableBalance: number
  withdraw: (amount: number, bank: string) => Withdrawal
}

const OrderContext = createContext<OrderValue | null>(null)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => load(KEYS.orders, ORDERS))
  const [earnings, setEarnings] = useState<EarningsState>(() =>
    load(KEYS.earnings, initialEarnings),
  )

  useEffect(() => {
    save(KEYS.orders, orders)
  }, [orders])

  useEffect(() => {
    save(KEYS.earnings, earnings)
  }, [earnings])

  const byId = useCallback((id: string) => orders.find((o) => o.id === id), [orders])

  const buyerOrders = useCallback(
    (buyerId: string) =>
      orders
        .filter((o) => o.buyerId === buyerId)
        .slice()
        .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt)),
    [orders],
  )

  const farmerOrders = useCallback(
    (farmerId: string) =>
      orders
        .filter((o) => o.farmerId === farmerId)
        .slice()
        .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt)),
    [orders],
  )

  const placeOrder = useCallback(
    (input: PlaceOrderInput) => {
      const now = new Date()
      const created: Order = {
        id: nextOrderId(orders.map((o) => o.id)),
        buyerId: input.buyerId,
        buyerName: input.buyerName,
        farmerId: 'u-musa',
        farmerName: 'Aliu, Musa',
        lines: input.lines,
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        total: input.subtotal + input.deliveryFee,
        status: 'pending',
        placedAt: now.toISOString(),
        deliveryEstimate: addDays(now, 3).toISOString(),
        address: input.address,
        riderId: RIDER.id,
      }
      setOrders((list) => [created, ...list])
      return created
    },
    [orders],
  )

  /** Delivering an order credits the farmer's balance, so earnings track activity. */
  const setStatus = useCallback(
    (id: string, status: OrderStatus) => {
      const order = orders.find((o) => o.id === id)
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
      if (order && status === 'delivered' && order.status !== 'delivered') {
        setEarnings((e) => ({ ...e, totalEarnings: e.totalEarnings + order.subtotal }))
      }
    },
    [orders],
  )

  const markRated = useCallback((id: string) => {
    setOrders((list) => list.map((o) => (o.id === id ? { ...o, rated: true } : o)))
  }, [])

  const availableBalance = useMemo(
    () => earnings.totalEarnings - earnings.withdrawn,
    [earnings],
  )

  const withdraw = useCallback((amount: number, bank: string) => {
    const record: Withdrawal = {
      id: uid('w'),
      amount,
      bank,
      reference: `#WS${Math.floor(100_000 + Math.random() * 899_999)}`,
      date: new Date().toISOString(),
      status: 'Processing',
    }
    setEarnings((e) => ({
      ...e,
      withdrawn: e.withdrawn + amount,
      withdrawals: [record, ...e.withdrawals],
    }))
    return record
  }, [])

  const value = useMemo<OrderValue>(
    () => ({
      orders,
      byId,
      buyerOrders,
      farmerOrders,
      placeOrder,
      setStatus,
      markRated,
      earnings,
      availableBalance,
      withdraw,
    }),
    [
      orders,
      byId,
      buyerOrders,
      farmerOrders,
      placeOrder,
      setStatus,
      markRated,
      earnings,
      availableBalance,
      withdraw,
    ],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders(): OrderValue {
  const ctx = useContext(OrderContext)
  if (!ctx) throw new Error('useOrders must be used inside <OrderProvider>')
  return ctx
}
