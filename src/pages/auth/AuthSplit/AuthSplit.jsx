import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cx } from '@/lib/utils'
import '../AuthSplit/AuthSplit.css'

/**
 * Shared onboarding frame: a scrolling form column with a tall photograph
 * beside it from `lg` up, collapsing to a single column on phones.
 */
export function AuthSplit({
  children,
  image,
  imageAlt,
  showBack = true,
  backTo,
  leaves = false,
  contentClassName,
}) {
  const navigate = useNavigate()

  return (
    <div className="auth-split">
      <div className="auth-split-col">
        <div className="auth-split-dots-row">
          <span className="auth-split-dots" aria-hidden="true">
            <span className="auth-dot auth-dot-brand" />
            <span className="auth-dot auth-dot-ink" />
            <span className="auth-dot auth-dot-light" />
          </span>
        </div>

        {showBack ? (
          <button
            type="button"
            onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
            aria-label="Go back"
            className="auth-split-back"
          >
            <ChevronLeft className="icon-24" />
          </button>
        ) : (
          <div className="auth-split-spacer" />
        )}

        <div className={cx('auth-split-content', contentClassName)}>
          <div className="auth-split-content-inner">{children}</div>
        </div>

        {leaves ? (
          <img src="/img/leaves.png" alt="" aria-hidden="true" className="auth-split-leaves" />
        ) : null}
      </div>

      <div className="auth-split-image-col">
        <img src={image} alt={imageAlt} className="auth-split-image" />
      </div>
    </div>
  )
}