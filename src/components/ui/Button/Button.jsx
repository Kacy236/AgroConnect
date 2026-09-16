import { Link } from 'react-router-dom'
import { cx } from '@/lib/utils'
import './Button.css'

const BASE = 'btn'

export function Button({
  variant = 'primary',
  size = 'lg',
  block,
  className,
  children,
  type = 'button',
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(BASE, `btn-${variant}`, `btn-${size}`, block && 'btn-block', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export function LinkButton({
  to,
  state,
  replace,
  variant = 'primary',
  size = 'lg',
  block,
  className,
  children,
}) {
  return (
    <Link
      to={to}
      state={state}
      replace={replace}
      className={cx(BASE, `btn-${variant}`, `btn-${size}`, block && 'btn-block', className)}
    >
      {children}
    </Link>
  )
}