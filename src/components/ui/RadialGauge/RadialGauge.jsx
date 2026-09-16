import { clamp } from '@/lib/utils'
import './RadialGauge.css'

/** Verification score ring — e.g. "99% Excellent!" on the review screen. */
export function RadialGauge({ value, size = 180, stroke = 14, caption }) {
  const pct = clamp(value, 0, 100)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - pct / 100)

  return (
    <div className="radial-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="radial-gauge-svg" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4F2E3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#2E9138"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .9s cubic-bezier(.22,1,.36,1)' }}
        />
      </svg>
      <div className="radial-gauge-text">
        <span className="radial-gauge-value">{pct}%</span>
        {caption ? <span className="radial-gauge-caption">{caption}</span> : null}
      </div>
      <span className="sr-only">Verification score {pct} percent</span>
    </div>
  )
}

export function scoreCaption(score) {
  if (score >= 90) return 'Excellent!'
  if (score >= 70) return 'Good'
  if (score >= 40) return 'Getting there'
  return 'Just started'
}