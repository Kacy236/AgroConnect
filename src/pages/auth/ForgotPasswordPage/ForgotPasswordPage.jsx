import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { useToast } from '@/context/ToastContext'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import { AuthSplit } from '../AuthSplit/AuthSplit'
import './ForgotPasswordPage.css'

export function ForgotPasswordPage() {
  const { notify } = useToast()
  const navigate = useNavigate()

  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    
    // Validate Nigerian phone number format
    if (!/^(\+?234|0)\d{9,10}$/.test(phone.replace(/\s/g, ''))) {
      setError('Enter a valid Nigerian phone number')
      return
    }
    
    setError('')
    notify('OTP sent to your phone number')
    
    // You can update this route to '/verify-otp' once that page is built
    navigate('/login') 
  }

  return (
    <AuthSplit
      image="/img/auth-farm.jpg"
      imageAlt="Two farmers harvesting vegetables on their farm"
      backTo="/login"
      leaves
    >
      <h1 className="forgot-title">Forgot Password?</h1>

      <form onSubmit={submit} noValidate className="forgot-form">
        <TextField
          shape="pill"
          type="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          icon={<Phone className="icon-18" />}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            if (error) setError('')
          }}
          error={error}
          aria-label="Phone number"
        />

        <Button type="submit" block className="forgot-submit">
          Send OTP
        </Button>
      </form>
    </AuthSplit>
  )
}