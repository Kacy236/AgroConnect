import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { StepIndicator } from '@/components/ui/StepIndicator/StepIndicator'
import '../VerificationLayout/VerificationLayout.css'

/**
 * Frame for the verification steps: back control, optional dot rail, and a
 * centred column that widens into two readable columns on desktop.
 */
export function VerificationLayout({
  step,
  title,
  subtitle,
  children,
  footer,
  backTo,
}) {
  const navigate = useNavigate()

  return (
    <div className="verify-layout">
      <div className="verify-layout-top">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Go back"
          className="verify-back"
        >
          <ChevronLeft className="icon-24" />
        </button>
        {step ? <StepIndicator current={step} className="verify-steps" /> : null}
        <span className="verify-spacer" aria-hidden="true" />
      </div>

      <header className="verify-header">
        <h1 className="verify-title">{title}</h1>
        {subtitle ? <p className="verify-subtitle">{subtitle}</p> : null}
      </header>

      <div className="verify-body">{children}</div>

      <div className="verify-footer">{footer}</div>
    </div>
  )
}