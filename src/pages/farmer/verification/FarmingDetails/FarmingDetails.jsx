import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bird, Fish, Rabbit, Sprout, Trees } from 'lucide-react'
import { useVerification } from '@/context/VerificationContext'
import { Button } from '@/components/ui/Button/Button'
import { ChoiceChip } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import { VerificationLayout } from '../VerificationLayout/VerificationLayout'
import './FarmingDetails.css'

const FARM_TYPES = [
  { label: 'Crop', icon: Sprout, tint: 'brand' },
  { label: 'Livestock', icon: Rabbit, tint: 'ink' },
  { label: 'Fisheries', icon: Fish, tint: 'blue' },
  { label: 'Poultry', icon: Bird, tint: 'brand' },
  { label: 'Mixed', icon: Trees, tint: 'brand' },
]

const CROPS = ['Maize', 'Rice', 'Tomatoes', 'Vegetables', 'Fruits', 'Others']

export function FarmingDetails() {
  const { state, update } = useVerification()
  const navigate = useNavigate()
  const form = state.farming
  const [error, setError] = useState('')

  function toggleCrop(crop) {
    const crops = form.crops.includes(crop)
      ? form.crops.filter((c) => c !== crop)
      : [...form.crops, crop]
    update('farming', { crops })
    if (crops.length) setError('')
  }

  function submit(e) {
    e.preventDefault()
    if (!form.farmType) {
      setError('Select the type of farming you do')
      return
    }
    if (!form.crops.length) {
      setError('Select at least one crop')
      return
    }
    update('farming', { done: true })
    navigate('/farmer/verify/bank')
  }

  return (
    <VerificationLayout
      step={5}
      title="Tell us about your farming"
      subtitle="Help buyers know what you produce"
      backTo="/farmer/verify/address"
      footer={
        <Button block type="submit" form="farming-form">
          Continue
        </Button>
      }
    >
      <form id="farming-form" onSubmit={submit} className="farming-form">
        <fieldset>
          <legend className="farming-legend">Farm Type</legend>
          <div className="farming-type-grid">
            {FARM_TYPES.map(({ label, icon: Icon, tint }) => {
              const active = form.farmType === label
              return (
                <button
                  key={label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    update('farming', { farmType: label })
                    setError('')
                  }}
                  className={cx('farming-type', active && 'farming-type-active')}
                >
                  <span className={cx('farming-type-icon', `farming-type-icon-${tint}`)}>
                    <Icon className="icon-24" />
                  </span>
                  <span className={cx('farming-type-label', active && 'farming-type-label-active')}>
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="farming-legend">
            Crop Details <span className="farming-legend-sub">(Select all that apply)</span>
          </legend>
          <div className="farming-crops">
            {CROPS.map((crop) => (
              <ChoiceChip key={crop} active={form.crops.includes(crop)} onClick={() => toggleCrop(crop)}>
                {crop}
              </ChoiceChip>
            ))}
          </div>
        </fieldset>

        {error ? <p className="farming-error">{error}</p> : null}
      </form>
    </VerificationLayout>
  )
}