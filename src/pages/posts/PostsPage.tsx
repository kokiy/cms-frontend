import { useState } from 'react'
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Form,
  Drawer,
  notification,
  Popconfirm,
  Modal,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  postsControllerFindAllManage,
  postsControllerCreate,
  postsControllerUpdate,
  postsControllerPublish,
  postsControllerUnpublish,
  postsControllerRemove,
  tagsControllerFindAll,
  categoriesControllerFindAll,
  type CreatePostDto,
  type UpdatePostDto,
  type PostResponseDto,
  type CategoryResponseDto,
} from '@/services'

const { Search } = Input

export function PostsPage() {
  const intl = useIntl()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<PostResponseDto | null>(null)
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [isDirty, setIsDirty] = useState(false)
  const [isCloseConfirmOpen, setIsCloseConfirmOpen] = useState(false)

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

  const categoryListQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesControllerFindAll({
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
    mutationFn: async ({ id, data }: { id: string; data: UpdatePostDto }) => {
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
    mutationFn: async (id: string) => {
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

  const unpublishMutation = useMutation({
    mutationFn: async (id: string) => {
      await postsControllerUnpublish({
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
    mutationFn: async (id: string) => {
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
    if (isDirty) {
      setIsCloseConfirmOpen(true)
    } else {
      setEditingPost(null)
      form.resetFields()
      setIsDirty(false)
      setIsDrawerOpen(true)
    }
  }

  const handleEdit = (post: PostResponseDto) => {
    if (post.status === 'PUBLISHED') {
      notification.warning({
        title: '已发布的文章不能编辑',
      })
      return
    }
    if (isDirty) {
      setIsCloseConfirmOpen(true)
    } else {
      setEditingPost(post)
      form.setFieldsValue({
        title: post.title,
        content: post.content,
        tags: post.tags?.map((tag) => tag.id) || [],
        categoryId: post.category ? post.category.id : undefined,
      })
      setIsDirty(false)
      setIsDrawerOpen(true)
    }
  }

  const handleCloseDrawer = () => {
    if (isDirty) {
      setIsCloseConfirmOpen(true)
    } else {
      setIsDrawerOpen(false)
      setEditingPost(null)
      form.resetFields()
    }
  }

  const confirmClose = () => {
    setIsCloseConfirmOpen(false)
    setIsDrawerOpen(false)
    setIsDirty(false)
    setEditingPost(null)
    form.resetFields()
  }

  const cancelClose = () => {
    setIsCloseConfirmOpen(false)
  }

  const handleFormChange = () => {
    setIsDirty(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          title: intl.formatMessage({ id: 'posts.delete.success' }),
        })
      },
    })
  }

  const handlePublish = (id: string) => {
    publishMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          title: intl.formatMessage({ id: 'posts.publish.success' }),
        })
      },
    })
  }

  const handleUnpublish = (id: string) => {
    unpublishMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          title: intl.formatMessage({ id: 'posts.unpublish.success' }),
        })
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      // 将标签 ID 转换为标签名称
      const tagNames = (values.tags || [])
        .map((tagId: any) => {
          const tag = tagListQuery.data?.find((t) => t.id === tagId)
          return tag?.name || ''
        })
        .filter(Boolean)

      const submitData = {
        ...values,
        tags: tagNames,
      }

      if (editingPost) {
        updateMutation.mutate(
          { id: editingPost.id, data: submitData },
          {
            onSuccess: () => {
              notification.success({
                title: intl.formatMessage({ id: 'posts.update.success' }),
              })
              setIsDrawerOpen(false)
              setIsDirty(false)
            },
          },
        )
      } else {
        createMutation.mutate(submitData, {
          onSuccess: () => {
            notification.success({
              title: intl.formatMessage({ id: 'posts.create.success' }),
            })
            setIsDrawerOpen(false)
            setIsDirty(false)
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
      title: intl.formatMessage({ id: 'posts.category' }),
      dataIndex: 'category',
      key: 'category',
      render: (category: CategoryResponseDto | null | undefined) =>
        category ? <Tag color="blue">{category.name}</Tag> : '-',
    },
    {
      title: intl.formatMessage({ id: 'posts.table.status' }),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'}>
          {status === 'PUBLISHED'
            ? intl.formatMessage({ id: 'posts.status.published' })
            : intl.formatMessage({ id: 'posts.status.draft' })}
        </Tag>
      ),
    },
    {
      title: intl.formatMessage({ id: 'posts.table.createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const parsed = dayjs(date)
        return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : '-'
      },
    },
    {
      title: intl.formatMessage({ id: 'posts.table.updatedAt' }),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => {
        const parsed = dayjs(date)
        return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : '-'
      },
    },
    {
      title: intl.formatMessage({ id: 'posts.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: PostResponseDto) => (
        <Space>
          {record.status === 'DRAFT' && (
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              {intl.formatMessage({ id: 'common.edit' })}
            </Button>
          )}
          {record.status === 'DRAFT' && (
            <Popconfirm
              title={intl.formatMessage({ id: 'posts.publish.confirm' })}
              onConfirm={() => handlePublish(record.id)}
              okText={intl.formatMessage({ id: 'common.confirm' })}
              cancelText={intl.formatMessage({ id: 'common.cancel' })}
            >
              <Button type="text" loading={publishMutation.isPending}>
                {intl.formatMessage({ id: 'posts.publish' })}
              </Button>
            </Popconfirm>
          )}
          {record.status === 'PUBLISHED' && (
            <Popconfirm
              title={intl.formatMessage({ id: 'posts.unpublish.confirm' })}
              onConfirm={() => handleUnpublish(record.id)}
              okText={intl.formatMessage({ id: 'common.confirm' })}
              cancelText={intl.formatMessage({ id: 'common.cancel' })}
            >
              <Button type="text" loading={unpublishMutation.isPending}>
                {intl.formatMessage({ id: 'posts.unpublish' })}
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={intl.formatMessage({ id: 'posts.delete.confirm' })}
            onConfirm={() => handleDelete(record.id)}
            okText={intl.formatMessage({ id: 'common.confirm' })}
            cancelText={intl.formatMessage({ id: 'common.cancel' })}
          >
            <Button type="text" danger icon={<DeleteOutlined />} loading={deleteMutation.isPending}>
              {intl.formatMessage({ id: 'common.delete' })}
            </Button>
          </Popconfirm>
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
        onClose={handleCloseDrawer}
        extra={
          <Space>
            <Button onClick={handleCloseDrawer}>
              {intl.formatMessage({ id: 'common.cancel' })}
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={
                createMutation.isPending || updateMutation.isPending || unpublishMutation.isPending
              }
            >
              {intl.formatMessage({ id: 'common.save' })}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onValuesChange={handleFormChange}>
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

          <Form.Item
            name="tags"
            label={intl.formatMessage({ id: 'posts.form.tags' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'posts.form.tags.required' }),
              },
            ]}
          >
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

          <Form.Item
            name="categoryId"
            label={intl.formatMessage({ id: 'posts.category' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'posts.form.category.required' }),
              },
            ]}
          >
            <Select
              placeholder={intl.formatMessage({ id: 'posts.form.tags.placeholder' })}
              style={{ width: '100%' }}
              options={(categoryListQuery.data || []).map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title={intl.formatMessage({ id: 'common.confirm' })}
        open={isCloseConfirmOpen}
        onOk={confirmClose}
        onCancel={cancelClose}
        okText={intl.formatMessage({ id: 'common.confirm' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      >
        <p>{intl.formatMessage({ id: 'posts.unsavedChanges' })}</p>
      </Modal>
    </div>
  )
}
