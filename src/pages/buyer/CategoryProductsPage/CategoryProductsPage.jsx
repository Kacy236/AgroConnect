import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PackageSearch } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { ProductRow } from '@/components/marketplace/ProductCard/ProductCard'
import { EmptyState, SearchInput } from '@/components/ui/Bits/Bits'
import { CATEGORIES } from '@/data/seed'
import { cx } from '@/lib/utils'
import './CategoryProductsPage.css'

export function CategoryProductsPage() {
  const { slug = '' } = useParams()
  const { byCategory, search } = useProducts()
  const { add, has } = useCart()
  const { notify } = useToast()
  const [query, setQuery] = useState('')

  const category = CATEGORIES.find((c) => c.slug === slug)
  const products = useMemo(
    () =>
      query.trim()
        ? search(query, slug)
        : byCategory(slug),
    [query, search, byCategory, slug],
  )

  if (!category) return <Navigate to="/buyer" replace />

  return (
    <>
      <PageHeader title={category.name} backTo="/buyer" />

      <div className="category-page">
        <div className="category-header-wrap">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product..."
            wrapClassName="search-wrap-lg"
          />

          <nav
            aria-label="Categories"
            className="category-nav"
          >
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to={`/buyer/category/${c.slug}`}
                aria-current={c.slug === slug ? 'page' : undefined}
                className={cx(
                  'category-pill',
                  c.slug === slug
                    ? 'category-pill-active'
                    : 'category-pill-inactive',
                )}
              >
                {c.name}
              </Link>
            ))}
          </nav>
        </div>

        {products.length ? (
          <div className="category-grid">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                to={`/buyer/product/${product.id}`}
                added={has(product.id)}
                onAdd={() => {
                  add(product)
                  notify(`${product.name} added to cart`)
                }}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state-wrap">
            <EmptyState
              icon={<PackageSearch className="empty-icon" />}
              title="Nothing here yet"
              description={`No ${category.name.toLowerCase()} match that search.`}
            />
          </div>
        )}
      </div>
    </>
  )
}