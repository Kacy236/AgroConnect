import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '@/lib/utils'
import './HarvestCalendar.css'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** Monday-first grid with harvest days marked green and today marked blue. */
export function HarvestCalendar({
  harvestDates,
  initialMonth,
}) {
  const [cursor, setCursor] = useState(() => initialMonth ?? new Date())

  const harvestDays = useMemo(() => {
    return new Set(
      harvestDates
        .map((d) => new Date(d))
        .filter((d) => d.getMonth() === cursor.getMonth() && d.getFullYear() === cursor.getFullYear())
        .map((d) => d.getDate()),
    )
  }, [harvestDates, cursor])

  const cells = useMemo(() => {
    const year = cursor.getFullYear()
    const month = cursor.getMonth()
    const first = new Date(year, month, 1)
    // getDay() is Sunday-first; shift so Monday starts the week.
    const lead = (first.getDay() + 6) % 7
    const days = new Date(year, month + 1, 0).getDate()
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ]
  }, [cursor])

  const today = new Date()
  const isCurrentMonth =
    today.getMonth() === cursor.getMonth() && today.getFullYear() === cursor.getFullYear()

  function shiftMonth(delta) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1))
  }

  return (
    <section className="card harvest-card">
      <div className="harvest-header">
        <h2 className="harvest-title">Harvest Calendar</h2>
        <div className="harvest-nav-controls">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="harvest-nav-btn"
            aria-label="Previous month"
          >
            <ChevronDown className="harvest-chevron-icon rotate-90" />
          </button>
          <span className="harvest-month-label">
            {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="harvest-nav-btn"
            aria-label="Next month"
          >
            <ChevronDown className="harvest-chevron-icon -rotate-90" />
          </button>
        </div>
      </div>

      <div className="harvest-grid">
        {WEEKDAYS.map((d) => (
          <div key={d} className="harvest-weekday">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`pad-${i}`} />
          const isHarvest = harvestDays.has(day)
          const isToday = isCurrentMonth && today.getDate() === day
          return (
            <div key={day} className="harvest-day-cell">
              <span
                className={cx(
                  'harvest-day-badge',
                  isToday
                    ? 'harvest-day-today'
                    : isHarvest
                      ? 'harvest-day-active'
                      : 'harvest-day-default',
                )}
              >
                {day}
              </span>
            </div>
          )
        })}
      </div>

      <div className="harvest-legend">
        <span className="harvest-legend-item">
          <span className="harvest-legend-dot bg-brand-600" />
          Harvest Day
        </span>
        <span className="harvest-legend-item">
          <span className="harvest-legend-dot harvest-dot-today" />
          Today
        </span>
      </div>
    </section>
  )
}