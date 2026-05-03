import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Popconfirm, Space, notification } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  tagsControllerFindAll,
  tagsControllerCreate,
  tagsControllerUpdate,
  tagsControllerRemove,
  type CreateTagDto,
  type UpdateTagDto,
  type TagResponseDto,
} from '@/services'

export function TagsPage() {
  const intl = useIntl()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<TagResponseDto | null>(null)

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
    mutationFn: async (data: CreateTagDto) => {
      await tagsControllerCreate({
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagDto }) => {
      await tagsControllerUpdate({
        path: { id },
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await tagsControllerRemove({
        path: { id },
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const handleAdd = () => {
    setEditingTag(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (tag: TagResponseDto) => {
    setEditingTag(tag)
    form.setFieldsValue({ name: tag.name })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          title: intl.formatMessage({ id: 'tags.delete.success' }),
        })
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingTag) {
        updateMutation.mutate(
          { id: editingTag.id, data: values },
          {
            onSuccess: () => {
              notification.success({
                title: intl.formatMessage({ id: 'tags.update.success' }),
              })
              setIsModalOpen(false)
            },
          },
        )
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              title: intl.formatMessage({ id: 'tags.create.success' }),
            })
            setIsModalOpen(false)
          },
        })
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'tags.table.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'tags.table.createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const parsed = dayjs(date)
        return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : '-'
      },
    },
    {
      title: intl.formatMessage({ id: 'tags.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: TagResponseDto) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'common.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'tags.delete.confirm' })}
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {intl.formatMessage({ id: 'tags.add' })}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tagListQuery.data}
        rowKey="id"
        loading={tagListQuery.isLoading}
      />

      <Modal
        title={
          editingTag
            ? intl.formatMessage({ id: 'tags.edit.title' })
            : intl.formatMessage({ id: 'tags.create.title' })
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'tags.form.name' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'tags.form.name.required' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'tags.form.name.placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
