import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeId } from '../themes/themes'

// ---- THEME STORE ----
// Persisted to localStorage so the theme survives page refresh

interface ThemeState {
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      themeId: 'frozen',

      setTheme: (id) => {
        // Apply the CSS variable set immediately
        document.documentElement.setAttribute('data-theme', id)
        set({ themeId: id })
      },
    }),
    {
      name: 'blossom-theme', // localStorage key

      // When the app loads, re-apply the saved theme
      onRehydrateStorage: () => (state) => {
        if (state?.themeId) {
          document.documentElement.setAttribute('data-theme', state.themeId)
        }
      },
    }
  )
)

// ---- AUTH STORE ----
interface User {
  id: number
  email: string
  name: string
  theme: ThemeId
}

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    { name: 'blossom-auth' }
  )
)