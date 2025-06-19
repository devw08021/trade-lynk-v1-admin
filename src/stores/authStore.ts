import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Permission } from '@/types'

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
      // State
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Mock API call - replace with actual implementation
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })
          
          if (!response.ok) throw new Error('Login failed')
          
          const data = await response.json()
          set({
            user: data.user,
            token: data.token,
            permissions: data.permissions,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false,
          })
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          error: null,
        })
      },

      refreshToken: async () => {
        const { token } = get()
        if (!token) return
        
        try {
          const response = await fetch('/api/auth/refresh', {
            headers: { Authorization: `Bearer ${token}` },
          })
          
          if (response.ok) {
            const data = await response.json()
            set({ token: data.token })
          }
        } catch (error) {
          console.error('Token refresh failed:', error)
        }
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get()
        if (user) {
          set({ user: { ...user, ...updates } })
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      hasPermission: (permission: Permission) => {
        const { permissions } = get()
        return permissions?.includes(permission)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
