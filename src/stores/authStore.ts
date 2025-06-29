import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Permission } from '@/types'

// Optional dynamic base URL from .env or fallback
const API_BASE_URL = import.meta.env.VITE_USER_API_URL

// Utility: Safe error message extractor
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    if ('error' in error && typeof (error as any).error?.message === 'string') {
      return (error as any).error.message
    }
  }
  return 'An unknown error occurred.'
}

interface AuthState {
  user: User | null
  token: string | null
  permissions: Permission[]
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  hasPermission: (permission: Permission) => boolean
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          const { data } = await response.json()
          if (!response.ok) {
            throw new Error(getErrorMessage(data))
          }

          const { user, token, permissions } = data
          set({
            user,
            token,
            permissions,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: getErrorMessage(error),
            isLoading: false,
          })
        }
      },

      logout: () =>
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          error: null,
        }),

      refreshToken: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await fetch(`${API_BASE_URL}/refresh`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          const data = await response.json()

          if (!response.ok) {
            console.warn('Token refresh failed:', getErrorMessage(data))
            return
          }

          set({ token: data.token })
        } catch (error) {
          console.error('Token refresh error:', getErrorMessage(error))
        }
      },

      updateUser: updates => {
        const { user } = get()
        if (user) set({ user: { ...user, ...updates } })
      },

      setLoading: loading => set({ isLoading: loading }),
      setError: error => set({ error }),

      hasPermission: permission => get().permissions?.includes(permission),
    }),
    {
      name: 'auth-storage',
      partialize: ({ user, token, permissions, isAuthenticated }) => ({
        user,
        token,
        permissions,
        isAuthenticated,
      }),
    }
  )
)
