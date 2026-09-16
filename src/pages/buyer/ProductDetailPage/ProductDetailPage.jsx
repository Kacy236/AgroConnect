import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, ChevronLeft, Heart, Minus, MessageCircle, Plus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button/Button'
import { StarRating } from '@/components/ui/Bits/Bits'
import { cx, money } from '@/lib/utils'
import './ProductDetailPage.css'

export function ProductDetailPage() {
  const { id = '' } = useParams()
  const { byId, toggleFavourite, isFavourite } = useProducts()
  const { add } = useCart()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)

  const product = byId(id)
  if (!product) return <Navigate to="/buyer" replace />

  const favourite = isFavourite(product.id)
  const topReview = product.reviews[0]

  function addToCart() {
    add(product, qty)
    notify(`${qty} ${product.unit} of ${product.name} added to cart`)
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-top">
        <button type="button" onClick={() => navigate(-1)} aria-label="Go back" className="icon-btn">
          <ChevronLeft className="icon-md" />
        </button>
        <button
          type="button"
          onClick={() => toggleFavourite(product.id)}
          aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={favourite}
          className="icon-btn"
        >
          <Heart className={cx('icon-md', favourite && 'heart-filled')} />
        </button>
      </div>

      <img src={product.image} alt={product.name} className="product-detail-img" />

      <h1 className="product-detail-name">{product.name}</h1>
      <p className="product-detail-price">
        ₦ {product.price.toLocaleString('en-NG')} / {product.unit}
      </p>
      <p className="label-soft mt-1">
        Sold by <span className="value-bold-inline">{product.farmName}</span> · {product.location}
      </p>

      <section className="product-detail-section">
        <h2 className="panel-title">Product Details</h2>
        <p className="product-detail-desc">{product.description}</p>
      </section>

      <div className="divider-thick" />

      <section className="product-detail-qty-row">
        <h2 className="panel-title mb-0">Available Quantity</h2>
        <p className="value-bold">
          {product.inStock ? `${product.available}${product.unit}` : 'Out of stock'}
        </p>
      </section>

      <section className="mt-4">
        <div className="product-review-head">
          <StarRating value={product.rating} size={20} />
          <Link to={`/buyer/product/${product.id}/reviews`} className="see-all-link">
            See All
          </Link>
        </div>

        {topReview ? (
          <div className="mt-2">
            <p className="review-title">{topReview.title}</p>
            <p className="review-body">{topReview.body}</p>
            <div className="review-foot">
              <p className="label-mute">by {topReview.author}</p>
              {topReview.verified ? (
                <p className="verified-badge">
                  <BadgeCheck className="icon-sm" />
                  Verified Purchase
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="label-soft mt-2">No reviews yet.</p>
        )}
      </section>

      {product.inStock ? (
        <section className="qty-stepper-row">
          <p className="value-bold mb-0">Quantity ({product.unit})</p>
          <div className="qty-stepper">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Reduce quantity"
              className="qty-btn"
            >
              <Minus className="icon-xs" />
            </button>
            <span className="qty-value">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.available, q + 1))}
              aria-label="Increase quantity"
              className="qty-btn"
            >
              <Plus className="icon-xs" />
            </button>
          </div>
        </section>
      ) : null}

      <div className="product-detail-actions">
        <Button block disabled={!product.inStock} onClick={addToCart}>
          {product.inStock ? `Add to Cart · ${money(product.price * qty)}` : 'Out of Stock'}
        </Button>
        <Button variant="outline" block onClick={() => navigate('/buyer/chats/c-musa')}>
          <MessageCircle className="icon-md" />
          Message farmer
        </Button>
      </div>
    </div>
  )
}