import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button/Button'
import { cx } from '@/lib/utils'
import { AuthSplit } from '../AuthSplit/AuthSplit'
import './OTPPage.css'

const LENGTH = 6
const RESEND_SECONDS = 45

export function OTPPage() {
  const { pendingPhone, pendingRole, register } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const details = location.state ?? {}

  const [digits, setDigits] = useState(Array(LENGTH).fill(''))
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [error, setError] = useState('')
  const inputs = useRef([])

  useEffect(() => {
    if (seconds <= 0) return
    const id = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearInterval(id)
  }, [seconds])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  /**
   * Accepts more than one character per box so fast typing, autofill and
   * pasted codes spill into the following inputs instead of being dropped.
   */
  function setDigit(index, value) {
    const chars = value.replace(/\D/g, '')
    setError('')

    if (!chars) {
      setDigits((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    setDigits((prev) => {
      const next = [...prev]
      // A box that already held a digit keeps its position; the rest spill on.
      const incoming = chars.length > 1 && prev[index] === chars[0] ? chars.slice(1) : chars
      for (let i = 0; i < incoming.length && index + i < LENGTH; i += 1) {
        next[index + i] = incoming[i]
      }
      return next
    })

    const landed = Math.min(index + chars.length, LENGTH) - 1
    inputs.current[Math.min(landed + 1, LENGTH - 1)]?.focus()
  }

  function onKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowLeft' && index > 0) inputs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < LENGTH - 1) inputs.current[index + 1]?.focus()
  }

  function onPaste(e) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!text) return
    e.preventDefault()
    const next = Array(LENGTH).fill('')
    text.split('').forEach((c, i) => (next[i] = c))
    setDigits(next)
    inputs.current[Math.min(text.length, LENGTH - 1)]?.focus()
  }

  function verify(e) {
    e.preventDefault()
    if (digits.some((d) => !d)) {
      setError('Enter all 6 digits to continue')
      return
    }
    register({
      name: details.name ?? '',
      phone: details.phone ?? pendingPhone,
      email: details.email,
    })
    navigate('/account-created', { replace: true })
  }

  function resend() {
    setSeconds(RESEND_SECONDS)
    setDigits(Array(LENGTH).fill(''))
    inputs.current[0]?.focus()
    notify('A new code has been sent to your phone')
  }

  const phone = details.phone || pendingPhone

  return (
    <AuthSplit
      image={pendingRole === 'farmer' ? '/img/auth-farm.jpg' : '/img/auth-handoff.jpg'}
      imageAlt="Farmers standing between rows of leafy vegetables"
      backTo="/register"
    >
      <div className="otp-header">
        <span className="otp-icon-wrap">
          <ShieldCheck className="icon-28" style={{ color: 'var(--brand-600)' }} />
        </span>
        <h1 className="otp-title">OTP Verification</h1>
        <p className="otp-lead">Enter the 6-digit code sent to</p>
        <p className="otp-phone">{phone}</p>
      </div>

      <form onSubmit={verify} className="otp-form">
        <div className="otp-digits" onPaste={onPaste}>
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el
              }}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              inputMode="numeric"
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              aria-label={`Digit ${i + 1}`}
              className={cx('otp-digit', error && 'otp-digit-error')}
            />
          ))}
        </div>

        {error ? <p className="otp-error">{error}</p> : null}

        <p className="otp-resend">
          Didn&apos;t receive code?{' '}
          {seconds > 0 ? (
            <>
              <span className="otp-resend-strong">Resend OTP</span>{' '}
              <span className="otp-resend-timer">(00:{String(seconds).padStart(2, '0')})</span>
            </>
          ) : (
            <button type="button" onClick={resend} className="otp-resend-btn">
              Resend OTP
            </button>
          )}
        </p>

        <Button type="submit" block className="otp-submit">
          Verify
        </Button>
      </form>

      <img src="/img/otp-phone.png" alt="" aria-hidden="true" className="otp-art" />
    </AuthSplit>
  )
}