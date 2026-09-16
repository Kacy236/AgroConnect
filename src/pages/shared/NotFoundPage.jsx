import { Sprout } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { LinkButton } from '@/components/ui/Button/Button'

export function NotFoundPage() {
  const { user } = useAuth()
  const home = user ? (user.role === 'farmer' ? '/farmer' : '/buyer') : '/welcome'

  return (
    <div className="not-found-page">
      <span className="not-found-icon">
        <Sprout className="icon-lg" />
      </span>
      <p className="not-found-eyebrow">Error 404</p>
      <h1 className="not-found-title">This field is empty</h1>
      <p className="not-found-desc">
        We couldn&apos;t find the page you were looking for. It may have been moved or harvested.
      </p>
      <LinkButton to={home} className="mt-8">
        Back to safety
      </LinkButton>
    </div>
  )
}