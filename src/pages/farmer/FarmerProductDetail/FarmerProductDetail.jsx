import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, ChevronLeft, Heart } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button/Button'
import { StarRating } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import './FarmerProductDetail.css'

export function FarmerProductDetail() {
  const { id = '' } = useParams()
  const { byId, toggleStock, toggleFavourite, isFavourite } = useProducts()
  const { notify } = useToast()
  const navigate = useNavigate()

  const product = byId(id)
  if (!product) return <Navigate to="/farmer/marketplace" replace />

  const favourite = isFavourite(product.id)
  const topReview = product.reviews[0]

  return (
    <div className="fpd">
      <div className="fpd-top">
        <button type="button" onClick={() => navigate('/farmer/marketplace')} aria-label="Go back" className="fpd-icon-btn">
          <ChevronLeft className="icon-24" />
        </button>
        <button
          type="button"
          onClick={() => toggleFavourite(product.id)}
          aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={favourite}
          className="fpd-icon-btn"
        >
          <Heart className="icon-24" style={favourite ? { fill: '#ef4444', color: '#ef4444' } : undefined} />
        </button>
      </div>

      <img src={product.image} alt={product.name} className="fpd-image" />

      <h1 className="fpd-name">{product.name}</h1>
      <p className="fpd-price">
        ₦ {product.price.toLocaleString('en-NG')} / {product.unit}
      </p>

      <section className="fpd-details">
        <h2 className="fpd-details-title">Product Details</h2>
        <p className="fpd-details-text">{product.description}</p>
      </section>

      <div className="fpd-divider" />

      <section className="fpd-qty-row">
        <h2 className="fpd-qty-title">Available Quantity</h2>
        <p className="fpd-qty-value">{product.inStock ? `${product.available}${product.unit}` : 'Out of stock'}</p>
      </section>

      <section className="fpd-reviews">
        <div className="fpd-reviews-header">
          <StarRating value={product.rating} size={20} />
          <Link to={`/farmer/products/${product.id}/reviews`} className="fpd-see-all">
            See All
          </Link>
        </div>

        {topReview ? (
          <div className="fpd-review">
            <p className="fpd-review-title">{topReview.title}</p>
            <p className="fpd-review-body">{topReview.body}</p>
            <div className="fpd-review-meta">
              <p className="fpd-review-author">by {topReview.author}</p>
              {topReview.verified ? (
                <p className="fpd-verified">
                  <BadgeCheck className="icon-18" />
                  Verified Purchase
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="fpd-no-reviews">No reviews yet.</p>
        )}
      </section>

      <div className="fpd-actions">
        <Button
          block
          onClick={() => {
            toggleStock(product.id)
            notify(product.inStock ? `${product.name} marked out of stock` : `${product.name} is back in stock`)
          }}
        >
          {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
        </Button>
        <Button variant="outline" block onClick={() => navigate(`/farmer/products/${product.id}/edit`)}>
          Edit Product
        </Button>
      </div>
    </div>
  )
}