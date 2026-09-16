import { useId, useState } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cx } from '@/lib/utils'
import './Field.css'

export function FieldWrap({ label, hint, error, className, children, htmlFor }) {
  return (
    <div className={cx('field-wrap', className)} data-trace-wrap={htmlFor}>
      {label ? (
        <label htmlFor={htmlFor} className="field-label">
          {label}
        </label>
      ) : null}
      {children}
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

export function TextField({
  label,
  hint,
  error,
  icon,
  wrapClassName,
  shape = 'box',
  className,
  id,
  ...rest
}) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const isPassword = rest.type === 'password'
  const [reveal, setReveal] = useState(false)

  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <div className="field-input-wrap">
        {icon ? <span className="field-icon">{icon}</span> : null}
        <input
          id={fieldId}
          data-trace-input="true"
          {...rest}
          type={isPassword && reveal ? 'text' : rest.type}
          className={cx(
            shape === 'pill' ? 'field' : 'field-box',
            icon && 'field-has-icon',
            isPassword && 'field-has-reveal',
            error && 'border-red-300',
            className,
          )}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            className="field-reveal-btn"
            aria-label={reveal ? 'Hide password' : 'Show password'}
          >
            {reveal ? <Eye className="icon-18" /> : <EyeOff className="icon-18" />}
          </button>
        ) : null}
      </div>
    </FieldWrap>
  )
}

export function SelectField({
  label,
  hint,
  error,
  options,
  placeholder = 'Select',
  wrapClassName,
  shape = 'box',
  className,
  id,
  value,
  ...rest
}) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <div className="field-input-wrap">
        <select
          id={fieldId}
          value={value}
          {...rest}
          className={cx(
            shape === 'pill' ? 'field' : 'field-box',
            'field-select',
            !value && 'field-select-placeholder',
            error && 'border-red-300',
            className,
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="field-select-chevron" />
      </div>
    </FieldWrap>
  )
}

export function TextAreaField({ label, hint, error, wrapClassName, className, id, ...rest }) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldWrap label={label} hint={hint} error={error} className={wrapClassName} htmlFor={fieldId}>
      <textarea id={fieldId} {...rest} className={cx('field-box', 'field-textarea', className)} />
    </FieldWrap>
  )
}