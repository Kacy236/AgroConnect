import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge'
import { longDate, money } from '@/lib/utils'
import { MetricLayout } from '../MetricLayout/MetricLayout'
import { seriesFor } from '../EarningsPage/EarningsPage'
import './OrderOverviewPage.css'

export function OrderOverviewPage() {
  const { user } = useAuth()
  const { farmerOrders } = useOrders()
  const [period, setPeriod] = useState('This Month')

  const orders = farmerOrders(user?.id ?? 'u-musa')
  const data = useMemo(() => seriesFor(period), [period])

  return (
    <MetricLayout
      title="Order Overview"
      backTo="/farmer/analytics"
      period={period}
      onPeriodChange={setPeriod}
      metricLabel="Total Orders"
      metricValue={orders.length}
      delta={35}
      data={data}
    >
      <section className="recents-section">
        <h2 className="recents-title">Recents</h2>
        <ul className="recents-list">
          {orders.slice(0, 4).map((order) => (
            <li key={order.id} className="order-card">
              <div className="order-card-header">
                <p className="order-id">#{order.id}</p>
                <StatusBadge status={order.status} size="sm" />
              </div>
              <div className="order-card-body">
                <p className="order-buyer">Buyer: {order.buyerName}</p>
                <p className="order-total">{money(order.total)}</p>
              </div>
              <div className="order-card-footer">
                <Link
                  to={`/farmer/orders/${order.id}`}
                  className="order-details-link"
                >
                  View Details
                </Link>
                <p className="order-date">{longDate(order.placedAt)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </MetricLayout>
  )
}