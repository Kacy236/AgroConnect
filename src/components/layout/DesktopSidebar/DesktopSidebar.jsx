import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useChats } from '@/context/ChatContext'
import { Logo } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import { BUYER_NAV, FARMER_SIDEBAR } from '../navItems'
import '../DesktopSidebar/DesktopSidebar.css'

function Count({ n }) {
  if (n <= 0) return null
  return <span className="sidebar-count">{n}</span>
}

/**
 * Two sidebar treatments, matching the designs:
 * buyers get a pale-green panel of white cards, farmers a plain white rail.
 */
export function DesktopSidebar({ role }) {
  const { logout } = useAuth()
  const { count: cartCount } = useCart()
  const { unreadCount } = useChats()
  const navigate = useNavigate()
  const counts = { cart: cartCount, chats: unreadCount }

  const isBuyer = role === 'buyer'
  const items = isBuyer ? BUYER_NAV : FARMER_SIDEBAR

  function handleLogout() {
    logout()
    navigate('/welcome', { replace: true })
  }

  return (
    <aside className={cx('sidebar', isBuyer ? 'sidebar-buyer' : 'sidebar-farmer')}>
      <div className={cx('sidebar-logo-wrap', isBuyer ? 'sidebar-logo-wrap-buyer' : 'sidebar-logo-wrap-farmer')}>
        <Logo className={isBuyer ? 'sidebar-logo-buyer' : 'sidebar-logo-farmer'} />
      </div>

      <nav aria-label="Primary" className="sidebar-nav">
        <ul className={cx('sidebar-list', isBuyer ? 'sidebar-list-buyer' : 'sidebar-list-farmer')}>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cx('sidebar-link', isBuyer ? 'sidebar-link-buyer' : 'sidebar-link-farmer', isActive && (isBuyer ? 'sidebar-link-buyer-active' : 'sidebar-link-farmer-active'))
                }
              >
                {item.icon}
                <span className={isBuyer ? 'sidebar-link-label-buyer' : ''}>{item.label}</span>
                {item.badge ? <Count n={counts[item.badge]} /> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button type="button" onClick={handleLogout} className="sidebar-logout">
        <LogOut className="icon-20" />
        Log out
      </button>
    </aside>
  )
}