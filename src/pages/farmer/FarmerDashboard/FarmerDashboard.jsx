import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Plus, ShoppingBag, Sprout, Truck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useChats } from '@/context/ChatContext'
import { useOrders } from '@/context/OrderContext'
import { useProducts } from '@/context/ProductContext'
import { GreetingHeader, MobileBrandHeader } from '@/components/layout/Header/Header'
import { StatCard } from '@/components/farmer/StatCard/StatCard'
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge'
import { LinkButton } from '@/components/ui/Button/Button'
import { SearchInput } from '@/components/ui/Bits/Bits'
import { money } from '@/lib/utils'
import './FarmerDashboard.css'

export function FarmerDashboard() {
  const { user } = useAuth()
  const { products } = useProducts()
  const { farmerOrders, earnings } = useOrders()
  const { unreadCount, conversations } = useChats()
  const [query, setQuery] = useState('')

  const orders = farmerOrders(user?.id ?? 'u-musa')
  const recent = useMemo(() => orders.slice(0, 5), [orders])
  // "Active" deliveries are anything the farmer still has to move.
  const inTransit = orders.filter(
    (o) => o.status === 'in-transit' || o.status === 'processing',
  ).length

  const firstName = user?.name.split(/[\s,]+/).filter(Boolean)[1] ?? 'Musa'

  return (
    <>
      <MobileBrandHeader showMenu />
      <GreetingHeader
        name={firstName}
        subtitle="Let's make today a good harvest."
        accountHref="/farmer/profile"
        search={{ value: query, onChange: setQuery }}
      />

      <div className="farmer-dash">
        {/* Farm summary banner */}
        <section className="farmer-dash-banner">
          <div className="farmer-dash-banner-left">
            <img src="/img/farm-aerial.jpg" alt="" className="farmer-dash-banner-img farmer-dash-banner-img-sm" />
            <div>
              <h2 className="farmer-dash-farm-name">{user?.farmName ?? 'Musa Field Farm'}</h2>
              <p className="farmer-dash-farm-meta">
                {user?.farmSize ?? '2.5 Acres'} · {user?.location ?? 'Kaduna North, Kaduna'}
              </p>
            </div>
          </div>
          <div className="farmer-dash-banner-right">
            <img src="/img/farm-aerial.jpg" alt="" className="farmer-dash-banner-img farmer-dash-banner-img-lg" />
            <LinkButton to="/farmer/products/new" size="md" className="farmer-dash-new-listing">
              <Plus className="icon-20" />
              New listing
            </LinkButton>
          </div>
        </section>

        <div className="farmer-dash-mobile-search">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product" />
        </div>

        {/* Overview */}
        <section className="farmer-dash-overview">
          <h2 className="farmer-dash-section-title">Farm Overview</h2>
          <div className="farmer-dash-stats">
            <StatCard icon={<Sprout className="icon-24" />} value={products.length} label="Products" to="/farmer/marketplace" />
            <StatCard
              icon={<NairaIcon />}
              value={money(earnings.totalEarnings - earnings.withdrawn)}
              label="Earnings"
              tone="blue"
              to="/farmer/earnings"
            />
            <StatCard
              icon={<ShoppingBag className="icon-24" />}
              value={orders.length}
              label="Orders"
              tone="amber"
              to="/farmer/orders"
            />
            <StatCard
              icon={<MessageCircle className="icon-24" />}
              value={`${unreadCount || conversations.length} new`}
              label="Chats"
              tone="blue"
              to="/farmer/chats"
              className="farmer-dash-stat-span-1"
            />
            <StatCard
              icon={<Truck className="icon-24" />}
              value={`${inTransit} active`}
              label="Track Delivery"
              tone="blue"
              to="/farmer/orders"
              className="farmer-dash-stat-span-2"
            />
          </div>
        </section>

        {/* Recent orders */}
        <section className="farmer-dash-recent">
          <div className="farmer-dash-recent-header">
            <h2 className="farmer-dash-section-title">Recent Orders</h2>
            <Link to="/farmer/chats" className="farmer-dash-message-link">
              Message buyer
              <ArrowRight className="icon-16" />
            </Link>
          </div>

          {/* Desktop table */}
          <div className="farmer-dash-table-wrap">
            <table className="farmer-dash-table">
              <thead>
                <tr className="farmer-dash-table-head-row">
                  <th className="farmer-dash-th">Product</th>
                  <th className="farmer-dash-th">Buyer</th>
                  <th className="farmer-dash-th">Order</th>
                  <th className="farmer-dash-th farmer-dash-th-right">Amount</th>
                  <th className="farmer-dash-th farmer-dash-th-right">Status</th>
                </tr>
              </thead>
              <tbody className="farmer-dash-tbody">
                {recent.map((order) => (
                  <tr key={order.id} className="farmer-dash-tr">
                    <td className="farmer-dash-td">
                      <img src={order.lines[0]?.image} alt={order.lines[0]?.name ?? ''} className="farmer-dash-td-img" />
                    </td>
                    <td className="farmer-dash-td farmer-dash-td-text">{order.buyerName}</td>
                    <td className="farmer-dash-td farmer-dash-td-text">#{order.id}</td>
                    <td className="farmer-dash-td farmer-dash-td-right farmer-dash-td-bold">{money(order.total)}</td>
                    <td className="farmer-dash-td farmer-dash-td-right">
                      <Link to={`/farmer/orders/${order.id}`}>
                        <StatusBadge status={order.status} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="farmer-dash-mobile-list">
            {recent.map((order) => (
              <li key={order.id}>
                <Link to={`/farmer/orders/${order.id}`} className="farmer-dash-mobile-item">
                  <img src={order.lines[0]?.image} alt="" className="farmer-dash-mobile-img" />
                  <div className="farmer-dash-mobile-text">
                    <p className="farmer-dash-mobile-name">
                      {order.lines[0]?.name} <span className="farmer-dash-mobile-qty">({order.lines[0]?.qty} Kg)</span>
                    </p>
                    <p className="farmer-dash-mobile-id">Order #{order.id}</p>
                  </div>
                  <div className="farmer-dash-mobile-amount">
                    <p className="farmer-dash-mobile-amount-value">{money(order.total)}</p>
                    <p className="farmer-dash-mobile-amount-status">
                      {order.status === 'processing' ? 'Confirmed' : ''}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className="farmer-dash-view-all">
            <LinkButton to="/farmer/orders" variant="outline" block size="md">
              View all orders
            </LinkButton>
          </div>
        </section>
      </div>
    </>
  )
}

function NairaIcon() {
  return <span className="farmer-dash-naira">₦</span>
}