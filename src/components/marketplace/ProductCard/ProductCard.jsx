import { Link } from 'react-router-dom'
import { MapPin, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { CATEGORIES } from '@/data/seed'
import { cx, money } from '@/lib/utils'
import './ProductCard.css'

function categoryName(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug
}

/** Buyer-facing tile: image over name and price. Used for Best Sellers / Favourites. */
export function ProductTile({ product, to }) {
  return (
    <Link to={to} className="product-tile">
      <div className="product-tile-img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" className="product-tile-img" />
      </div>
      <p className="product-tile-name">{product.name}</p>
      <p className="product-tile-price">
        {money(product.price)} / {product.unit}
      </p>
    </Link>
  )
}

/** Buyer-facing list row with a quick-add control. */
export function ProductRow({ product, to, onAdd, added }) {
  return (
    <div className="product-row">
      <Link to={to} className="product-row-img-link">
        <img src={product.image} alt={product.name} loading="lazy" className="product-row-img" />
      </Link>
      <Link to={to} className="product-row-info">
        <p className="product-row-name">{product.name}</p>
        <p className="product-row-price">
          {money(product.price)} / {product.unit}
        </p>
        <p className="product-row-stock">
          {product.inStock ? `Available ${product.available} ${product.unit}` : 'Out of stock'}
        </p>
      </Link>
      {onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          disabled={!product.inStock}
          aria-label={`Add ${product.name} to cart`}
          className={cx('product-row-add', product.inStock ? (added ? 'product-row-add-added' : 'product-row-add-active') : 'product-row-add-disabled')}
        >
          <Plus className="icon-20" />
        </button>
      ) : null}
    </div>
  )
}

/** Farmer marketplace card with stock and edit actions. */
export function FarmerProductCard({ product, onToggleStock, onEdit, to }) {
  return (
    <article className="farmer-product-card">
      <Link to={to} className="farmer-product-card-top">
        <p className="farmer-product-card-category">{categoryName(product.category)}</p>
        <div className="farmer-product-card-img-wrap">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={cx('farmer-product-card-img', !product.inStock && 'farmer-product-card-img-out')}
          />
        </div>
      </Link>

      <div className="farmer-product-card-body">
        <div className="farmer-product-card-row">
          <Link to={to} className="farmer-product-card-name">
            {product.name}
          </Link>
          <p className="farmer-product-card-price">
            {money(product.price)}
            <span className="farmer-product-card-unit">/{product.unit}</span>
          </p>
        </div>
        <p className="farmer-product-card-stock">
          {product.inStock ? `Available ${product.available} ${product.unit}` : 'Out of stock'}
        </p>
        <p className="farmer-product-card-location">
          <MapPin className="icon-16" style={{ color: 'var(--ink-mute)', flexShrink: 0 }} />
          <span className="farmer-product-card-location-text">
            {product.farmName} · {product.location}
          </span>
        </p>

        <div className="farmer-product-card-actions">
          <Button size="sm" onClick={onToggleStock} className="farmer-product-card-btn">
            {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
          </Button>
          <Button size="sm" variant="outline" onClick={onEdit} className="farmer-product-card-btn">
            Edit Product
          </Button>
        </div>
      </div>
    </article>
  )
}