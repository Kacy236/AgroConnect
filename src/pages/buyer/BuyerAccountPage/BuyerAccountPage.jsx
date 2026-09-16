import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Bell, HelpCircle, Info, LogOut, MapPin, ShoppingBag, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { PageHeader } from '@/components/layout/Header/Header'
import './BuyerAccountPage.css'

function Row({ icon, title, subtitle, to }) {
  return (
    <Link to={to} className="account-row">
      <span className="shrink-0">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="account-row-title">{title}</span>
        {subtitle ? <span className="account-row-subtitle">{subtitle}</span> : null}
      </span>
      <svg viewBox="0 0 20 20" className="chevron-icon" aria-hidden="true">
        <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    </Link>
  )
}

function LockIcon() {
  return (
    <span className="lock-icon-badge">
      <svg viewBox="0 0 20 20" className="lock-icon" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 8V6.5a4 4 0 1 1 8 0V8h.5A1.5 1.5 0 0 1 16 9.5v6A1.5 1.5 0 0 1 14.5 17h-9A1.5 1.5 0 0 1 4 15.5v-6A1.5 1.5 0 0 1 5.5 8H6Zm1.5 0h5V6.5a2.5 2.5 0 0 0-5 0V8Z"
        />
      </svg>
    </span>
  )
}

export function BuyerAccountPage() {
  const { user, logout } = useAuth()
  const { buyerOrders } = useOrders()
  const navigate = useNavigate()

  if (!user) return null

  const active = buyerOrders(user.id).find(
    (o) => o.status === 'in-transit' || o.status === 'processing' || o.status === 'pending',
  )

  return (
    <>
      <PageHeader
        title="Account"
        backTo="/buyer"
        right={
          <span className="header-icon-btn">
            <Bell className="icon-sm" />
          </span>
        }
      />

      <div className="page-container-narrow account-page">
        <section className="card account-profile-card">
          <img src={user.avatar} alt="" className="account-avatar" />
          <div className="min-w-0">
            <h1 className="account-name">{user.name}</h1>
            <p className="label-soft mt-1">Lagos, Nigeria</p>
            <p className="label-soft mt-0.5">{user.phone}</p>
          </div>
        </section>

        <section className="account-section">
          <div className="card">
            <Row
              icon={<User className="icon-md text-brand-500" />}
              title="Profile Settings"
              subtitle="Manage your personal information"
              to="/buyer/account/profile"
            />
          </div>
          <div className="card">
            <Row
              icon={<LockIcon />}
              title="Login & Security"
              subtitle="Change password and security settings"
              to="/buyer/account/profile"
            />
          </div>
          <div className="card">
            <Row
              icon={<ShoppingBag className="icon-md text-brand-500" />}
              title="My Orders"
              subtitle="Track and manage your order"
              to="/buyer/orders"
            />
          </div>
          <div className="card">
            <Row
              icon={<MapPin className="icon-md text-brand-500" />}
              title="Track Order"
              subtitle="Track your current order in real time"
              to={active ? `/buyer/track/${active.id}` : '/buyer/orders'}
            />
          </div>
        </section>

        <section className="card account-divide">
          <Row
            icon={<HelpCircle className="icon-md" />}
            title="Help & Support"
            subtitle="Get help and contact support"
            to="/buyer/account"
          />
          <Row
            icon={<Info className="icon-md" />}
            title="About Agroconnect"
            subtitle="Learn more about our mission"
            to="/buyer/account"
          />
        </section>

        <section className="card">
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/welcome', { replace: true })
            }}
            className="logout-btn"
          >
            <LogOut className="icon-md text-red" />
            <span className="logout-label">Log Out</span>
          </button>
        </section>
      </div>
    </>
  )
}