import { Link } from 'react-router-dom'
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge'
import { Button } from '@/components/ui/Button/Button'
import { longDate, money } from '@/lib/utils'
import './OrderCard.css'

/** Buyer's order-history row. */
export function BuyerOrderCard({ order }) {
  return (
    <li className="order-card">
      <div className="order-card-top">
        <p className="order-card-id">#{order.id}</p>
        <StatusBadge status={order.status} size="sm" />
      </div>
      <p className="order-card-sub">Farmer: {order.farmerName}</p>
      <div className="order-card-row">
        <Link to={`/buyer/orders/${order.id}`} className="order-card-link">
          View Details
        </Link>
        <p className="order-card-total">{money(order.total)}</p>
      </div>
      <p className="order-card-date">{longDate(order.placedAt)}</p>
    </li>
  )
}

/** Farmer's order row — pending orders carry accept / cancel actions. */
export function FarmerOrderCard({ order, onAccept, onCancel }) {
  return (
    <li className="order-card">
      <div className="order-card-top">
        <p className="order-card-id">#{order.id}</p>
        <StatusBadge status={order.status} size="sm" />
      </div>
      <div className="order-card-baseline">
        <p className="order-card-sub order-card-sub-truncate">Buyer: {order.buyerName}</p>
        <p className="order-card-total-inline">{money(order.total)}</p>
      </div>
      <div className="order-card-row order-card-row-farmer">
        <Link to={`/farmer/orders/${order.id}`} className="order-card-link">
          View Details
        </Link>
        <p className="order-card-date-inline">{longDate(order.placedAt)}</p>
      </div>

      {order.status === 'pending' ? (
        <div className="order-card-actions">
          <Button size="md" onClick={onAccept}>
            Accept
          </Button>
          <Button size="md" variant="danger" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : null}
    </li>
  )
}