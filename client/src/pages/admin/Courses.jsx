import React, { useState } from 'react'
import { Table, Button, Card, Space, Modal, message, Tag, Image } from 'antd'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined 
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../components/Layout/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as courseAPI from '../../services/courses'

const AdminCourses = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [deleteModal, setDeleteModal] = useState({ visible: false, course: null })

  const { data: coursesData, isLoading } = useQuery(
    'admin-courses',
    () => courseAPI.getCourses()
  )

  const deleteMutation = useMutation(
    courseAPI.deleteCourse,
    {
      onSuccess: () => {
        message.success('Course deleted successfully')
        queryClient.invalidateQueries('admin-courses')
        setDeleteModal({ visible: false, course: null })
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to delete course')
      },
    }
  )

  const handleDelete = (course) => {
    setDeleteModal({ visible: true, course })
  }

  const confirmDelete = () => {
    if (deleteModal.course) {
      deleteMutation.mutate(deleteModal.course._id)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const courses = coursesData || []

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (_, course) => (
        <div className="flex items-center space-x-3">
          <div className="w-16 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white font-bold">
              {course.title.charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{course.title}</div>
            <div className="text-gray-500 text-sm">{course.slug}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'shortDescription',
      key: 'shortDescription',
      render: (text) => (
        <div className="max-w-xs">
          {text?.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => {
        const colors = {
          beginner: 'green',
          intermediate: 'orange',
          advanced: 'red'
        }
        return <Tag color={colors[difficulty]}>{difficulty}</Tag>
      },
    },
    {
      title: 'Content',
      key: 'content',
      render: (_, course) => (
        <span>{course.content?.length || 0} items</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isPublished',
      key: 'isPublished',
      render: (isPublished) => (
        <Tag color={isPublished ? 'success' : 'default'}>
          {isPublished ? 'Published' : 'Draft'}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, course) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/courses/${course.slug}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(course)}
          />
        </Space>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Course Management</h1>
            <p className="text-gray-600 text-lg">
              Create, edit, and manage your courses
            </p>
          </div>
          
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/admin/courses/new')}
          >
            Create Course
          </Button>
        </motion.div>

        {/* Courses Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <Table
              columns={columns}
              dataSource={courses}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} courses`,
              }}
            />
          </Card>
        </motion.div>

        {/* Delete Modal */}
        <Modal
          title="Delete Course"
          open={deleteModal.visible}
          onOk={confirmDelete}
          onCancel={() => setDeleteModal({ visible: false, course: null })}
          confirmLoading={deleteMutation.isLoading}
          okType="danger"
          okText="Delete"
        >
          <p>
            Are you sure you want to delete the course{' '}
            <strong>"{deleteModal.course?.title}"</strong>?
          </p>
          <p className="text-red-500">
            This action cannot be undone and will affect all enrolled students.
          </p>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default AdminCourses