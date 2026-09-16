import { useLocation, useNavigate } from 'react-router-dom'
import { useOrders } from '@/context/OrderContext'
import { Button } from '@/components/ui/Button/Button'
import { SuccessScreen } from '@/components/ui/SuccessMark/SuccessMark'
import { longDate, money, shortTime } from '@/lib/utils'

export function WithdrawSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { earnings } = useOrders()

  const id = location.state?.withdrawalId
  const record = earnings.withdrawals.find((w) => w.id === id) ?? earnings.withdrawals[0]

  return (
    <SuccessScreen
      title="Withdrawal Sucessful"
      description={<p className="success-description">Your withdrawal request has been submitted.</p>}
      actions={
        <Button block onClick={() => navigate('/farmer/earnings', { replace: true })}>
          Back to Earnings
        </Button>
      }
    >
      {record ? (
        <section className="panel panel--left">
          <h2 className="panel-heading">Withdrawal Details</h2>
          <dl className="detail-list">
            <Row label="Amount">
              <span className="value-brand">{money(record.amount)}</span>
            </Row>
            <Row label="Bank">{record.bank}</Row>
            <Row label="Reference ID">{record.reference}</Row>
            <Row label="Date">
              {longDate(record.date)}-{shortTime(record.date)}
            </Row>
            <Row label="Status">
              <span className="status-pill">{record.status}</span>
            </Row>
          </dl>
        </section>
      ) : null}
    </SuccessScreen>
  )
}

function Row({ label, children }) {
  return (
    <div className="detail-row">
      <dt className="detail-label">{label}</dt>
      <dd className="detail-value">{children}</dd>
    </div>
  )
}