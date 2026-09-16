import React, { useMemo, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { BuyerOrderCard } from '@/components/orders/OrderCard/OrderCard'
import { EmptyState } from '@/components/ui/Bits/Bits'
import { LinkButton } from '@/components/ui/Button/Button'
import { cx } from '@/lib/utils'
import './BuyerOrdersPage.css'

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Processing', value: 'processing' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function BuyerOrdersPage() {
  const { user } = useAuth()
  const { buyerOrders } = useOrders()
  const [tab, setTab] = useState('all')

  const orders = buyerOrders(user?.id ?? 'u-sarah')

  const visible = useMemo(() => {
    if (tab === 'all') return orders
    // Pending and in-transit orders are both "in progress" to a buyer.
    if (tab === 'processing')
      return orders.filter(
        (o) => o.status === 'processing' || o.status === 'pending' || o.status === 'in-transit',
      )
    return orders.filter((o) => o.status === tab)
  }, [orders, tab])

  return (
    <>
      <PageHeader title="My Orders" backTo="/buyer" />

      <div className="buyer-orders-container">
        <div
          className="tabs-list no-scrollbar"
          role="tablist"
        >
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cx(
                'tab-button',
                tab === t.value ? 'tab-button-active' : 'tab-button-inactive'
              )}
            >
              {t.label}
              {tab === t.value ? (
                <span className="tab-indicator" />
              ) : null}
            </button>
          ))}
        </div>

        {visible.length ? (
          <ul className="orders-grid">
            {visible.map((order) => (
              <BuyerOrderCard key={order.id} order={order} />
            ))}
          </ul>
        ) : (
          <div className="empty-state-container">
            <EmptyState
              icon={<PackageOpen className="empty-state-icon" />}
              title="No orders here"
              description="Once you place an order it will show up in this list."
              action={<LinkButton to="/buyer">Browse produce</LinkButton>}
            />
          </div>
        )}
      </div>
    </>
  )
}