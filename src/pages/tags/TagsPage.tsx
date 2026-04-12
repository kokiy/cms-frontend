import { useIntl } from 'react-intl'

export function TagsPage() {
  const intl = useIntl()
  return <div>{intl.formatMessage({ id: 'tags.title' })}</div>
}
