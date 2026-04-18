import { each } from 'lodash-es'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import storeSlice from './index-slices'
import type { AllState } from './index.d'
import { createSelectors } from './create-selectors'

const useStore = create<AllState>()(
  persist(
    (...params) => {
      let storeSliceMap = {} as AllState
      each(Object.values(storeSlice), (slice) => {
        storeSliceMap = { ...storeSliceMap, ...slice(...params) }
      })
      return storeSliceMap
    },
    {
      name: 'kokiSessionStore',
      storage: createJSONStorage(() => sessionStorage),
      //  skipHydration: true,
      partialize: (state) => ({
        locale: state.locale,
        token: state.token,
      }),
      version: 0,
    },
  ),
)

const storeSelector = createSelectors(useStore) as typeof useStore & {
  use: {
    [K in keyof AllState]: () => AllState[K]
  }
}

export { storeSelector, useStore }
