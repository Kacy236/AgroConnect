import { Link } from 'react-router-dom'
import { cx } from '@/lib/utils'
import './StatCard.css'

export function StatCard({ icon, value, label, tone = 'green', to, className }) {
  const body = (
    <>
      <span className={cx('stat-card-icon', `stat-card-icon-${tone}`)}>{icon}</span>
      <span className="stat-card-value">{value}</span>
      <span className="stat-card-label">{label}</span>
    </>
  )

  const classes = cx('stat-card', `stat-card-${tone}`, to && 'stat-card-link', className)

  return to ? (
    <Link to={to} className={classes}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  )
}