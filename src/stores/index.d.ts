import type { AuthSlice } from './slices/auth'
import type { GlobalSlice } from './slices/global'
import type { PostSlice } from './slices/post'
import type { TagSlice } from './slices/tag'

export type AllState = AuthSlice & GlobalSlice & PostSlice & TagSlice
