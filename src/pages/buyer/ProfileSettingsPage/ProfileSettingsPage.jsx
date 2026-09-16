import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import './ProfileSettingsPage.css'

export function ProfileSettingsPage() {
  const { user, updateUser } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [location, setLocation] = useState(user?.location ?? '')
  const [errors, setErrors] = useState({})

  if (!user) return null

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (name.trim().length < 2) next.name = 'Enter your name'
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email address'
    if (phone.replace(/\D/g, '').length < 10) next.phone = 'Enter a valid phone number'
    setErrors(next)
    if (Object.keys(next).length) return

    updateUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), location })
    notify('Profile updated')
    navigate('/buyer/account')
  }

  return (
    <>
      <PageHeader title="Profile Settings" backTo="/buyer/account" />

      <form onSubmit={submit} noValidate className="profile-form">
        <div className="profile-photo-wrap">
          <div className="profile-photo-inner">
            <img src={user.avatar} alt="" className="profile-avatar" />
            <button
              type="button"
              onClick={() => notify('Photo updates are coming soon')}
              aria-label="Change profile photo"
              className="profile-photo-btn"
            >
              <Camera className="icon-xs" />
            </button>
          </div>
        </div>

        <div className="profile-fields">
          <TextField
            shape="pill"
            label={<span className="label-soft">Full Name</span>}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <TextField
            shape="pill"
            type="email"
            label={<span className="label-soft">Email</span>}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />
          <TextField
            shape="pill"
            type="tel"
            label={<span className="label-soft">Phone Number</span>}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
          />
          <TextField
            shape="pill"
            label={<span className="label-soft">Location</span>}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => notify('Notification preferences are coming soon')}
          className="notif-pref-row"
        >
          <span>
            <span className="notif-pref-title">Notification Preference</span>
            <span className="notif-pref-sub">Manage notifications</span>
          </span>
          <svg viewBox="0 0 20 20" className="chevron-icon" aria-hidden="true">
            <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>

        <Button type="submit" block className="mt-7">
          Save Changes
        </Button>
      </form>
    </>
  )
}