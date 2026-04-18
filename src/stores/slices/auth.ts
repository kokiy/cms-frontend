import type { StateCreator } from 'zustand'

export interface User {
  id: string
  username: string
  email?: string
}

interface AuthSlice {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  clearAuth: () => void
}

const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  clearAuth: () => set({ token: null, user: null }),
})

export default createAuthSlice
export type { AuthSlice }
