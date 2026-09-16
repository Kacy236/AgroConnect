import { useNavigate, Link } from 'react-router-dom'
import {
  Bell,
  HelpCircle,
  Info,
  Landmark,
  LogOut,
  MapPin,
  Sparkles,
  User,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { PageHeader } from '@/components/layout/Header/Header'
import './FarmerSettingsPage.css'

function Row({ icon, title, subtitle, to, trailing }) {
  return (
    <Link to={to} className="settings-row">
      <span className="row-icon-wrapper">{icon}</span>
      <span className="row-content">
        <span className="row-title">{title}</span>
        {subtitle ? <span className="row-subtitle">{subtitle}</span> : null}
      </span>
      <span className="row-trailing">
        {trailing}
        <Chevron />
      </span>
    </Link>
  )
}

function Chevron() {
  return (
    <svg viewBox="0 0 20 20" className="chevron-icon" aria-hidden="true">
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FarmerSettingsPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <PageHeader
        title="Settings"
        backTo="/farmer/profile"
        right={
          <span className="header-bell-wrapper">
            <Bell className="header-bell-icon" />
          </span>
        }
      />

      <div className="settings-container">
        <section className="card settings-section">
          <Row
            icon={<User className="lucide-icon text-brand" />}
            title="Profile Information"
            subtitle="Manage your personal informations"
            to="/farmer/profile"
          />
          <Row
            icon={<LockIcon />}
            title="Change Password"
            subtitle="Chang password and security settings"
            to="/farmer/verify/security"
          />
          <Row
            icon={<Bell className="lucide-icon text-brand" />}
            title="Notification Settings"
            to="/farmer/settings"
          />
          <Row
            icon={<MapPin className="lucide-icon text-brand" />}
            title="Bank Details"
            to="/farmer/verify/bank"
          />
        </section>

        <section className="card settings-section">
          <Row
            icon={<Landmark className="lucide-icon text-brand" />}
            title="Language"
            to="/farmer/settings"
            trailing={<span>English</span>}
          />
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/welcome', { replace: true })
            }}
            className="logout-button"
          >
            <LogOut className="logout-icon" />
            <span className="logout-text">Log Out</span>
          </button>
        </section>

        <section className="card settings-section">
          <Row
            icon={<HelpCircle className="lucide-icon text-ink" />}
            title="Help & Support"
            subtitle="Get help and contact support"
            to="/farmer/settings"
          />
          <Row
            icon={<Info className="lucide-icon text-ink" />}
            title="About Agroconnect"
            subtitle="Learn more about our mission"
            to="/farmer/settings"
          />
          <Row
            icon={<Sparkles className="lucide-icon text-brand" />}
            title="Featured Plans"
            subtitle="Get your farm in front of more buyers"
            to="/farmer/featured"
          />
        </section>
      </div>
    </>
  )
}

function LockIcon() {
  return (
    <span className="lock-icon-wrapper">
      <svg viewBox="0 0 20 20" className="lock-icon-svg" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6 8V6.5a4 4 0 1 1 8 0V8h.5A1.5 1.5 0 0 1 16 9.5v6A1.5 1.5 0 0 1 14.5 17h-9A1.5 1.5 0 0 1 4 15.5v-6A1.5 1.5 0 0 1 5.5 8H6Zm1.5 0h5V6.5a2.5 2.5 0 0 0-5 0V8Z"
        />
      </svg>
    </span>
  )
}