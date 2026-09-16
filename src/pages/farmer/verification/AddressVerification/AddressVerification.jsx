import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Droplet, Trash2, UploadCloud, Zap } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { UploadBox } from '@/components/ui/UploadBox/UploadBox'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './AddressVerification.css'

const DOC_TYPES = [
  { label: 'Electricity Bill', icon: Zap, tint: '#3BBF4A' },
  { label: 'Water Bill', icon: Droplet, tint: '#3BA9F5' },
  { label: 'Waste Bill', icon: Trash2, tint: 'var(--ink)' },
]

const REQUIREMENTS = [
  'Must contain your full name',
  'Must show your residential address',
  'Bill not older than 3 months',
]

export function AddressVerification() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const form = state.address
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!form.frontName) {
      setError('Upload the front of your utility bill to continue')
      return
    }
    update('address', { done: true })
    navigate('/farmer/verify/farming')
  }

  return (
    <VerificationLayout
      step={4}
      title="Verify your Address"
      backTo="/farmer/verify/identity"
      footer={
        <Button block type="submit" form="address-form">
          Continue
        </Button>
      }
    >
      <form id="address-form" onSubmit={submit} className="address-form">
        <p className="address-lead">Upload a recent utility bill</p>

        <section className="address-requirements">
          <h2 className="address-requirements-title">
            <span className="address-requirements-dot">
              <span className="address-requirements-dot-inner" />
            </span>
            Requirements
          </h2>
          <ul className="address-requirements-list">
            {REQUIREMENTS.map((r) => (
              <li key={r} className="address-requirement-item">
                <BadgeCheck className="icon-18" style={{ color: 'var(--brand-500)', flexShrink: 0 }} />
                {r}
              </li>
            ))}
          </ul>
        </section>

        <fieldset>
          <legend className="address-doctype-legend">Select Document Type</legend>
          <div className="address-doctype-grid">
            {DOC_TYPES.map(({ label, icon: Icon, tint }) => {
              const active = form.documentType === label
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => update('address', { documentType: label })}
                  className={cx('address-doctype', active && 'address-doctype-active')}
                >
                  <Icon className="icon-28" style={{ color: tint }} />
                  <span className="address-doctype-label">{label}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <div>
          <h2 className="address-upload-title">Upload Document</h2>

          <p className="address-upload-label">Front Image</p>
          <UploadBox
            className="address-upload-box"
            tone="green"
            icon={<UploadCloud className="icon-36" style={{ color: 'var(--ink)' }} strokeWidth={1.5} />}
            title="Upload front of bill"
            subtitle="PNG,JPG or PDF (Max 5MB)"
            value={form.frontName}
            onChange={(name) => {
              update('address', { frontName: name })
              if (name) setError('')
            }}
          />
          {error ? <p className="address-error">{error}</p> : null}

          <p className="address-upload-label address-upload-label-optional">
            Back Image <span className="address-optional">(Optional)</span>
          </p>
          <UploadBox
            className="address-upload-box"
            tone="green"
            icon={<UploadCloud className="icon-36" style={{ color: 'var(--ink)' }} strokeWidth={1.5} />}
            title="Upload back (if any)"
            subtitle="PNG,JPG or PDF (Max 5MB)"
            value={form.backName}
            onChange={(name) => update('address', { backName: name })}
          />
        </div>
      </form>
    </VerificationLayout>
  )
}