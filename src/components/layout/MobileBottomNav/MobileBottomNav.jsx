import { NavLink } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useChats } from '@/context/ChatContext'
import { cx } from '@/lib/utils'
import { navFor } from '../navItems'
import '../MobileBottomNav/MobileBottomNav.css'

function Badge({ count }) {
  if (count <= 0) return null
  return <span className="bottom-nav-badge">{count > 9 ? '9+' : count}</span>
}

export function MobileBottomNav({ role }) {
  const { count: cartCount } = useCart()
  const { unreadCount } = useChats()
  const items = navFor(role)

  const counts = { cart: cartCount, chats: unreadCount }

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <ul className="bottom-nav-list">
        {items.map((item) => (
          <li key={item.to} className="bottom-nav-item">
            <NavLink to={item.to} end={item.end} className={() => cx('bottom-nav-link', item.fab && 'bottom-nav-link-fab')}>
              {({ isActive }) => (
                <>
                  <span className={cx('bottom-nav-icon', item.fab && 'bottom-nav-icon-fab', !item.fab && isActive && 'bottom-nav-icon-active')}>
                    {item.icon}
                    {item.badge ? <Badge count={counts[item.badge]} /> : null}
                  </span>
                  <span className={cx('bottom-nav-label', isActive && !item.fab && 'bottom-nav-label-active')}>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}