import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { FarmerProductCard } from '@/components/marketplace/ProductCard/ProductCard'
import { EmptyState, Pill, SearchInput } from '@/components/ui/Bits/Bits'
import { LinkButton } from '@/components/ui/Button/Button'
import { PageHeader } from '@/components/layout/Header/Header'
import './FarmerMarketplace.css'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
  { label: 'Grains', value: 'grains' },
  { label: 'Tuber', value: 'roots' },
]

export function FarmerMarketplace() {
  const { search, toggleStock, products } = useProducts()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const results = useMemo(() => search(query, filter), [search, query, filter])

  return (
    <>
      <div className="farmer-market-desktop-header">
        <h1 className="farmer-market-title">Marketplace</h1>
        <p className="farmer-market-subtitle">Farm-gate prices, delivered directly to you.</p>
      </div>
      <div className="farmer-market-mobile-header">
        <PageHeader title="Marketplace" backTo="/farmer" />
      </div>

      <div className="farmer-market">
        <div className="farmer-market-controls">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product" />
          <div className="farmer-market-filters">
            {FILTERS.map((f) => (
              <Pill key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Pill>
            ))}
          </div>
        </div>

        {results.length ? (
          <div className="farmer-market-grid">
            {results.map((product) => (
              <FarmerProductCard
                key={product.id}
                product={product}
                to={`/farmer/products/${product.id}`}
                onToggleStock={() => {
                  toggleStock(product.id)
                  notify(
                    product.inStock
                      ? `${product.name} marked out of stock`
                      : `${product.name} is back in stock`,
                  )
                }}
                onEdit={() => navigate(`/farmer/products/${product.id}/edit`)}
              />
            ))}
          </div>
        ) : (
          <div className="farmer-market-empty">
            <EmptyState
              icon={<PackageSearch className="icon-28" />}
              title="No products match that search"
              description={
                products.length
                  ? 'Try a different name or clear the category filter.'
                  : 'Add your first listing to start selling.'
              }
              action={<LinkButton to="/farmer/products/new">Add a product</LinkButton>}
            />
          </div>
        )}
      </div>
    </>
  )
}