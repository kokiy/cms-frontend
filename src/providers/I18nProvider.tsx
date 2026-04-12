import { IntlProvider } from 'react-intl'
import { storeSelector } from '../stores'
import { messages, defaultLocale } from '../locales'

interface I18nProviderProps {
  children: React.ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const locale = storeSelector.use.locale()

  return (
    <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  )
}
