import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { Button, LinkButton } from '@/components/ui/Button/Button'
import { SuccessScreen } from '@/components/ui/SuccessMark/SuccessMark'
import { longDate } from '@/lib/utils'
import './OrderPlacedPage.css'

export function OrderPlacedPage() {
  const { id = '' } = useParams()
  const { byId } = useOrders()
  const { user } = useAuth()
  const navigate = useNavigate()

  const order = byId(id)
  const firstName = user?.name.split(' ')[0] ?? 'Serah'

  return (
    <SuccessScreen
      title="Order Placed!"
      description={<p>Thank you {firstName}. Your order has been recieved</p>}
      actions={
        <div className="order-actions-wrap">
          {order ? (
            <LinkButton to={`/buyer/track/${order.id}`} block>
              Track this order
            </LinkButton>
          ) : null}
          <Button
            variant="ghost"
            block
            onClick={() => navigate('/buyer', { replace: true })}
            className="order-back-btn"
          >
            Back to Home
          </Button>
        </div>
      }
    >
      {order ? (
        <div className="order-summary-card">
          <div className="order-summary-row-bordered">
            <p className="order-summary-label">Order ID</p>
            <p className="order-summary-value-bold">#{order.id}</p>
          </div>
          <div className="order-summary-row">
            <p className="order-summary-label">Delivery</p>
            <p className="order-summary-value-medium">
              {longDate(order.deliveryEstimate)}{' '}
              <span className="order-summary-hint">(2-3 days)</span>
            </p>
          </div>
        </div>
      ) : null}
    </SuccessScreen>
  )
}