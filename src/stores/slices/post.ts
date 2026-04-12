import type { StateCreator } from 'zustand'

interface PostSlice {
  draftId: string | null
  hasUnsavedChanges: boolean
  setDraftId: (id: string | null) => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  clearDraft: () => void
}

const createPostSlice: StateCreator<PostSlice> = (set) => ({
  draftId: null,
  hasUnsavedChanges: false,
  setDraftId: (id) => set({ draftId: id }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
  clearDraft: () =>
    set({
      draftId: null,
      hasUnsavedChanges: false,
    }),
})

export default createPostSlice
export type { PostSlice }
