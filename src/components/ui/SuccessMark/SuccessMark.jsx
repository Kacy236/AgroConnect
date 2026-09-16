import { cx } from '@/lib/utils'
import './SuccessMark.css'

/** Deterministic confetti layout so the burst looks designed, not random. */
const CONFETTI = [
  { x: 22, y: 34, s: 5, c: '#E03131', r: 12, round: true },
  { x: 34, y: 16, s: 6, c: '#C9C93B', r: 20 },
  { x: 52, y: 6, s: 8, c: '#E03131', r: 0, round: true },
  { x: 68, y: 14, s: 6, c: '#C9C93B', r: 32 },
  { x: 80, y: 4, s: 4, c: '#E03131', r: 0, round: true },
  { x: 88, y: 24, s: 7, c: '#C9C93B', r: 18 },
  { x: 96, y: 42, s: 5, c: '#E03131', r: 0, round: true },
  { x: 12, y: 52, s: 5, c: '#2FB37A', r: 0, round: true },
  { x: 4, y: 40, s: 4, c: '#E03131', r: 24 },
  { x: 26, y: 58, s: 7, c: '#C9C93B', r: 40 },
  { x: 16, y: 70, s: 6, c: '#E03131', r: 0, round: true },
  { x: 30, y: 74, s: 5, c: '#2FB37A', r: 0, round: true },
  { x: 8, y: 78, s: 6, c: '#E8913A', r: 0, round: true },
  { x: 22, y: 86, s: 7, c: '#C9C93B', r: 14 },
  { x: 6, y: 92, s: 4, c: '#C9C93B', r: 28 },
  { x: 44, y: 30, s: 6, c: '#C9C93B', r: 36 },
  { x: 62, y: 40, s: 5, c: '#C9C93B', r: 0, round: true },
  { x: 92, y: 62, s: 5, c: '#2FB37A', r: 0, round: true },
  { x: 78, y: 80, s: 7, c: '#C9C93B', r: 22 },
  { x: 98, y: 76, s: 4, c: '#E03131', r: 0, round: true },
  { x: 86, y: 56, s: 4, c: '#E03131', r: 0, round: true },
  { x: 70, y: 92, s: 6, c: '#C9C93B', r: 30 },
]

/**
 * Celebration graphic shared by every "done" screen — account created,
 * verification approved, product published, order placed, withdrawal sent.
 */
export function SuccessMark({ className }) {
  return (
    <div className={cx('success-mark', className)} aria-hidden="true">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="success-confetti animate-pop-in"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.s,
            height: c.s,
            background: c.c,
            borderRadius: c.round ? '50%' : '1px',
            transform: `rotate(${c.r}deg)`,
            animationDelay: `${120 + i * 22}ms`,
          }}
        />
      ))}
      <div className="success-check-wrap">
        <div className="success-check-circle animate-pop-in">
          <svg viewBox="0 0 100 100" className="success-check-svg">
            <circle cx="50" cy="50" r="50" fill="#3FBE1F" />
            <path
              d="M28 52 L43 67 L73 33"
              fill="none"
              stroke="#CBEFAF"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function SuccessScreen({ title, description, children, actions }) {
  return (
    <div className="success-screen">
      <SuccessMark />
      <h1 className="success-screen-title">{title}</h1>
      {description ? <div className="success-screen-desc">{description}</div> : null}
      {children ? <div className="success-screen-children">{children}</div> : null}
      <div className="success-screen-actions">{actions}</div>
    </div>
  )
}