import { useState } from 'react'
import { Card, List, Tag, Typography, Pagination, Spin, Empty, Space, Input } from 'antd'
import { CalendarOutlined, EyeOutlined, UserOutlined, ReadOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import {
  postsControllerFindAll,
  categoriesControllerFindAll,
  tagsControllerFindAll,
} from '@/services'
import type { PostResponseDto } from '@/services'

const { Title, Paragraph, Text } = Typography
const { Search } = Input

export function HomePage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedTag, setSelectedTag] = useState<string | undefined>()
  const pageSize = 6

  const postListQuery = useQuery({
    queryKey: ['homePosts', { page, keyword, categoryId: selectedCategory, tagId: selectedTag }],
    queryFn: async () => {
      const response = await postsControllerFindAll({
        query: { page, limit: pageSize, keyword, categoryId: selectedCategory, tagId: selectedTag },
        throwOnError: true,
      })
      return response.data.data
    },
  })

  const categoryListQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesControllerFindAll({ throwOnError: true })
      return response.data.data
    },
  })

  const tagListQuery = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsControllerFindAll({ throwOnError: true })
      return response.data.data
    },
  })

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return content.slice(0, maxLength) + '...'
  }

  const renderPostItem = (post: PostResponseDto) => (
    <List.Item key={post.id} style={{ padding: 0 }}>
      <Card
        hoverable
        style={{ width: '100%', marginBottom: 24 }}
        onClick={() => navigate(`/post/${post.id}`)}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Title level={3} style={{ marginBottom: 8 }}>
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
                {dayjs(post.createdAt).format('YYYY-MM-DD')}
              </Text>
              <Text type="secondary">
                <EyeOutlined style={{ marginRight: 4 }} />
                {post.viewCount} 阅读
              </Text>
            </Space>
          </div>
          <Paragraph style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.8 }}>
            {truncateContent(post.content)}
          </Paragraph>
          <div>
            <Space wrap size={[6, 6]}>
              {post.tags?.map((tag) => (
                <Tag key={tag.id}>{tag.name}</Tag>
              ))}
            </Space>
          </div>
        </Space>
      </Card>
    </List.Item>
  )

  return (
    <div style={{ display: 'flex', gap: 24 }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 24 }}>
          <Search
            placeholder="搜索文章..."
            allowClear
            onSearch={setKeyword}
            onChange={(e) => setKeyword(e.target.value)}
            size="large"
          />
        </div>

        <Spin spinning={postListQuery.isLoading}>
          {postListQuery.data?.items && postListQuery.data.items.length > 0 ? (
            <>
              <List
                dataSource={postListQuery.data.items}
                renderItem={renderPostItem}
                style={{ marginBottom: 32 }}
              />
              <div style={{ textAlign: 'center' }}>
                <Pagination
                  current={page}
                  total={postListQuery.data.total || 0}
                  pageSize={pageSize}
                  onChange={setPage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total) => `共 ${total} 篇文章`}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无文章" />
          )}
        </Spin>
      </div>

      <div style={{ width: 280, flexShrink: 0 }}>
        <Card title="分类" style={{ marginBottom: 16 }} size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Tag
              color={!selectedCategory ? 'blue' : 'default'}
              onClick={() => setSelectedCategory(undefined)}
              style={{ cursor: 'pointer', marginRight: 0 }}
            >
              全部
            </Tag>
            {categoryListQuery.data?.map((category) => (
              <Tag
                key={category.id}
                color={selectedCategory === category.id ? 'blue' : 'default'}
                onClick={() => setSelectedCategory(category.id)}
                style={{ cursor: 'pointer', marginRight: 0 }}
              >
                {category.name}
              </Tag>
            ))}
          </Space>
        </Card>

        <Card title="标签" size="small">
          <Space wrap size={[8, 8]}>
            <Tag
              color={!selectedTag ? 'blue' : 'default'}
              onClick={() => setSelectedTag(undefined)}
              style={{ cursor: 'pointer', margin: 0 }}
            >
              全部
            </Tag>
            {tagListQuery.data?.map((tag) => (
              <Tag
                key={tag.id}
                color={selectedTag === tag.id ? 'blue' : 'default'}
                onClick={() => setSelectedTag(tag.id)}
                style={{ cursor: 'pointer', margin: 0 }}
              >
                {tag.name}
              </Tag>
            ))}
          </Space>
        </Card>
      </div>
    </div>
  )
}
