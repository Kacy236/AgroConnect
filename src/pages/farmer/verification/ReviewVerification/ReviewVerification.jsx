import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { RadialGauge, scoreCaption } from '@/components/ui/RadialGauge/RadialGauge'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './ReviewVerification.css'

function Tick({ done }) {
  return (
    <svg viewBox="0 0 20 20" className="review-tick" style={{ color: done ? 'var(--brand-600)' : 'var(--ink-line)' }}>
      <path
        fill="currentColor"
        d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"
      />
      <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z" />
    </svg>
  )
}

export function ReviewVerification() {
  const { state, score, submit } = useVerification()
  const { updateUser } = useAuth()
  const navigate = useNavigate()

  const checks = [
    { label: 'NIN Verification', done: state.identity.done },
    { label: 'Farm Verification', done: state.farming.done },
    { label: 'Address Verification', done: state.address.done },
    { label: 'Bank Verification', done: state.bank.done },
  ]

  const scores = [
    { label: 'Identity', value: state.identity.done ? 100 : 0 },
    { label: 'Farm', value: state.farming.done ? 95 : 0 },
    { label: 'Address', value: state.address.done ? 100 : 0 },
    { label: 'Banking', value: state.bank.done ? 100 : 0 },
  ]

  function approve() {
    submit()
    updateUser({ verified: true, verificationScore: score })
    navigate('/farmer/verify/approved', { replace: true })
  }

  return (
    <VerificationLayout
      title="Review Your Verifications"
      subtitle="Please review your details before submission"
      backTo="/farmer/verify/security"
      footer={
        <Button block onClick={approve}>
          Submit for Approval
        </Button>
      }
    >
      <div className="review-verif">
        <ul className="review-checks">
          {checks.map((c) => (
            <li key={c.label} className="review-check-item">
              <span className="review-check-label">{c.label}</span>
              <span className="review-check-status">
                <span className={cx('review-check-text', c.done && 'review-check-text-done')}>
                  {c.done ? 'Verified' : 'Pending'}
                </span>
                <Tick done={c.done} />
              </span>
            </li>
          ))}
        </ul>

        <section>
          <h2 className="review-score-title">Verification Score</h2>
          <div className="review-score-card card">
            <div className="review-score-gauge">
              <RadialGauge value={score} size={160} stroke={12} />
              <p className="review-score-caption">{scoreCaption(score)}</p>
            </div>
            <dl className="review-score-list">
              {scores.map((s) => (
                <div key={s.label} className="review-score-row">
                  <dt className="review-score-label">{s.label}</dt>
                  <dd className="review-score-value">{s.value}%</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </div>
    </VerificationLayout>
  )
}