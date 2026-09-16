import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Logo } from '@/components/ui/Bits/Bits'
import './SplashPage.css'

/** Brand splash. Returning users skip straight to their dashboard. */
export function SplashPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (user) navigate(user.role === 'farmer' ? '/farmer' : '/buyer', { replace: true })
      else navigate('/welcome', { replace: true })
    }, 2100)
    return () => window.clearTimeout(id)
  }, [navigate, user])

  return (
    <button
      type="button"
      onClick={() => navigate(user ? (user.role === 'farmer' ? '/farmer' : '/buyer') : '/welcome', { replace: true })}
      className="splash"
      aria-label="Continue to AgroConnect"
    >
      <img src="/img/splash-field.jpg" alt="" className="splash-bg" />
      <span className="splash-overlay" />

      <div className="splash-content animate-fade-in">
        <Logo variant="white" className="splash-logo" />
        <p className="splash-tagline">Connecting Farmers Directly to Buyers........</p>
        <span className="splash-dots" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className="splash-dot" style={{ animationDelay: `${i * 180}ms` }} />
          ))}
        </span>
      </div>
      <h1 className="sr-only">AgroConnect — connecting farmers directly to buyers</h1>
    </button>
  )
}