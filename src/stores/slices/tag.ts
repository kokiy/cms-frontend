import type { StateCreator } from 'zustand'

interface TagSlice {
  editingTagId: string | null
  setEditingTagId: (id: string | null) => void
}

const createTagSlice: StateCreator<TagSlice> = (set) => ({
  editingTagId: null,
  setEditingTagId: (id) => set({ editingTagId: id }),
})

export default createTagSlice
export type { TagSlice }
