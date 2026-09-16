import { Check } from 'lucide-react'
import { cx } from '@/lib/utils'
import './OrderTimeline.css'

const STEPS = [
  { status: 'pending', label: 'Order placed', note: 'We sent your order to the farmer' },
  { status: 'processing', label: 'Confirmed', note: 'The farmer is packing your produce' },
  { status: 'in-transit', label: 'Out for delivery', note: 'Your rider is on the way' },
  { status: 'delivered', label: 'Delivered', note: 'Enjoy your produce' },
]

export function OrderTimeline({ status }) {
  if (status === 'cancelled') {
    return <div className="order-timeline-cancelled">This order was cancelled.</div>
  }

  const current = STEPS.findIndex((s) => s.status === status)

  return (
    <ol className="order-timeline">
      {STEPS.map((step, i) => {
        const done = i <= current
        const isLast = i === STEPS.length - 1
        return (
          <li key={step.status} className="order-timeline-item">
            <div className="order-timeline-rail">
              <span className={cx('order-timeline-dot', done && 'order-timeline-dot-done')}>
                {done ? <Check className="icon-16" strokeWidth={3} /> : null}
              </span>
              {!isLast ? <span className={cx('order-timeline-line', i < current && 'order-timeline-line-done')} /> : null}
            </div>
            <div className="order-timeline-text">
              <p className={cx('order-timeline-label', done ? 'order-timeline-label-done' : 'order-timeline-label-pending')}>
                {step.label}
              </p>
              <p className="order-timeline-note">{step.note}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}