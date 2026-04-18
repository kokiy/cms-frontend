import { useState } from 'react'
import { Table, Button, Input, Select, Space, Tag, Form, Drawer, notification } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  postsControllerFindAllManage,
  postsControllerCreate,
  postsControllerUpdate,
  postsControllerPublish,
  postsControllerRemove,
  tagsControllerFindAll,
  type CreatePostDto,
  type UpdatePostDto,
} from '@/client'

const { Search } = Input

export function PostsPage() {
  const intl = useIntl()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<{ id: number; [key: string]: any } | null>(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)

  const postListQuery = useQuery({
    queryKey: ['posts', { keyword }],
    queryFn: async () => {
      const response = await postsControllerFindAllManage({
        query: { keyword },
        throwOnError: true,
      })
      return response.data.data
    },
  })

  const tagListQuery = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsControllerFindAll({
        throwOnError: true,
      })
      return response.data.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: CreatePostDto) => {
      await postsControllerCreate({
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdatePostDto }) => {
      await postsControllerUpdate({
        path: { id },
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const publishMutation = useMutation({
    mutationFn: async (id: number) => {
      await postsControllerPublish({
        path: { id },
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await postsControllerRemove({
        path: { id },
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleAdd = () => {
    setEditingPost(null)
    form.resetFields()
    setIsDrawerOpen(true)
  }

  const handleEdit = (post: { id: number; [key: string]: any }) => {
    setEditingPost(post)
    form.setFieldsValue({
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      categoryId: post.categoryId,
    })
    setIsDrawerOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          message: intl.formatMessage({ id: 'posts.delete.success' }),
        })
      },
    })
  }

  const handlePublish = (id: number) => {
    publishMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          message: intl.formatMessage({ id: 'posts.publish.success' }),
        })
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingPost) {
        updateMutation.mutate(
          { id: editingPost.id, data: values },
          {
            onSuccess: () => {
              notification.success({
                message: intl.formatMessage({ id: 'posts.update.success' }),
              })
              setIsDrawerOpen(false)
            },
          },
        )
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              message: intl.formatMessage({ id: 'posts.create.success' }),
            })
            setIsDrawerOpen(false)
          },
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'posts.table.title' }),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: intl.formatMessage({ id: 'posts.table.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published'
            ? intl.formatMessage({ id: 'posts.status.published' })
            : intl.formatMessage({ id: 'posts.status.draft' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'posts.table.createdAt' }),
      dataIndex: 'created_at',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: intl.formatMessage({ id: 'posts.table.actions' }),
      key: 'actions',
      render: (_: any, record: { id: number; status: string; [key: string]: any }) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'common.edit' })}
          </Button>
          {record.status === 'draft' && (
            <Button
              type="text"
              onClick={() => handlePublish(record.id)}
              loading={publishMutation.isPending}
            >
              {intl.formatMessage({ id: 'posts.publish' })}
            </Button>
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={deleteMutation.isPending}
          >
            {intl.formatMessage({ id: 'common.delete' })}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, justifyContent: 'space-between' }}>
        <Space>
          <Search
            placeholder={intl.formatMessage({ id: 'posts.search.placeholder' })}
            onSearch={setKeyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {intl.formatMessage({ id: 'posts.add' })}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={postListQuery.data?.items}
        rowKey="id"
        loading={postListQuery.isLoading}
        pagination={{
          current: page,
          total: postListQuery.data?.total || 0,
          pageSize: 10,
          onChange: (newPage) => setPage(newPage),
        }}
      />

      <Drawer
        title={
          editingPost
            ? intl.formatMessage({ id: 'posts.edit.title' })
            : intl.formatMessage({ id: 'posts.create.title' })
        }
        size={'80vw'}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        extra={
          <Space>
            <Button onClick={() => setIsDrawerOpen(false)}>
              {intl.formatMessage({ id: 'common.cancel' })}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {intl.formatMessage({ id: 'common.save' })}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label={intl.formatMessage({ id: 'posts.form.title' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'posts.form.title.required' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'posts.form.title.placeholder' })} />
          </Form.Item>

          <Form.Item
            name="content"
            label={intl.formatMessage({ id: 'posts.form.content' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'posts.form.content.required' }),
              },
            ]}
          >
            <Input.TextArea
              rows={15}
              placeholder={intl.formatMessage({ id: 'posts.form.content.placeholder' })}
            />
          </Form.Item>

          <Form.Item name="tags" label={intl.formatMessage({ id: 'posts.form.tags' })}>
            <Select
              mode="multiple"
              placeholder={intl.formatMessage({ id: 'posts.form.tags.placeholder' })}
              style={{ width: '100%' }}
              options={(tagListQuery.data || []).map((tag) => ({
                value: tag.id,
                label: tag.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}
