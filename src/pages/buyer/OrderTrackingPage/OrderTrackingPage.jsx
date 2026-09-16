import { Navigate, useParams } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { useOrders } from '@/context/OrderContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { DeliveryMap } from '@/components/orders/DeliveryMap/DeliveryMap'
import { LinkButton } from '@/components/ui/Button/Button'
import { RIDER } from '@/data/seed'
import { longDate } from '@/lib/utils'
import './OrderTrackingPage.css'

const STATUS_COPY = {
  pending: 'Awaiting farmer confirmation',
  processing: 'Preparing your order',
  'in-transit': 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export function OrderTrackingPage() {
  const { id = '' } = useParams()
  const { byId } = useOrders()
  const order = byId(id)

  if (!order) return <Navigate to="/buyer/orders" replace />

  return (
    <>
      <PageHeader title="Delivery Tracking" backTo={`/buyer/orders/${order.id}`} />

      <div className="tracking-page-container">
        <section className="tracking-details-card">
          <p className="tracking-label">Order ID</p>
          <p className="tracking-value">#{order.id}</p>

          <p className="tracking-label mt-4">Status</p>
          <p className="tracking-value-accent">
            {STATUS_COPY[order.status] ?? order.status}
          </p>

          <p className="tracking-label mt-4">Estimated Delivery</p>
          <p className="tracking-value">
            {longDate(order.deliveryEstimate)} - 2:00 PM
          </p>
        </section>

        <div className="tracking-map-wrapper">
          <DeliveryMap status={order.status} />

          <div className="rider-card">
            <img
              src={RIDER.avatar}
              alt=""
              className="rider-avatar"
            />
            <div className="rider-info">
              <p className="rider-name">{RIDER.name}</p>
              <p className="rider-role">Your rider</p>
            </div>
            <a
              href={`tel:${RIDER.phone}`}
              aria-label={`Call ${RIDER.name}`}
              className="call-rider-btn"
            >
              <Phone className="call-icon" />
            </a>
          </div>
        </div>

        {order.status === 'delivered' && !order.rated ? (
          <div className="tracking-action">
            <LinkButton to={`/buyer/orders/${order.id}/rate`} block>
              Rate your farmer
            </LinkButton>
          </div>
        ) : null}
      </div>
    </>
  )
}