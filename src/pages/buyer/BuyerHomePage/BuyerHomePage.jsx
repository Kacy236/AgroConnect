import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { GreetingHeader, MobileBrandHeader } from '@/components/layout/Header/Header'
import { CategoryCard } from '@/components/marketplace/CategoryCard/CategoryCard'
import { ProductRow, ProductTile } from '@/components/marketplace/ProductCard/ProductCard'
import { SearchInput } from '@/components/ui/Bits/Bits'
import { CATEGORIES } from '@/data/seed'
import './BuyerHomePage.css'

export function BuyerHomePage() {
  const { user } = useAuth()
  const { bestSellers, search } = useProducts()
  const { notify } = useToast()
  const [query, setQuery] = useState('')

  const firstName = user?.name.split(' ')[0] ?? 'Sarah'
  const results = useMemo(() => (query.trim() ? search(query) : []), [query, search])

  return (
    <>
      <MobileBrandHeader />
      <GreetingHeader name={firstName} subtitle="What would you like today?" accountHref="/buyer/account" />

      <div className="home-body">
        {/* Featured banner — desktop only */}
        <Link to="/buyer/category/grains" className="home-banner">
          <img
            src="/img/banner-fertilizer.jpg"
            alt="Featured: Nourish your soil, grow better — shop organic fertilizer"
            className="home-banner-img"
          />
        </Link>

        {/* Search */}
        <div className="home-search-row">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
            wrapClassName="flex-1"
          />
          <button
            type="button"
            onClick={() => notify('Visual search is coming soon')}
            aria-label="Search by photo"
            className="camera-btn"
          >
            <Camera className="icon-sm" />
          </button>
        </div>

        {query.trim() ? (
          <section className="mt-5">
            <h2 className="section-title">
              {results.length} result{results.length === 1 ? '' : 's'} for “{query.trim()}”
            </h2>
            <div className="results-list">
              {results.map((p) => (
                <ProductRow key={p.id} product={p} to={`/buyer/product/${p.id}`} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Categories */}
            <section className="mt-6">
              <div className="section-head">
                <h2 className="section-title">Categories</h2>
                <Link to="/buyer/category/vegetables" className="see-all-link">
                  See all
                  <ArrowRight className="icon-xs" />
                </Link>
              </div>
              <div className="category-grid">
                {CATEGORIES.map((c) => (
                  <CategoryCard key={c.slug} category={c} />
                ))}
              </div>
            </section>

            {/* Best sellers */}
            <section className="mt-8">
              <h2 className="section-title mb-3">Best Sellers</h2>
              <div className="best-sellers-wrap">
                <div className="tile-grid">
                  {bestSellers.map((p) => (
                    <ProductTile key={p.id} product={p} to={`/buyer/product/${p.id}`} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  )
}