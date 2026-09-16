import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import { Toggle } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './SecuritySetup.css'

const RULES = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Include uppercase & lowercase', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'Include numbers', test: (v) => /\d/.test(v) },
]

export function SecuritySetup() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const security = state.security

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pin, setPin] = useState('')
  const [errors, setErrors] = useState({})

  const passwordOk = RULES.every((r) => r.test(password))

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!passwordOk) next.password = 'Your password does not meet all the requirements yet'
    if (confirm !== password) next.confirm = 'Passwords do not match'
    if (!/^\d{4}$/.test(pin)) next.pin = 'Enter a 4-digit pin'
    setErrors(next)
    if (Object.keys(next).length) return

    update('security', { passwordSet: true, pinSet: true, done: true })
    navigate('/farmer/verify/review')
  }

  return (
    <VerificationLayout
      title="Secure your Account"
      subtitle="Set up security to protect your account"
      backTo="/farmer/verify/bank"
      footer={
        <Button block type="submit" form="security-form">
          Complete Setup
        </Button>
      }
    >
      <form id="security-form" onSubmit={submit} noValidate className="security-form">
        <section className="security-fields">
          <TextField
            shape="pill"
            type="password"
            label="Create Password"
            placeholder="Enter Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <ul className="security-rules">
            {RULES.map((rule) => {
              const met = rule.test(password)
              return (
                <li key={rule.label} className={cx('security-rule', met && 'security-rule-met')}>
                  <Check className="icon-16" style={{ color: met ? 'var(--brand-600)' : 'var(--ink-mute)' }} strokeWidth={3} />
                  {rule.label}
                </li>
              )
            })}
          </ul>

          <TextField
            shape="pill"
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={errors.confirm}
          />

          <TextField
            shape="pill"
            type="password"
            inputMode="numeric"
            maxLength={4}
            label="Create Pin"
            placeholder="Enter 4-digit pin"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            error={errors.pin}
          />
        </section>

        <div className="security-2fa-row">
          <div>
            <p className="security-2fa-title">Enable Two-Factor Authentication</p>
            <p className="security-2fa-sub">We&apos;ll send a code to your phone</p>
          </div>
          <Toggle
            checked={security.twoFactor}
            onChange={(v) => update('security', { twoFactor: v })}
            label="Enable two-factor authentication"
          />
        </div>

        {security.twoFactor ? (
          <fieldset className="animate-slide-up">
            <legend className="security-channel-legend">Preferred 2FA Channel</legend>
            <div className="security-channel-grid">
              {['SMS', 'Email'].map((channel) => (
                <label
                  key={channel}
                  className={cx('security-channel', security.channel === channel && 'security-channel-active')}
                >
                  <input
                    type="radio"
                    name="channel"
                    checked={security.channel === channel}
                    onChange={() => update('security', { channel })}
                    className="security-channel-radio"
                  />
                  {channel}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
      </form>
    </VerificationLayout>
  )
}