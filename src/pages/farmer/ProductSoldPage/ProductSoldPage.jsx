import React, { useMemo, useState } from 'react'
import { useProducts } from '@/context/ProductContext'
import { ProductTile } from '@/components/marketplace/ProductCard/ProductCard'
import { MetricLayout } from '../MetricLayout/MetricLayout'
import { seriesFor } from '../EarningsPage/EarningsPage'
import './ProductSoldPage.css'

export function ProductSoldPage() {
  const { bestSellers } = useProducts()
  const [period, setPeriod] = useState('This Month')
  const data = useMemo(() => seriesFor(period), [period])

  return (
    <MetricLayout
      title="Product Sold"
      backTo="/farmer/analytics"
      period={period}
      onPeriodChange={setPeriod}
      metricLabel="Total Product Sold"
      metricValue="50kg"
      delta={3}
      data={data}
      chartUnit="kg"
    >
      <section className="best-sellers-card">
        <h2 className="best-sellers-title">Best Sellers</h2>
        <div className="best-sellers-grid">
          {bestSellers.slice(0, 3).map((p) => (
            <ProductTile key={p.id} product={p} to={`/farmer/products/${p.id}`} />
          ))}
        </div>
      </section>
    </MetricLayout>
  )
}