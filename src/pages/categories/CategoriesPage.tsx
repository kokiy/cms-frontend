import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Popconfirm, Space, notification } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useIntl } from 'react-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import {
  categoriesControllerFindAll,
  categoriesControllerCreate,
  categoriesControllerUpdate,
  categoriesControllerRemove,
  type CreateCategoryDto,
  type UpdateCategoryDto,
  type CategoryResponseDto,
} from '@/services'

export function CategoriesPage() {
  const intl = useIntl()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null)

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
    mutationFn: async (data: CreateCategoryDto) => {
      await categoriesControllerCreate({
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryDto }) => {
      await categoriesControllerUpdate({
        path: { id },
        body: data,
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await categoriesControllerRemove({
        path: { id },
        throwOnError: true,
      })
      return null
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const handleAdd = () => {
    setEditingCategory(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (category: CategoryResponseDto) => {
    setEditingCategory(category)
    form.setFieldsValue({ name: category.name })
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          title: intl.formatMessage({ id: 'categories.delete.success' }),
        })
      },
    })
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingCategory) {
        updateMutation.mutate(
          { id: editingCategory.id, data: values },
          {
            onSuccess: () => {
              notification.success({
                title: intl.formatMessage({ id: 'categories.update.success' }),
              })
              setIsModalOpen(false)
            },
          },
        )
      } else {
        createMutation.mutate(values, {
          onSuccess: () => {
            notification.success({
              title: intl.formatMessage({ id: 'categories.create.success' }),
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
      title: intl.formatMessage({ id: 'categories.table.name' }),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: intl.formatMessage({ id: 'categories.table.createdAt' }),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => {
        const parsed = dayjs(date)
        return parsed.isValid() ? parsed.format('YYYY-MM-DD HH:mm:ss') : '-'
      },
    },
    {
      title: intl.formatMessage({ id: 'categories.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: CategoryResponseDto) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            {intl.formatMessage({ id: 'common.edit' })}
          </Button>
          <Popconfirm
            title={intl.formatMessage({ id: 'categories.delete.confirm' })}
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
          {intl.formatMessage({ id: 'categories.add' })}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categoryListQuery.data}
        rowKey="id"
        loading={categoryListQuery.isLoading}
      />

      <Modal
        title={
          editingCategory
            ? intl.formatMessage({ id: 'categories.edit.title' })
            : intl.formatMessage({ id: 'categories.create.title' })
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label={intl.formatMessage({ id: 'categories.form.name' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'categories.form.name.required' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'categories.form.name.placeholder' })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
