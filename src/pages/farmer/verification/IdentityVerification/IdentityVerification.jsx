import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Camera, FilePlus2, User } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { TextField } from '@/components/ui/Field/Field'
import { UploadBox } from '@/components/ui/UploadBox/UploadBox'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './IdentityVerification.css'

export function IdentityVerification() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const form = state.identity
  const [errors, setErrors] = useState({})

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (!/^\d{11}$/.test(form.nin.replace(/\D/g, ''))) next.nin = 'Enter your 11-digit NIN'
    if (!form.documentName) next.document = 'Upload a photo of your ID document'
    if (!form.selfieName) next.selfie = 'Add a selfie so we can match it to your ID'
    setErrors(next)
    if (Object.keys(next).length) return

    update('identity', { done: true })
    navigate('/farmer/verify/address')
  }

  return (
    <VerificationLayout
      step={3}
      title="Verify Your Identity"
      subtitle="Enter your identity details and take a selfie"
      backTo="/farmer/verify/profile"
      footer={
        <Button block type="submit" form="identity-form">
          Next
        </Button>
      }
    >
      <form id="identity-form" onSubmit={submit} noValidate className="identity-form">
        <TextField
          shape="pill"
          label="Identity Number"
          placeholder="Enter 11-digit NIN"
          inputMode="numeric"
          maxLength={11}
          value={form.nin}
          onChange={(e) => update('identity', { nin: e.target.value.replace(/\D/g, '') })}
          error={errors.nin}
        />

        <div>
          <h2 className="identity-section-title">Upload identity Documents</h2>
          <p className="identity-section-sub">National ID, Voters Card or International Passport</p>
          <UploadBox
            className="identity-upload"
            icon={<FilePlus2 className="icon-24" style={{ color: 'var(--brand-600)' }} />}
            title="Tap to Upload"
            subtitle="PNG,JPG or PDF (Max 5MB)"
            value={form.documentName}
            onChange={(name) => update('identity', { documentName: name })}
          />
          {errors.document ? <p className="identity-error">{errors.document}</p> : null}
        </div>

        <div>
          <h2 className="identity-section-title">Take a selfie</h2>
          <p className="identity-section-sub">Take a clear selfie of yourself</p>
          <UploadBox
            className="identity-upload"
            accept="image/*"
            icon={
              <span className="identity-selfie-icon">
                <span className="identity-selfie-avatar">
                  <User className="icon-24" style={{ color: 'var(--ink-mute)' }} />
                </span>
                <span className="identity-selfie-badge">
                  <Camera className="icon-16" style={{ color: '#fff' }} />
                </span>
              </span>
            }
            title="Tap to capture profile"
            value={form.selfieName}
            onChange={(name) => update('identity', { selfieName: name })}
          />
          {errors.selfie ? <p className="identity-error">{errors.selfie}</p> : null}
        </div>

        <section className="identity-how">
          <h3 className="identity-how-title">How it works</h3>
          <ul className="identity-how-list">
            <li>we&apos;ll compare your ID photo with selfie</li>
            <li>Make sure your face is clearly visible</li>
          </ul>
        </section>
      </form>
    </VerificationLayout>
  )
}