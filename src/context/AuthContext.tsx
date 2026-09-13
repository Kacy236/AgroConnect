import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Person, Role } from '@/lib/types'
import { BUYER, FARMER } from '@/data/seed'
import { KEYS, load, save } from '@/lib/storage'

interface AuthState {
  user: Person | null
  role: Role | null
  /** Role picked on the onboarding screen, before an account exists. */
  pendingRole: Role
  pendingPhone: string
}

interface AuthValue extends AuthState {
  isAuthed: boolean
  setPendingRole: (role: Role) => void
  setPendingPhone: (phone: string) => void
  login: (role: Role) => Person
  register: (details: { name: string; phone: string; email?: string }) => void
  updateUser: (patch: Partial<Person>) => void
  logout: () => void
}

const initial: AuthState = {
  user: null,
  role: null,
  pendingRole: 'farmer',
  pendingPhone: '07036303238',
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => load(KEYS.auth, initial))

  useEffect(() => {
    save(KEYS.auth, state)
  }, [state])

  const setPendingRole = useCallback((role: Role) => {
    setState((s) => ({ ...s, pendingRole: role }))
  }, [])

  const setPendingPhone = useCallback((phone: string) => {
    setState((s) => ({ ...s, pendingPhone: phone }))
  }, [])

  /** Signs in as the seeded demo account for a role. */
  const login = useCallback((role: Role) => {
    const user = role === 'farmer' ? FARMER : BUYER
    setState((s) => ({ ...s, user, role, pendingRole: role }))
    return user
  }, [])

  /**
   * Registration keeps the seeded catalogue attached to the account so the new
   * user lands in a populated app rather than an empty one.
   */
  const register = useCallback((details: { name: string; phone: string; email?: string }) => {
    setState((s) => {
      const base = s.pendingRole === 'farmer' ? FARMER : BUYER
      const user: Person = {
        ...base,
        name: details.name || base.name,
        phone: details.phone || base.phone,
        email: details.email || base.email,
        ...(s.pendingRole === 'farmer' ? { verified: false, verificationScore: 0 } : {}),
      }
      return { ...s, user, role: s.pendingRole, pendingPhone: details.phone || s.pendingPhone }
    })
  }, [])

  const updateUser = useCallback((patch: Partial<Person>) => {
    setState((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s))
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...initial, pendingRole: s.pendingRole }))
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      ...state,
      isAuthed: Boolean(state.user),
      setPendingRole,
      setPendingPhone,
      login,
      register,
      updateUser,
      logout,
    }),
    [state, setPendingRole, setPendingPhone, login, register, updateUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
