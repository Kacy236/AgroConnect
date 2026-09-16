import React from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { EarningsChart } from '@/components/farmer/EarningsChart/EarningsChart'
import { PageHeader } from '@/components/layout/Header/Header'
import '../MetricLayout/MetricLayout.css'

export const PERIODS = ['This Week', 'This Month', 'This Year']

export function PeriodSelect({ value, onChange }) {
  return (
    <label className="period-select-label">
      <span className="sr-only">Reporting period</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="period-select"
      >
        {PERIODS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 20 20"
        className="period-select-icon"
        aria-hidden="true"
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </label>
  )
}

export function Delta({ value }) {
  const up = value >= 0
  const Icon = up ? ArrowUp : ArrowDown
  return (
    <p className={`delta-text ${up ? 'delta-up' : 'delta-down'}`}>
      <Icon className="delta-icon" strokeWidth={3} />
      {Math.abs(value)}%
    </p>
  )
}

/** Shared frame for Earnings / Product Sold / Order Overview. */
export function MetricLayout({
  title,
  backTo,
  period,
  onPeriodChange,
  metricLabel,
  metricValue,
  delta,
  data,
  children,
  footer,
  chartUnit,
}) {
  return (
    <div className="metric-layout-page">
      <PageHeader title={title} backTo={backTo} />

      <div className="metric-layout-container">
        <div className="period-select-container">
          <PeriodSelect value={period} onChange={onPeriodChange} />
        </div>

        <div className="metric-header">
          <p className="metric-label">{metricLabel}</p>
          <p className="metric-value">{metricValue}</p>
          <Delta value={delta} />
        </div>

        <div className="metric-chart-container">
          <EarningsChart data={data} unit={chartUnit} />
        </div>

        {children ? <div className="metric-children">{children}</div> : null}
        {footer ? <div className="metric-footer">{footer}</div> : null}
      </div>
    </div>
  )
}