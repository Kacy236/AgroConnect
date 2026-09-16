import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { SelectField, TextField } from '@/components/ui/Field/Field'
import { LGAS, NIGERIAN_STATES } from '@/data/seed'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './ProfileSetup.css'

const METHODS = [
  { value: 'NIN Verification', recommended: true },
  { value: 'International Passport', recommended: false },
  { value: "Driver's License", recommended: false },
]

export function ProfileSetup() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const form = state.profile

  const [errors, setErrors] = useState({})

  function submit(e) {
    e.preventDefault()
    const next = {}
    if (form.fullName.trim().length < 2) next.fullName = 'Enter your full name as it appears on your NIN'
    if (!form.dob) next.dob = 'Select your date of birth'
    if (!form.gender) next.gender = 'Select your gender'
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, '').replace(/^0/, '')))
      next.phone = 'Enter a valid 10-digit number'
    if (form.address.trim().length < 5) next.address = 'Enter your residential address'
    if (!form.state) next.state = 'Select your state'
    if (!form.lga) next.lga = 'Select your LGA'
    setErrors(next)
    if (Object.keys(next).length) return

    update('profile', { done: true })
    navigate('/farmer/verify/identity')
  }

  const lgaOptions = LGAS[form.state] ?? ['Central', 'North', 'South', 'East', 'West']

  return (
    <VerificationLayout
      step={2}
      title="Let's set up your profile"
      subtitle="Your information is safe with us"
      backTo="/farmer"
      footer={
        <Button block type="submit" form="profile-form">
          Continue
        </Button>
      }
    >
      <form id="profile-form" onSubmit={submit} noValidate className="profile-setup-form">
        <TextField
          shape="pill"
          label={
            <>
              Full Name <span className="profile-setup-hint">(as on NIN)</span>
            </>
          }
          placeholder="Enter full Name"
          value={form.fullName}
          onChange={(e) => update('profile', { fullName: e.target.value })}
          error={errors.fullName}
        />

        <div className="profile-setup-grid-2">
          <TextField
            shape="pill"
            type="date"
            label={
              <span className="profile-setup-label-icon">
                Date of Birth <CalendarDays className="icon-16" />
              </span>
            }
            value={form.dob}
            onChange={(e) => update('profile', { dob: e.target.value })}
            error={errors.dob}
          />
          <SelectField
            shape="pill"
            label="Gender"
            placeholder="Select Gender"
            options={['Female', 'Male', 'Prefer not to say']}
            value={form.gender}
            onChange={(e) => update('profile', { gender: e.target.value })}
            error={errors.gender}
          />
        </div>

        <div>
          <label htmlFor="phone" className="profile-setup-field-label">
            Phone Number
          </label>
          <div className="profile-setup-phone-row">
            <span className="profile-setup-country-code">
              <span className="profile-setup-flag" aria-hidden="true">
                <span className="profile-setup-flag-stripe" style={{ background: '#008751' }} />
                <span className="profile-setup-flag-stripe" style={{ background: '#fff' }} />
                <span className="profile-setup-flag-stripe" style={{ background: '#008751' }} />
              </span>
              +234
            </span>
            <div className="profile-setup-phone-input">
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="Enter Phone Number"
                value={form.phone}
                onChange={(e) => update('profile', { phone: e.target.value })}
                className={cx('field', errors.phone && 'border-red-300')}
              />
              {errors.phone ? <p className="profile-setup-error">{errors.phone}</p> : null}
            </div>
          </div>
        </div>

        <TextField
          shape="pill"
          label="Residential Address"
          placeholder="Enter Address"
          value={form.address}
          onChange={(e) => update('profile', { address: e.target.value })}
          error={errors.address}
        />

        <div className="profile-setup-grid-2">
          <SelectField
            shape="pill"
            label="State"
            placeholder="Enter State"
            options={NIGERIAN_STATES}
            value={form.state}
            onChange={(e) => update('profile', { state: e.target.value, lga: '' })}
            error={errors.state}
          />
          <SelectField
            shape="pill"
            label="LGA"
            placeholder="Select LGA"
            options={lgaOptions}
            value={form.lga}
            onChange={(e) => update('profile', { lga: e.target.value })}
            error={errors.lga}
          />
        </div>

        <fieldset>
          <legend className="profile-setup-legend">Verification Method</legend>
          <p className="profile-setup-legend-sub">Choose preferred means of identification</p>
          <div className="profile-setup-methods">
            {METHODS.map((m) => (
              <label
                key={m.value}
                className={cx('profile-setup-method', form.method === m.value && 'profile-setup-method-active')}
              >
                <input
                  type="radio"
                  name="method"
                  checked={form.method === m.value}
                  onChange={() => update('profile', { method: m.value })}
                  className="profile-setup-radio"
                />
                <span className="profile-setup-method-label">{m.value}</span>
                {m.recommended ? <span className="profile-setup-badge">Recommended</span> : null}
              </label>
            ))}
          </div>
        </fieldset>
      </form>
    </VerificationLayout>
  )
}