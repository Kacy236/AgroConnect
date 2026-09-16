import { cx } from '@/lib/utils'
import './StepIndicator.css'

/**
 * Connected dot rail used across the farmer verification flow.
 * `current` is 1-based; every dot up to and including it reads as complete.
 */
export function StepIndicator({ current, total = 6, className }) {
  return (
    <div
      className={cx('step-indicator', className)}
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Step ${current} of ${total}`}
    >
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const done = step <= current
        return (
          <div key={step} className={cx('step-indicator-item', i < total - 1 && 'step-indicator-item-grow')}>
            <span className={cx('step-dot', done && 'step-dot-done')} />
            {i < total - 1 ? <span className={cx('step-line', step < current && 'step-line-done')} /> : null}
          </div>
        )
      })}
    </div>
  )
}