import { Link, useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Logo, SearchInput } from '@/components/ui/Bits'
import { cx, greeting } from '@/lib/utils'

function BellButton({ className }: { className?: string }) {
  return (
    <Link
      to="#"
      onClick={(e) => e.preventDefault()}
      aria-label="Notifications"
      className={cx(
        'relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-card transition hover:text-brand-600',
        className,
      )}
    >
      <Bell className="h-5 w-5" />
      <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
    </Link>
  )
}

function Avatar({ to }: { to: string }) {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link to={to} aria-label="Your account">
      <img
        src={user.avatar}
        alt=""
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
      />
    </Link>
  )
}

/** Compact branded bar shown at the top of the mobile home screens. */
export function MobileBrandHeader({ showMenu = false }: { showMenu?: boolean }) {
  return (
    <div className="flex items-center justify-between bg-brand-50 px-4 py-3 lg:hidden">
      {showMenu ? (
        <Link
          to="/farmer/profile"
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-card"
        >
          <Menu className="h-5 w-5" />
        </Link>
      ) : (
        <span className="h-10 w-10" />
      )}
      <Logo className="w-[150px]" />
      <BellButton />
    </div>
  )
}

interface GreetingHeaderProps {
  name: string
  subtitle: string
  accountHref: string
  /** Farmer dashboards show a product search in the header; buyers do not. */
  search?: { value: string; onChange: (v: string) => void; placeholder?: string }
}

export function GreetingHeader({ name, subtitle, accountHref, search }: GreetingHeaderProps) {
  return (
    <header
      className={cx(
        'px-4 pb-4 pt-3 lg:px-8 lg:pt-6',
        search ? 'bg-white' : 'bg-brand-50 lg:bg-brand-50',
      )}
    >
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[26px] font-extrabold leading-tight text-ink lg:text-[28px]">
            {greeting()}, {name}!
          </h1>
          <p className="mt-0.5 text-[15px] text-ink-soft">{subtitle}</p>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          {search ? (
            <SearchInput
              value={search.value}
              onChange={(e) => search.onChange(e.target.value)}
              placeholder={search.placeholder ?? 'Search product'}
              wrapClassName="w-[260px]"
            />
          ) : null}
          <BellButton className="shadow-none" />
          <Avatar to={accountHref} />
        </div>
      </div>
    </header>
  )
}

interface PageHeaderProps {
  title: string
  /** Defaults to browser back. */
  backTo?: string
  right?: ReactNode
  sticky?: boolean
  /** Large headings sit left-aligned; the default is centred like the designs. */
  align?: 'center' | 'left'
}

export function PageHeader({
  title,
  backTo,
  right,
  sticky = true,
  align = 'center',
}: PageHeaderProps) {
  const navigate = useNavigate()
  return (
    <header
      className={cx(
        'z-30 flex items-center gap-3 border-b border-transparent bg-white px-4 py-3 lg:px-8',
        sticky && 'sticky top-0',
      )}
    >
      <button
        type="button"
        onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
        aria-label="Go back"
        className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition hover:bg-brand-50"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <h1
        className={cx(
          'min-w-0 flex-1 truncate text-xl font-bold text-ink',
          align === 'center' && 'text-center',
        )}
      >
        {title}
      </h1>
      <div className="flex h-10 min-w-[40px] items-center justify-end">{right}</div>
    </header>
  )
}
