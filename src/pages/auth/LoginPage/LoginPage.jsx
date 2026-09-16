import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Phone, Sprout, ShoppingBasket } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import { AuthSplit } from '../AuthSplit/AuthSplit'
import './LoginPage.css'

export function LoginPage() {
  const { login } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [errors, setErrors] = useState({})

  function enter(role, name) {
    login(role)
    notify(`Signed in as ${name}`)
    navigate(role === 'farmer' ? '/farmer' : '/buyer', { replace: true })
  }

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!/^(\+?234|0)\d{9,10}$/.test(phone.replace(/\s/g, '')))
      next.phone = 'Enter a valid Nigerian phone number'
    if (password.length < 6) next.password = 'Use at least 6 characters'
    setErrors(next)
    if (Object.keys(next).length) return

    // Musa's seeded number signs in as the farmer; anything else as the buyer.
    const isFarmer = phone.replace(/\D/g, '').endsWith('7036303238')
    enter(isFarmer ? 'farmer' : 'buyer', isFarmer ? 'Musa' : 'Sarah')
  }

  return (
    <AuthSplit
      image="/img/auth-farm.jpg"
      imageAlt="Two farmers harvesting vegetables on their farm"
      backTo="/welcome"
      leaves
    >
      <h1 className="login-title">Welcome Back!</h1>
      <p className="login-subtitle">Login to Continue</p>

      <form onSubmit={submit} noValidate className="login-form">
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
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          icon={<Lock className="icon-18" />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          aria-label="Password"
        />

        <div className="login-row">
          <label className="login-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="checkbox-round"
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className="link-btn">
            Forgot Password
          </Link>
        </div>

        <Button type="submit" block className="login-submit">
          Login
        </Button>

        <p className="login-signup">
          Don&apos;t have an account?{' '}
          <Link to="/role" className="link-strong">
            Sign Up
          </Link>
        </p>
      </form>

      <div className="login-divider-wrap">
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-text">Or try a demo account</span>
          <span className="login-divider-line" />
        </div>

        <div className="login-demo-grid">
          <Button
            variant="outline"
            size="md"
            aria-label="Log in with the demo farmer account"
            onClick={() => enter('farmer', 'Musa')}
            className="login-demo-btn"
          >
            <Sprout className="icon-20" />
            <span className="text-sm">Login as Farmer</span>
          </Button>
          <Button
            variant="outline"
            size="md"
            aria-label="Log in with the demo buyer account"
            onClick={() => enter('buyer', 'Sarah')}
            className="login-demo-btn"
          >
            <ShoppingBasket className="icon-20" />
            <span className="text-sm">Login as Buyer</span>
          </Button>
        </div>
      </div>
    </AuthSplit>
  )
}