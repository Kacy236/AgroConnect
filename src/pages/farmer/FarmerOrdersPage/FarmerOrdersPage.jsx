import { useMemo, useState } from 'react'
import { PackageOpen } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { FarmerOrderCard } from '@/components/orders/OrderCard/OrderCard'
import { EmptyState } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import './FarmerOrdersPage.css'

const TABS = [
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export function FarmerOrdersPage() {
  const { user } = useAuth()
  const { farmerOrders, setStatus } = useOrders()
  const { notify } = useToast()
  const [tab, setTab] = useState('pending')

  const orders = farmerOrders(user?.id ?? 'u-musa')

  /**
   * The Pending tab doubles as the action queue, so it also surfaces orders
   * already moving through fulfilment rather than looking empty once accepted.
   */
  const visible = useMemo(() => {
    if (tab === 'all') return orders
    if (tab === 'pending') return orders.filter((o) => o.status === 'pending' || o.status === 'in-transit')
    return orders.filter((o) => o.status === tab)
  }, [orders, tab])

  return (
    <>
      <PageHeader title="My Orders" backTo="/farmer" />

      <div className="farmer-orders">
        <div className="farmer-orders-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.value}
              role="tab"
              aria-selected={tab === t.value}
              onClick={() => setTab(t.value)}
              className={cx('farmer-orders-tab', tab === t.value && 'farmer-orders-tab-active')}
            >
              {t.label}
              {tab === t.value ? <span className="farmer-orders-tab-underline" /> : null}
            </button>
          ))}
        </div>

        {visible.length ? (
          <ul className="farmer-orders-list">
            {visible.map((order) => (
              <FarmerOrderCard
                key={order.id}
                order={order}
                onAccept={() => {
                  setStatus(order.id, 'processing')
                  notify(`Order #${order.id} accepted`)
                }}
                onCancel={() => {
                  setStatus(order.id, 'cancelled')
                  notify(`Order #${order.id} cancelled`, 'error')
                }}
              />
            ))}
          </ul>
        ) : (
          <div className="farmer-orders-empty">
            <EmptyState
              icon={<PackageOpen className="icon-28" />}
              title="Nothing here yet"
              description={`You have no ${tab === 'all' ? '' : tab} orders right now.`}
            />
          </div>
        )}
      </div>
    </>
  )
}