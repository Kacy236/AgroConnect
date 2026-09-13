import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/utils'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'soft'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-brand-300',
  outline:
    'border border-brand-300 bg-white text-brand-600 hover:bg-brand-50 active:bg-brand-100 disabled:text-brand-300',
  ghost: 'bg-transparent text-brand-600 hover:bg-brand-50',
  danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50',
  soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
}

const SIZES: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-[52px] px-6 text-base',
}

const BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition ' +
  'disabled:cursor-not-allowed disabled:opacity-70 active:scale-[.99]'

interface CommonProps {
  variant?: Variant
  size?: Size
  block?: boolean
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  variant = 'primary',
  size = 'lg',
  block,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(BASE, VARIANTS[variant], SIZES[size], block && 'w-full', className)}
      {...rest}
    >
      {children}
    </button>
  )
}

interface LinkButtonProps extends CommonProps {
  to: string
  state?: unknown
  replace?: boolean
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
}: LinkButtonProps) {
  return (
    <Link
      to={to}
      state={state}
      replace={replace}
      className={cx(BASE, VARIANTS[variant], SIZES[size], block && 'w-full', className)}
    >
      {children}
    </Link>
  )
}
