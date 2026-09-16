import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './Modal.css'

export function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="modal-overlay-wrap">
      <button type="button" aria-label="Close dialog" onClick={onClose} className="modal-backdrop animate-fade-in" />
      <div role="dialog" aria-modal="true" className="modal-panel animate-slide-up">
        <div className="modal-header">
          {title ? <h2 className="modal-title">{title}</h2> : <span />}
          <button type="button" onClick={onClose} className="modal-close" aria-label="Close">
            <X className="icon-20" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer ? <div className="modal-footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  )
}