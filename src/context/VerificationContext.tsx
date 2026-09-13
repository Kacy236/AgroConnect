import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { KEYS, load, save } from '@/lib/storage'

export interface VerificationState {
  profile: {
    fullName: string
    dob: string
    gender: string
    phone: string
    address: string
    state: string
    lga: string
    method: string
    done: boolean
  }
  identity: { nin: string; documentName: string; selfieName: string; done: boolean }
  address: {
    documentType: string
    frontName: string
    backName: string
    done: boolean
  }
  farming: { farmType: string; crops: string[]; done: boolean }
  bank: {
    bankName: string
    accountNumber: string
    accountName: string
    verified: boolean
    done: boolean
  }
  security: {
    passwordSet: boolean
    pinSet: boolean
    twoFactor: boolean
    channel: 'SMS' | 'Email'
    done: boolean
  }
  submitted: boolean
}

const initial: VerificationState = {
  profile: {
    fullName: '',
    dob: '',
    gender: '',
    phone: '',
    address: '',
    state: '',
    lga: '',
    method: 'NIN Verification',
    done: false,
  },
  identity: { nin: '', documentName: '', selfieName: '', done: false },
  address: { documentType: 'Electricity Bill', frontName: '', backName: '', done: false },
  farming: { farmType: '', crops: [], done: false },
  bank: { bankName: '', accountNumber: '', accountName: '', verified: false, done: false },
  security: { passwordSet: false, pinSet: false, twoFactor: true, channel: 'SMS', done: false },
  submitted: false,
}

/**
 * Each completed step is worth a share of the overall verification score.
 * `quality` is how much of that share a completed step actually earns — farm
 * details are self-reported, so they top out at 95% and a fully finished
 * profile scores 99 rather than a perfect 100.
 */
const WEIGHTS: Array<{
  key: keyof Omit<VerificationState, 'submitted'>
  label: string
  weight: number
  quality: number
}> = [
  { key: 'profile', label: 'Profile setup', weight: 17, quality: 1 },
  { key: 'identity', label: 'Identity verification', weight: 20, quality: 1 },
  { key: 'address', label: 'Address verification', weight: 17, quality: 1 },
  { key: 'farming', label: 'Farming details', weight: 15, quality: 0.95 },
  { key: 'bank', label: 'Bank account', weight: 16, quality: 1 },
  { key: 'security', label: 'Security setup', weight: 15, quality: 1 },
]

interface VerificationValue {
  state: VerificationState
  score: number
  breakdown: Array<{ label: string; weight: number; done: boolean }>
  completedSteps: number
  totalSteps: number
  update: <K extends keyof Omit<VerificationState, 'submitted'>>(
    step: K,
    patch: Partial<VerificationState[K]>,
  ) => void
  submit: () => void
  reset: () => void
}

const VerificationContext = createContext<VerificationValue | null>(null)

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerificationState>(() => load(KEYS.verification, initial))

  useEffect(() => {
    save(KEYS.verification, state)
  }, [state])

  const update = useCallback(
    <K extends keyof Omit<VerificationState, 'submitted'>>(
      step: K,
      patch: Partial<VerificationState[K]>,
    ) => {
      setState((s) => ({ ...s, [step]: { ...s[step], ...patch } }))
    },
    [],
  )

  const submit = useCallback(() => setState((s) => ({ ...s, submitted: true })), [])
  const reset = useCallback(() => setState(initial), [])

  const breakdown = useMemo(
    () =>
      WEIGHTS.map((w) => ({
        label: w.label,
        weight: w.weight,
        quality: w.quality,
        done: (state[w.key] as { done: boolean }).done,
      })),
    [state],
  )

  const score = useMemo(
    () =>
      Math.round(
        breakdown.reduce((sum, b) => (b.done ? sum + b.weight * b.quality : sum), 0),
      ),
    [breakdown],
  )

  const completedSteps = useMemo(() => breakdown.filter((b) => b.done).length, [breakdown])

  const value = useMemo<VerificationValue>(
    () => ({
      state,
      score,
      breakdown,
      completedSteps,
      totalSteps: WEIGHTS.length,
      update,
      submit,
      reset,
    }),
    [state, score, breakdown, completedSteps, update, submit, reset],
  )

  return <VerificationContext.Provider value={value}>{children}</VerificationContext.Provider>
}

export function useVerification(): VerificationValue {
  const ctx = useContext(VerificationContext)
  if (!ctx) throw new Error('useVerification must be used inside <VerificationProvider>')
  return ctx
}
