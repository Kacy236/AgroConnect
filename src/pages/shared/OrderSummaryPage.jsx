import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, MapPin, MessageCircle } from 'lucide-react'
import { useOrders } from '@/context/OrderContext'
import { useToast } from '@/context/ToastContext'
import { StatusBadge } from '@/components/ui/StatusBadge/StatusBadge'
import { Button, LinkButton } from '@/components/ui/Button/Button'
import { OrderTimeline } from '@/components/orders/OrderTimeline/OrderTimeline'
import { longDate, money } from '@/lib/utils'

/** Order detail, shared by both roles — the action row differs by role. */
export function OrderSummaryPage({ role }) {
  const { id = '' } = useParams()
  const { byId, setStatus } = useOrders()
  const { notify } = useToast()
  const navigate = useNavigate()

  const order = byId(id)
  if (!order) return <Navigate to={role === 'farmer' ? '/farmer/orders' : '/buyer/orders'} replace />

  const chatPath = role === 'farmer' ? '/farmer/chats' : '/buyer/chats'

  return (
    <div className="order-summary-page">
      <div className="py-3">
        <button
          type="button"
          onClick={() => navigate(role === 'farmer' ? '/farmer/orders' : '/buyer/orders')}
          aria-label="Go back"
          className="icon-btn"
        >
          <ChevronLeft className="icon-md" />
        </button>
      </div>

      <div className="order-summary-head">
        <h1 className="order-summary-title">ORDER SUMMARY</h1>
        <StatusBadge status={order.status} />
      </div>

      <p className="order-summary-meta">
        #{order.id} · placed {longDate(order.placedAt)}
      </p>

      <ul className="order-lines">
        {order.lines.map((line) => (
          <li key={line.productId} className="order-line">
            <div className="order-line-row">
              <img src={line.image} alt={line.name} className="order-line-img" />
              <div className="min-w-0 flex-1">
                <p className="order-line-name">{line.name}</p>
                <p className="label-soft">
                  {money(line.price)} / {line.unit} × {line.qty}
                </p>
              </div>
              <p className="order-line-total">{money(line.price * line.qty)}</p>
            </div>
          </li>
        ))}
      </ul>

      <dl className="order-totals">
        <div className="order-totals-row">
          <dt>Subtotal</dt>
          <dd className="value-bold">{money(order.subtotal)}</dd>
        </div>
        <div className="order-totals-row">
          <dt>Delivery Fee ({order.lines.length})</dt>
          <dd className="value-bold">{money(order.deliveryFee)}</dd>
        </div>
        <div className="order-totals-row order-totals-row--final">
          <dt className="value-bold">Total</dt>
          <dd className="value-bold">{money(order.total)}</dd>
        </div>
      </dl>

      <section className="panel">
        <h2 className="panel-title panel-title--icon">
          <MapPin className="icon-sm text-brand" />
          Delivery address
        </h2>
        <p className="label-soft mt-1">{order.address}</p>
        <p className="label-soft mt-3">
          {role === 'farmer' ? `Buyer: ${order.buyerName}` : `Farmer: ${order.farmerName}`}
        </p>
      </section>

      <section className="panel">
        <h2 className="panel-title mb-4">Progress</h2>
        <OrderTimeline status={order.status} />
      </section>

      <div className="order-actions">
        {role === 'farmer' ? (
          <>
            {order.status === 'pending' ? (
              <div className="order-actions-grid">
                <Button
                  onClick={() => {
                    setStatus(order.id, 'processing')
                    notify(`Order #${order.id} accepted`)
                  }}
                >
                  Accept
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    setStatus(order.id, 'cancelled')
                    notify(`Order #${order.id} cancelled`, 'error')
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
            {order.status === 'processing' ? (
              <Button
                block
                onClick={() => {
                  setStatus(order.id, 'in-transit')
                  notify('Order marked as out for delivery')
                }}
              >
                Mark as out for delivery
              </Button>
            ) : null}
            {order.status === 'in-transit' ? (
              <Button
                block
                onClick={() => {
                  setStatus(order.id, 'delivered')
                  notify('Order marked delivered — earnings credited')
                }}
              >
                Mark as delivered
              </Button>
            ) : null}
          </>
        ) : (
          <>
            {order.status === 'in-transit' || order.status === 'processing' ? (
              <LinkButton to={`/buyer/track/${order.id}`} block>
                Track this order
              </LinkButton>
            ) : null}
            {order.status === 'delivered' && !order.rated ? (
              <LinkButton to={`/buyer/orders/${order.id}/rate`} variant="outline" block>
                Rate your farmer
              </LinkButton>
            ) : null}
          </>
        )}

        <LinkButton to={chatPath} variant="ghost" block>
          <MessageCircle className="icon-md" />
          {role === 'farmer' ? 'Message buyer' : 'Message farmer'}
        </LinkButton>
      </div>
    </div>
  )
}