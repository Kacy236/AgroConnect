import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUp, ShoppingBag, ShoppingCart, TrendingUp } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useProducts } from '@/context/ProductContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { cx, money } from '@/lib/utils'
import { PeriodSelect } from '../MetricLayout/MetricLayout'
import './AnalyticsDashboard.css'

function MetricRow({ icon, label, value, delta, to }) {
  const up = delta >= 0
  const Arrow = up ? ArrowUp : ArrowDown
  return (
    <Link to={to} className="metric-row">
      <span className="metric-icon-wrapper">
        {icon}
      </span>
      <span className="metric-label">{label}</span>
      <span className="metric-right">
        <span className="metric-value">{value}</span>
        <span
          className={cx(
            'metric-delta',
            up ? 'metric-delta-up' : 'metric-delta-down'
          )}
        >
          <Arrow className="metric-arrow" strokeWidth={2.5} />
          {Math.abs(delta)}%
        </span>
      </span>
    </Link>
  )
}

export function AnalyticsDashboard() {
  const { user } = useAuth()
  const { farmerOrders, earnings } = useOrders()
  const { bestSellers } = useProducts()
  const [period, setPeriod] = useState('This Month')

  const orders = farmerOrders(user?.id ?? 'u-musa')
  const best = bestSellers[0]

  return (
    <>
      <PageHeader title="Analytic Dashboard" backTo="/farmer" />

      <div className="dashboard-container">
        <div className="dashboard-header-actions">
          <PeriodSelect value={period} onChange={setPeriod} />
        </div>

        <div className="metric-list">
          <MetricRow
            icon={<TrendingUp className="icon-lg" />}
            label="Earnings"
            value={money(earnings.totalEarnings - earnings.withdrawn)}
            delta={5}
            to="/farmer/earnings"
          />
          <MetricRow
            icon={<ShoppingCart className="icon-lg" />}
            label="Product Sold"
            value="50kg"
            delta={-3}
            to="/farmer/sold"
          />
          <MetricRow
            icon={<ShoppingBag className="icon-lg" />}
            label="Total Orders"
            value={orders.length}
            delta={35}
            to="/farmer/order-overview"
          />
        </div>

        {best ? (
          <section className="best-seller-section">
            <h2 className="best-seller-heading">
              <span className="best-seller-icon-wrapper">
                <ShoppingCart className="icon-md" />
              </span>
              Best Selling Product
            </h2>
            <Link
              to={`/farmer/products/${best.id}`}
              className="best-seller-link"
            >
              <img src={best.image} alt="" className="best-seller-image" />
              <span className="best-seller-info">
                <span className="best-seller-name">{best.name}</span>
                <span className="best-seller-price">
                  ₦ {best.price.toLocaleString('en-NG')} / {best.unit}
                </span>
              </span>
            </Link>
          </section>
        ) : null}
      </div>
    </>
  )
}