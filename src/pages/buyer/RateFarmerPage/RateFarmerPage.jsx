import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useProducts } from '@/context/ProductContext'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { Button } from '@/components/ui/Button/Button'
import { FARMER } from '@/data/seed'
import { cx } from '@/lib/utils'
import './RateFarmerPage.css'

const CAPTIONS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!']
const MAX = 200

export function RateFarmerPage() {
  const { id = '' } = useParams()
  const { byId, markRated } = useOrders()
  const { addReview } = useProducts()
  const { user } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [review, setReview] = useState('Great quality product and fast delivery. Will definitely order again')

  const order = byId(id)
  if (!order) return <Navigate to="/buyer/orders" replace />

  function submit(e) {
    e.preventDefault()
    // Attribute the review to every product in the order.
    order.lines.forEach((line) =>
      addReview(line.productId, {
        author: user?.name ?? 'Sarah Agada',
        rating,
        title: CAPTIONS[rating] ?? 'Rated',
        body: review.trim(),
        verified: true,
      }),
    )
    markRated(order.id)
    notify('Thanks for rating your farmer')
    navigate(`/buyer/orders/${order.id}`, { replace: true })
  }

  const shown = hover || rating

  return (
    <>
      <PageHeader title="Rate Your Farmer" backTo={`/buyer/orders/${order.id}`} />

      <form onSubmit={submit} className="rate-form">
        <div className="rate-farmer-profile">
          <img
            src={FARMER.avatar}
            alt=""
            className="rate-farmer-avatar"
          />
          <h2 className="rate-farmer-name">{order.farmerName}</h2>
          <p className="rate-farmer-phone">{FARMER.phone}</p>
        </div>

        <dl className="rate-meta-list">
          <div className="rate-meta-item">
            <dt className="rate-meta-dt">Location:</dt>
            <dd className="rate-meta-dd">Kano</dd>
          </div>
          <div className="rate-meta-item">
            <dt className="rate-meta-dt">Farm Type:</dt>
            <dd className="rate-meta-dd">{FARMER.farmType}</dd>
          </div>
        </dl>

        <section className="rate-section" onMouseLeave={() => setHover(0)}>
          <h3 className="rate-section-title">How was your experience?</h3>
          <div className="rate-stars-row">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                aria-label={`${value} star${value === 1 ? '' : 's'}`}
                className="rate-star-btn"
              >
                <Star
                  className={cx(
                    'rate-star-icon',
                    value <= shown
                      ? 'rate-star-active'
                      : 'rate-star-inactive',
                  )}
                />
              </button>
            ))}
          </div>
          <p className="rate-caption">{CAPTIONS[shown]}</p>
        </section>

        <div className="rate-textarea-wrap">
          <label htmlFor="review" className="rate-textarea-label">
            Write a review <span className="rate-textarea-optional">(optional)</span>
          </label>
          <textarea
            id="review"
            value={review}
            maxLength={MAX}
            onChange={(e) => setReview(e.target.value)}
            className="field-box rate-textarea"
          />
          <p className="rate-char-counter">
            {review.length}/{MAX}
          </p>
        </div>

        <Button type="submit" block className="rate-submit-btn">
          Submit Review
        </Button>
      </form>
    </>
  )
}