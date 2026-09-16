import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useOrders } from '@/context/OrderContext'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { cx, money } from '@/lib/utils'

const QUICK = [5000, 10000, 20000]

export function WithdrawPage() {
  const { user } = useAuth()
  const { earnings, availableBalance, withdraw } = useOrders()
  const { state } = useVerification()
  const navigate = useNavigate()

  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const bankName = state.bank.verified ? state.bank.bankName : (user?.bank?.name ?? 'Providus Bank')
  const accountNumber = state.bank.verified
    ? state.bank.accountNumber
    : (user?.bank?.accountNumber ?? '1234567890')

  function submit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value) {
      setError('Enter an amount to withdraw')
      return
    }
    if (value < 1000) {
      setError('The minimum withdrawal is ₦1,000')
      return
    }
    if (value > availableBalance) {
      setError(`You can withdraw up to ${money(availableBalance)}`)
      return
    }
    const record = withdraw(value, bankName)
    navigate('/farmer/earnings/withdraw/success', {
      replace: true,
      state: { withdrawalId: record.id },
    })
  }

  return (
    <form onSubmit={submit} className="withdraw-page page-container">
      <h1 className="page-title">Withdraw Earnings</h1>
      <p className="page-subtitle">Withdraw earnings to your bank account</p>

      <section className="panel">
        <h2 className="panel-title">Available Balance</h2>
        <p className="balance-amount">{money(availableBalance)}</p>
        <div className="balance-grid">
          <div>
            <p className="label-soft">Total Earnings</p>
            <p className="value-bold">{money(earnings.totalEarnings)}</p>
          </div>
          <div>
            <p className="label-soft">Total Withdrawn</p>
            <p className="value-bold">{money(earnings.withdrawn)}</p>
          </div>
        </div>
      </section>

      <div className="field-section">
        <label htmlFor="amount" className="field-label">
          Withdrawal Amount
        </label>
        <div className="amount-input-wrap">
          <span className="amount-prefix">₦</span>
          <input
            id="amount"
            inputMode="numeric"
            placeholder="Enter Amount to withdraw"
            value={amount ? Number(amount).toLocaleString('en-NG') : ''}
            onChange={(e) => {
              setAmount(e.target.value.replace(/\D/g, ''))
              setError('')
            }}
            className={cx('field-box amount-input', error && 'field-box--error')}
          />
        </div>
        {error ? <p className="field-error">{error}</p> : null}

        <div className="quick-grid">
          {QUICK.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setAmount(String(q))
                setError('')
              }}
              className={cx('quick-btn', Number(amount) === q && 'quick-btn--active')}
            >
              ₦ {q.toLocaleString('en-NG')}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setAmount(String(availableBalance))
              setError('')
            }}
            className="quick-btn"
          >
            All
          </button>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="panel-title">Bank Account</h2>
        <div className="bank-card">
          <span className="bank-icon">
            <Lock className="icon-md" />
          </span>
          <div className="min-w-0">
            <p className="bank-name">{bankName}</p>
            <p className="bank-number">**** **** **** {accountNumber.slice(-4)}</p>
          </div>
        </div>
      </section>

      <p className="notice-banner">Withdrawals are processed within 24 hours</p>

      <Button type="submit" block className="mt-6">
        withdraw Now
      </Button>
      <Button variant="ghost" block className="mt-2" onClick={() => navigate('/farmer/earnings')}>
        Back
      </Button>
    </form>
  )
}