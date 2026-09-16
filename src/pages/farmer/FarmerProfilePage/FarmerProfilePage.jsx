import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  Camera,
  CreditCard,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Sprout,
  Star,
  Trash2,
  User,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { useVerification } from '@/context/VerificationContext'
import { PageHeader } from '@/components/layout/Header/Header'
import { RadialGauge, scoreCaption } from '@/components/ui/RadialGauge/RadialGauge'
import { Button, LinkButton } from '@/components/ui/Button/Button'
import { Modal } from '@/components/ui/Modal/Modal'
import { clearAll } from '@/lib/storage'
import './FarmerProfilePage.css'

function Detail({ icon, label, value }) {
  return (
    <div className="detail-wrapper">
      <span className="detail-icon">{icon}</span>
      <span className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </span>
    </div>
  )
}

export function FarmerProfilePage() {
  const { user, logout } = useAuth()
  const { score, state } = useVerification()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!user) return null

  // Prefer the live verification score once the flow has been completed.
  const displayScore = state.submitted ? score : (user.verificationScore ?? 0)

  const breakdown = [
    { label: 'Identity', value: state.identity.done || user.verified ? 100 : 0 },
    { label: 'Farm', value: state.farming.done || user.verified ? 95 : 0 },
    { label: 'Address', value: state.address.done || user.verified ? 100 : 0 },
    { label: 'Banking', value: state.bank.done || user.verified ? 100 : 0 },
  ]

  function handleLogout() {
    logout()
    navigate('/welcome', { replace: true })
  }

  function handleDelete() {
    clearAll()
    logout()
    navigate('/welcome', { replace: true })
  }

  return (
    <>
      <PageHeader
        title="My Profile"
        backTo="/farmer"
        right={
          <button
            type="button"
            onClick={() => navigate('/farmer/settings')}
            aria-label="Settings"
            className="header-settings-btn"
          >
            <Settings className="settings-icon" />
          </button>
        }
      />

      <div className="profile-container">
        <section className="card profile-header">
          <div className="avatar-wrapper">
            <img
              src={user.avatar}
              alt=""
              className="avatar-img"
            />
            <button
              type="button"
              onClick={() => notify('Photo updates are coming soon')}
              aria-label="Change profile photo"
              className="avatar-edit-btn"
            >
              <Camera className="camera-icon" />
            </button>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            {user.verified ? (
              <p className="profile-verified">
                <svg viewBox="0 0 20 20" className="verified-icon">
                  <path
                    fill="currentColor"
                    d="m10 1.2 1.9 1.5 2.4-.3 1 2.2 2.2 1-.3 2.4L18.8 10l-1.6 1.9.3 2.4-2.2 1-1 2.2-2.4-.3L10 18.8l-1.9-1.6-2.4.3-1-2.2-2.2-1 .3-2.4L1.2 10l1.6-1.9-.3-2.4 2.2-1 1-2.2 2.4.3L10 1.2Z"
                  />
                  <path fill="#fff" d="m8.9 12.7-2.4-2.4 1.1-1.1 1.3 1.3 3.5-3.5 1.1 1.1-4.6 4.6Z" />
                </svg>
                Verified Farmer
              </p>
            ) : (
              <LinkButton to="/farmer/verify/profile" size="sm" variant="outline" className="verify-link-btn">
                Complete verification
              </LinkButton>
            )}
            <div className="profile-badges">
              <span className="badge-plan">
                Free Plan
              </span>
              <span className="badge-rating">
                <Star className="rating-icon" />
                <span className="rating-val">{user.rating ?? 4.8}</span>
                <span className="rating-count">( 128 Reviews)</span>
              </span>
            </div>
          </div>
        </section>

        <section className="card section-card">
          <h2 className="section-title">
            <User className="section-icon" />
            Personal Information
          </h2>
          <div className="info-grid">
            <Detail icon={<User className="detail-lucide-icon" />} label="Full Name" value={user.name} />
            <Detail
              icon={<Mail className="detail-lucide-icon" />}
              label="Email Address"
              value={user.email}
            />
            <Detail
              icon={<Phone className="detail-lucide-icon" />}
              label="Phone Number"
              value={user.phone}
            />
            <Detail
              icon={<MapPin className="detail-lucide-icon" />}
              label="Farm Location"
              value={user.location}
            />
            <Detail
              icon={<Sprout className="detail-lucide-icon" />}
              label="Farm Category"
              value={`${user.farmType ?? 'Mixed'} Farming`}
            />
            <Detail
              icon={<CreditCard className="detail-lucide-icon" />}
              label="Member Since"
              value="15 march 2022"
            />
          </div>
        </section>

        <section>
          <h2 className="section-subtitle">Verification Score</h2>
          <div className="card score-layout">
            <div className="score-gauge-wrapper">
              <RadialGauge value={displayScore} size={160} stroke={12} />
              <p className="score-caption">{scoreCaption(displayScore)}</p>
            </div>
            <dl className="score-breakdown">
              {breakdown.map((b) => (
                <div key={b.label} className="score-item">
                  <dt className="score-label">{b.label}</dt>
                  <dd className="score-value">{b.value}%</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="card actions-card">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="action-btn"
          >
            <Trash2 className="action-icon" />
            <span className="action-text-wrapper">
              <span className="action-title">Delete Account</span>
              <span className="action-desc">
                Permanently delete your account
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="action-btn"
          >
            <LogOut className="action-icon" />
            <span className="action-title-danger">Log Out</span>
          </button>
        </section>

        <LinkButton to="/farmer/featured" variant="outline" block>
          <Building2 className="btn-icon" />
          Choose a Featured Plan
        </LinkButton>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete your account?"
        footer={
          <>
            <Button variant="outline" block size="md" onClick={() => setConfirmDelete(false)}>
              Keep account
            </Button>
            <Button variant="danger" block size="md" onClick={handleDelete}>
              Delete
            </Button>
          </>
        }
      >
        This clears your listings, orders and saved details from this device. It cannot be undone.
      </Modal>
    </>
  )
}