import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, CreditCard, Landmark, Loader2, User } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { SelectField } from '@/components/ui/Field/Field'
import { NIGERIAN_BANKS } from '@/data/seed'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './BankVerification.css'

/**
 * Stand-in for a bank name-enquiry call. Derives a stable, plausible account
 * name from the digits so the same number always resolves the same way.
 */
const NAME_POOL = ['Aliu Musa', 'Musa Aliu Ibrahim', 'A. M. Aliu']

function resolveAccountName(accountNumber) {
  const sum = accountNumber.split('').reduce((total, d) => total + Number(d), 0)
  return NAME_POOL[sum % NAME_POOL.length]
}

export function BankVerification() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const form = state.bank

  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')

  const canVerify = Boolean(form.bankName) && /^\d{10}$/.test(form.accountNumber)

  function verify() {
    if (!form.bankName) {
      setError('Select your bank first')
      return
    }
    if (!/^\d{10}$/.test(form.accountNumber)) {
      setError('Enter a valid 10-digit account number')
      return
    }
    setError('')
    setChecking(true)
    window.setTimeout(() => {
      update('bank', { accountName: resolveAccountName(form.accountNumber), verified: true })
      setChecking(false)
    }, 1100)
  }

  function submit() {
    if (!form.verified) {
      setError('Verify your account before continuing')
      return
    }
    update('bank', { done: true })
    navigate('/farmer/verify/security')
  }

  return (
    <VerificationLayout
      title="Verify your Bank Account"
      subtitle="This account will receive your payment"
      backTo="/farmer/verify/farming"
      footer={
        <Button block onClick={submit} disabled={!form.verified}>
          Continue
        </Button>
      }
    >
      <div className="bank-verification">
        <section className="bank-fields">
          <SelectField
            shape="pill"
            label="Bank Name"
            placeholder="Select your Bank"
            options={NIGERIAN_BANKS}
            value={form.bankName}
            onChange={(e) => {
              update('bank', { bankName: e.target.value, verified: false, accountName: '' })
              setError('')
            }}
          />
          <div>
            <label htmlFor="account" className="bank-account-label">
              Account Number
            </label>
            <input
              id="account"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter Account Number"
              value={form.accountNumber}
              onChange={(e) => {
                update('bank', {
                  accountNumber: e.target.value.replace(/\D/g, '').slice(0, 10),
                  verified: false,
                  accountName: '',
                })
                setError('')
              }}
              className={cx('field', error && !form.verified && 'border-red-300')}
            />
            <p className="bank-account-hint">Enter the 10-digit account number</p>
          </div>
        </section>

        {error ? <p className="bank-error">{error}</p> : null}

        <Button block onClick={verify} disabled={!canVerify || checking}>
          {checking ? (
            <>
              <Loader2 className="icon-20 spin" />
              Verifying…
            </>
          ) : (
            <>
              <BadgeCheck className="icon-20" />
              Verify Account
            </>
          )}
        </Button>

        {form.verified ? (
          <section className="bank-verified animate-slide-up">
            <div className="bank-verified-header">
              <span className="bank-verified-icon">
                <BadgeCheck className="icon-20" style={{ color: '#fff' }} />
              </span>
              <div>
                <h2 className="bank-verified-title">Account Verified Successfully</h2>
                <p className="bank-verified-sub">The account details below will recieve your payments.</p>
              </div>
            </div>

            <dl className="bank-verified-rows">
              <Row icon={<User className="icon-20" style={{ color: 'var(--brand-600)' }} />} label="Account Name">
                {form.accountName}
              </Row>
              <Row icon={<Landmark className="icon-20" style={{ color: 'var(--brand-600)' }} />} label="Bank">
                {form.bankName}
              </Row>
              <Row icon={<CreditCard className="icon-20" style={{ color: 'var(--brand-600)' }} />} label="Account Number">
                {form.accountNumber}
              </Row>
            </dl>
          </section>
        ) : null}
      </div>
    </VerificationLayout>
  )
}

function Row({ icon, label, children }) {
  return (
    <div className="bank-row">
      <dt className="bank-row-label">
        {icon}
        {label}
      </dt>
      <dd className="bank-row-value">{children}</dd>
    </div>
  )
}