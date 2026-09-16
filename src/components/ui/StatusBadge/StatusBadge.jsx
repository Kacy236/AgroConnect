import { cx } from '@/lib/utils'
import './StatusBadge.css'

const LABELS = {
  pending: 'Pending',
  processing: 'Processing',
  'in-transit': 'In-transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function StatusBadge({ status, className, size = 'md' }) {
  return (
    <span className={cx('status-badge', `status-badge-${status}`, size === 'sm' && 'status-badge-sm', className)}>
      {LABELS[status]}
    </span>
  )
}

export function VerifiedBadge({ className }) {
  return (
    <span className={cx('verified-badge', className)}>
      <svg viewBox="0 0 20 20" className="verified-badge-icon" aria-hidden="true">
        <path
          fill="currentColor"
          d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"
        />
        <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z" />
      </svg>
      Verified
    </span>
  )
}