import type { StateCreator } from 'zustand'
import type { AllState } from './index.d'

interface ModuleImportInterface {
  default: StateCreator<AllState>
}

const modules: Record<string, StateCreator<AllState>> = {}
const viteRequireContext = import.meta.glob<ModuleImportInterface>('./slices/*.ts', {
  eager: true,
})

Object.entries(viteRequireContext).forEach(([path, file]) => {
  const shortName = path.replace('./', '').replace('.ts', '').split('/')[1]
  if (shortName) {
    modules[shortName] = file.default
  }
})

export default modules
