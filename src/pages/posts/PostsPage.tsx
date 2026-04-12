import { useIntl } from 'react-intl'

export function PostsPage() {
  const intl = useIntl()
  return <div>{intl.formatMessage({ id: 'posts.title' })}</div>
}
