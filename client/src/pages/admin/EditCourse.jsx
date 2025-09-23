import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Select, Upload, Button, Card, Space, message, Switch } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import AdminLayout from '../../components/Layout/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as courseAPI from '../../services/courses'

const { TextArea } = Input
const { Option } = Select

const EditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [thumbnailFileList, setThumbnailFileList] = useState([])

  const { data: courseData, isLoading } = useQuery(
    ['course-edit', id],
    () => courseAPI.getCourseById(id)
  )

  const updateMutation = useMutation(
    (formData) => courseAPI.updateCourse(id, formData),
    {
      onSuccess: () => {
        message.success('Course updated successfully!')
        queryClient.invalidateQueries('admin-courses')
        navigate('/admin/courses')
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to update course')
      },
    }
  )

  const handleSubmit = (values) => {
    const formData = new FormData()
    
    // Basic course info
    Object.keys(values).forEach(key => {
      if (key !== 'content' && key !== 'mcq' && key !== 'thumbnail') {
        if (key === 'tags' && Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]))
        } else {
          formData.append(key, values[key])
        }
      }
    })

    // Handle content
    if (values.content) {
      values.content.forEach((item, index) => {
        Object.keys(item).forEach(field => {
          if (field === 'file' && item[field]?.[0]?.originFileObj) {
            formData.append(`content[${index}].file`, item[field][0].originFileObj)
          } else if (field !== 'file') {
            formData.append(`content[${index}].${field}`, item[field] || '')
          }
        })
      })
    }

    // Handle MCQ questions
    if (values.mcq) {
      formData.append('mcq', JSON.stringify(values.mcq))
    }

    // Handle thumbnail
    if (thumbnailFileList.length > 0) {
      formData.append('thumbnail', thumbnailFileList[0].originFileObj)
    }

    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!courseData) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Course not found</h2>
        </div>
      </AdminLayout>
    )
  }

  const course = courseData

  // Similar structure to CreateCourse but with populated initial values
  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/courses')}
            >
              Back to Courses
            </Button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
          <p className="text-gray-600 text-lg">
            Update course details and content
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            size="large"
            initialValues={course}
          >
            {/* Same form structure as CreateCourse but with initial values */}
            {/* ... form content ... */}
            
            <Form.Item>
              <Space>
                <Button
                  size="large"
                  onClick={() => navigate('/admin/courses')}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={updateMutation.isLoading}
                >
                  Update Course
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default EditCourse