import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, Menu } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Logo, SearchInput } from '@/components/ui/Bits/Bits'
import { cx, greeting } from '@/lib/utils'
import './Header.css'

function BellButton({ className }) {
  return (
    <Link to="#" onClick={(e) => e.preventDefault()} aria-label="Notifications" className={cx('bell-btn', className)}>
      <Bell className="icon-20" />
      <span className="bell-dot" />
    </Link>
  )
}

function Avatar({ to }) {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link to={to} aria-label="Your account">
      <img src={user.avatar} alt="" className="header-avatar" />
    </Link>
  )
}

/** Compact branded bar shown at the top of the mobile home screens. */
export function MobileBrandHeader({ showMenu = false }) {
  return (
    <div className="mobile-brand-header">
      {showMenu ? (
        <Link to="/farmer/profile" aria-label="Open menu" className="mobile-brand-menu">
          <Menu className="icon-20" />
        </Link>
      ) : (
        <span className="mobile-brand-spacer" />
      )}
      <Logo className="mobile-brand-logo" />
      <BellButton />
    </div>
  )
}

export function GreetingHeader({ name, subtitle, accountHref, search }) {
  return (
    <header className={cx('greeting-header', search ? 'greeting-header-white' : 'greeting-header-brand')}>
      <div className="greeting-header-row">
        <div className="greeting-header-text">
          <h1 className="greeting-header-title">
            {greeting()}, {name}!
          </h1>
          <p className="greeting-header-subtitle">{subtitle}</p>
        </div>
        <div className="greeting-header-actions">
          {search ? (
            <SearchInput
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? 'Search product'}
              wrapClassName="greeting-header-search"
            />
          ) : null}
          <BellButton className="bell-btn-flat" />
          <Avatar to={accountHref} />
        </div>
      </div>
    </header>
  )
}

export function PageHeader({ title, backTo, right, sticky = true, align = 'center' }) {
  const navigate = useNavigate()
  return (
    <header className={cx('page-header', sticky && 'page-header-sticky')}>
      <button type="button" onClick={() => (backTo ? navigate(backTo) : navigate(-1))} aria-label="Go back" className="page-header-back">
        <ChevronLeft className="icon-24" />
      </button>
      <h1 className={cx('page-header-title', align === 'center' && 'page-header-title-center')}>{title}</h1>
      <div className="page-header-right">{right}</div>
    </header>
  )
}