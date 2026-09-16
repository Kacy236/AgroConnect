import { Link } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { cx } from '@/lib/utils'
import './Bits.css'

export function Logo({ variant = 'green', className }) {
  return (
    <img
      src={variant === 'white' ? '/img/logo-white.png' : '/img/logo.png'}
      alt="AgroConnect"
      className={cx('logo-img', className)}
      draggable={false}
    />
  )
}

export function SearchInput({ wrapClassName, className, ...rest }) {
  return (
    <div className={cx('search-input-wrap', wrapClassName)}>
      <Search className="search-input-icon" />
      <input type="search" {...rest} className={cx('search-input', className)} />
    </div>
  )
}

export function StarRating({ value, size = 18, className }) {
  return (
    <div className={cx('star-rating', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= Math.round(value) ? 'star-filled' : 'star-empty'}
        />
      ))}
    </div>
  )
}

export function Pill({ active, children, onClick, className }) {
  return (
    <button type="button" onClick={onClick} className={cx('pill', active && 'pill-active', className)}>
      {children}
    </button>
  )
}

/** Soft green chip used for crop / farm-type multi-select. */
export function ChoiceChip({ active, children, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cx('choice-chip', active && 'choice-chip-active')}>
      {children}
    </button>
  )
}

export function SectionHeading({ title, action, to, className }) {
  return (
    <div className={cx('section-heading', className)}>
      <h2 className="section-heading-title">{title}</h2>
      {action && to ? (
        <Link to={to} className="section-heading-action">
          {action}
        </Link>
      ) : null}
    </div>
  )
}

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      {description ? <p className="empty-state-desc">{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx('toggle', checked && 'toggle-on')}
    >
      <span className={cx('toggle-knob', checked && 'toggle-knob-on')} />
    </button>
  )
}