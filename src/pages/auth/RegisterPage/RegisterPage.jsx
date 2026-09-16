import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import { cx } from '@/lib/utils'
import { AuthSplit } from '../AuthSplit/AuthSplit'
import './RegisterPage.css'

export function RegisterPage() {
  const { pendingRole, setPendingPhone } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const next = {}
    if (name.trim().length < 2) next.name = 'Enter your name'
    if (!/^(\+?234|0)\d{9,10}$/.test(phone.replace(/\s/g, '')))
      next.phone = 'Enter a valid Nigerian phone number'
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address'
    if (password.length < 6) next.password = 'Use at least 6 characters'
    if (confirm !== password) next.confirm = 'Passwords do not match'
    if (!agreed) next.terms = 'Please accept the terms to continue'
    return next
  }

  function submit(e) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    setPendingPhone(phone)
    navigate('/otp', { state: { name, phone, email } })
  }

  return (
    <AuthSplit
      image={pendingRole === 'farmer' ? '/img/auth-farm.jpg' : '/img/auth-handoff.jpg'}
      imageAlt={
        pendingRole === 'farmer'
          ? 'Farmers standing between rows of leafy vegetables'
          : 'A buyer receiving fresh greens from a farmer at a market stall'
      }
      backTo="/role"
    >
      <div className="register-header">
        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Fill in your details to get started</p>
      </div>

      <form onSubmit={submit} noValidate className="register-form">
        <TextField
          shape="pill"
          placeholder="User Name"
          autoComplete="name"
          icon={<User className="icon-18" />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          aria-label="User name"
        />
        <TextField
          shape="pill"
          type="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          icon={<Phone className="icon-18" />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
          aria-label="Phone number"
        />
        <TextField
          shape="pill"
          type="email"
          placeholder="Email (optional)"
          autoComplete="email"
          icon={<Mail className="icon-18" />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          aria-label="Email"
        />
        <TextField
          shape="pill"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          icon={<Lock className="icon-18" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          aria-label="Password"
        />
        <TextField
          shape="pill"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          icon={<Lock className="icon-18" />}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
          aria-label="Confirm password"
        />

        <div>
          <label className="register-terms">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className={cx('register-terms-checkbox', errors.terms && 'register-terms-checkbox-error')}
            />
            <span>
              I agree to the <span className="register-terms-link">Terms and Conditions</span>
            </span>
          </label>
          {errors.terms ? <p className="register-error">{errors.terms}</p> : null}
        </div>

        <Button type="submit" block className="register-submit">
          Create Account
        </Button>

        <p className="register-login">
          Already have an account?{' '}
          <Link to="/login" className="link-strong">
            Login
          </Link>
        </p>
      </form>
    </AuthSplit>
  )
}