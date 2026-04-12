import zhCNCommon from './zh-CN/common'
import zhCNLogin from './zh-CN/login'
import zhCNPosts from './zh-CN/posts'
import zhCNTags from './zh-CN/tags'
import enUSCommon from './en-US/common'
import enUSLogin from './en-US/login'
import enUSPosts from './en-US/posts'
import enUSTags from './en-US/tags'

export type Locale = 'zh-CN' | 'en-US'

export const defaultLocale: Locale = 'zh-CN'

export const locales: { [key in Locale]: string } = {
  'zh-CN': '简体中文',
  'en-US': 'English',
}

export const messages: { [key in Locale]: Record<string, string> } = {
  'zh-CN': {
    ...zhCNCommon,
    ...zhCNLogin,
    ...zhCNPosts,
    ...zhCNTags,
  },
  'en-US': {
    ...enUSCommon,
    ...enUSLogin,
    ...enUSPosts,
    ...enUSTags,
  },
}
