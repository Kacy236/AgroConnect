import { useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { cx } from '@/lib/utils'
import './UploadBox.css'

const MAX_BYTES = 5 * 1024 * 1024

export function UploadBox({
  title,
  subtitle,
  icon,
  value,
  onChange,
  accept = 'image/png,image/jpeg,application/pdf',
  tone = 'grey',
  className,
}) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  function handleFile(file) {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setError('That file is larger than 5MB. Please choose a smaller one.')
      return
    }
    setError('')
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        const url = String(reader.result)
        setPreview(url)
        onChange(file.name, url)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview('')
      onChange(file.name)
    }
  }

  function clear() {
    setPreview('')
    setError('')
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const filled = Boolean(value)

  return (
    <div className={className}>
      <div
        className={cx('upload-box', tone === 'green' ? 'upload-box-green' : 'upload-box-grey', filled && 'upload-box-filled')}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files[0])
        }}
      >
        {filled ? (
          <>
            <button type="button" onClick={clear} className="upload-box-remove" aria-label="Remove file">
              <X className="icon-16" />
            </button>
            {preview ? (
              <img src={preview} alt="" className="upload-box-preview" />
            ) : (
              <CheckCircle2 className="icon-32" style={{ color: 'var(--brand-600)' }} />
            )}
            <p className="upload-box-filename">{value}</p>
            <button type="button" onClick={() => inputRef.current?.click()} className="upload-box-replace">
              Replace file
            </button>
          </>
        ) : (
          <button type="button" onClick={() => inputRef.current?.click()} className="upload-box-trigger">
            {icon}
            <span className="upload-box-title">{title}</span>
            {subtitle ? <span className="upload-box-subtitle">{subtitle}</span> : null}
          </button>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      {error ? <p className="upload-box-error">{error}</p> : null}
    </div>
  )
}