import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { cx, uid } from '@/lib/utils'
import './ToastContext.css'

const ToastContext = createContext(null)

const ICONS = { success: CheckCircle2, error: AlertCircle, info: Info }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message, kind = 'success') => {
      const toast = { id: uid('t'), kind, message }
      setToasts((list) => [...list, toast])
      window.setTimeout(() => dismiss(toast.id), 3200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => {
          const Icon = ICONS[t.kind]
          return (
            <div key={t.id} className={cx('toast', `toast-${t.kind}`, 'animate-toast-in')}>
              <Icon className="icon-20" />
              <p className="toast-message">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="toast-dismiss" aria-label="Dismiss notification">
                <X className="icon-16" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}