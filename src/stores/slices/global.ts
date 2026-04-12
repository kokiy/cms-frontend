import type { StateCreator } from 'zustand'
import type { Locale } from '../../locales'

interface GlobalSlice {
  sidebarCollapsed: boolean
  locale: Locale
  setSidebarCollapsed: (collapsed: boolean) => void
  setLocale: (locale: Locale) => void
}

const createGlobalSlice: StateCreator<GlobalSlice> = (set) => ({
  sidebarCollapsed: false,
  locale: 'zh-CN',
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setLocale: (locale) => set({ locale }),
})

export default createGlobalSlice
export type { GlobalSlice }
