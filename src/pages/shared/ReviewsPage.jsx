import { Navigate, useParams } from 'react-router-dom'
import { BadgeCheck, MessageSquareQuote } from 'lucide-react'
import { useProducts } from '@/context/ProductContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { EmptyState, StarRating } from '@/components/ui/Bits/Bits'
import { longDate } from '@/lib/utils'

export function ReviewsPage({ role }) {
  const { id = '' } = useParams()
  const { byId } = useProducts()
  const product = byId(id)

  const base = role === 'farmer' ? '/farmer/products' : '/buyer/product'
  if (!product) return <Navigate to={role === 'farmer' ? '/farmer/marketplace' : '/buyer'} replace />

  return (
    <>
      <PageHeader title="Reviews" backTo={`${base}/${product.id}`} />

      <div className="page-container-narrow">
        <div className="reviews-head">
          <img src={product.image} alt="" className="reviews-thumb" />
          <div>
            <h2 className="reviews-name">{product.name}</h2>
            <div className="reviews-rating-row">
              <StarRating value={product.rating} size={16} />
              <span className="label-soft">
                {product.rating.toFixed(1)} · {product.reviews.length} review
                {product.reviews.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        {product.reviews.length ? (
          <ul className="reviews-list">
            {product.reviews.map((review) => (
              <li key={review.id} className="reviews-item">
                <div className="reviews-item-head">
                  <StarRating value={review.rating} size={16} />
                  <span className="label-mute">{longDate(review.date)}</span>
                </div>
                <p className="reviews-item-title">{review.title}</p>
                <p className="reviews-item-body">{review.body}</p>
                <div className="reviews-item-foot">
                  <p className="label-mute">by {review.author}</p>
                  {review.verified ? (
                    <p className="verified-badge">
                      <BadgeCheck className="icon-sm" />
                      Verified Purchase
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8">
            <EmptyState
              icon={<MessageSquareQuote className="icon-lg" />}
              title="No reviews yet"
              description="Reviews appear here once buyers rate this produce."
            />
          </div>
        )}
      </div>
    </>
  )
}