import { Card, Typography, Tag, Space, Spin, Button, Result } from 'antd'
import {
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
  ArrowLeftOutlined,
  ReadOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { postsControllerFindOne } from '@/services'

const { Title, Paragraph, Text } = Typography

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const postQuery = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      if (!id) throw new Error('文章ID不存在')
      const response = await postsControllerFindOne({
        path: { id },
        throwOnError: true,
      })
      return response.data.data
    },
    enabled: !!id,
  })

  if (postQuery.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (postQuery.isError || !postQuery.data) {
    return (
      <Result
        status="404"
        title="文章不存在"
        subTitle="抱歉，您访问的文章不存在或已被删除"
        extra={
          <Button type="primary" onClick={() => navigate('/')} icon={<ArrowLeftOutlined />}>
            返回首页
          </Button>
        }
      />
    )
  }

  const post = postQuery.data

  return (
    <div>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/')}
        style={{ marginBottom: 24 }}
      >
        返回首页
      </Button>

      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div
            style={{ textAlign: 'center', paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}
          >
            <Title level={2} style={{ marginBottom: 16 }}>
              {post.title}
            </Title>
            <Space size="middle" wrap>
              {post.category && (
                <Tag color="blue" icon={<ReadOutlined />}>
                  {post.category.name}
                </Tag>
              )}
              <Text type="secondary">
                <UserOutlined style={{ marginRight: 4 }} />
                {post.author?.username || '匿名'}
              </Text>
              <Text type="secondary">
                <CalendarOutlined style={{ marginRight: 4 }} />
                {dayjs(post.createdAt).format('YYYY年MM月DD日 HH:mm')}
              </Text>
              <Text type="secondary">
                <EyeOutlined style={{ marginRight: 4 }} />
                {post.viewCount} 阅读
              </Text>
            </Space>
          </div>

          <div style={{ padding: '24px 0' }}>
            <Paragraph
              style={{
                fontSize: 16,
                lineHeight: 2,
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
              }}
            >
              {post.content}
            </Paragraph>
          </div>

          <div style={{ paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Space wrap size={[8, 8]}>
              <Text type="secondary">标签：</Text>
              {post.tags?.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    </div>
  )
}
