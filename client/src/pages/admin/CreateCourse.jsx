import React, { useState } from 'react'
import { Form, Input, Select, Upload, Button, Card, Space, message, Switch } from 'antd'
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../components/Layout/AdminLayout'
import * as courseAPI from '../../services/courses'

const { TextArea } = Input
const { Option } = Select

const CreateCourse = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [thumbnailFileList, setThumbnailFileList] = useState([])

  const createMutation = useMutation(
    courseAPI.createCourse,
    {
      onSuccess: () => {
        message.success('Course created successfully!')
        navigate('/admin/courses')
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to create course')
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

    createMutation.mutate(formData)
  }

  const thumbnailUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('You can only upload image files!')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error('Image must smaller than 2MB!')
        return false
      }
      return false
    },
    onChange: ({ fileList }) => {
      setThumbnailFileList(fileList.slice(-1))
    },
    fileList: thumbnailFileList,
  }

  const contentUploadProps = {
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf'
      const isVideo = file.type.startsWith('video/')
      if (!isPDF && !isVideo) {
        message.error('You can only upload PDF or video files!')
        return false
      }
      const isLt100M = file.size / 1024 / 1024 < 100
      if (!isLt100M) {
        message.error('File must smaller than 100MB!')
        return false
      }
      return false
    },
  }

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
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-gray-600 text-lg">
            Fill in the details to create a new course for your students
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
            initialValues={{
              difficulty: 'beginner',
              isPublished: false,
              estimatedDuration: '4-6 hours',
            }}
          >
            <Card title="Basic Information" className="mb-6">
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input placeholder="Enter course title" />
              </Form.Item>

              <Form.Item
                name="shortDescription"
                label="Short Description"
                rules={[{ required: true, message: 'Please enter short description' }]}
              >
                <Input placeholder="Brief description for course cards" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Detailed Description"
                rules={[{ required: true, message: 'Please enter detailed description' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Comprehensive description of the course content and objectives"
                />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="difficulty"
                  label="Difficulty Level"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select difficulty">
                    <Option value="beginner">Beginner</Option>
                    <Option value="intermediate">Intermediate</Option>
                    <Option value="advanced">Advanced</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="estimatedDuration"
                  label="Estimated Duration"
                  rules={[{ required: true, message: 'Please enter estimated duration' }]}
                >
                  <Input placeholder="e.g., 4-6 hours" />
                </Form.Item>
              </div>

              <Form.Item
                name="tags"
                label="Tags"
              >
                <Select
                  mode="tags"
                  placeholder="Add tags (press enter to add)"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              <Form.Item
                name="thumbnail"
                label="Course Thumbnail"
              >
                <Upload {...thumbnailUploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                name="isPublished"
                label="Publish Course"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Card>

            <Card title="Course Content" className="mb-6">
              <Form.List name="content">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        title={`Content Item ${name + 1}`}
                        extra={
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          />
                        }
                        className="mb-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Form.Item
                            {...restField}
                            name={[name, 'title']}
                            label="Title"
                            rules={[{ required: true, message: 'Content title is required' }]}
                          >
                            <Input placeholder="Content title" />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="Type"
                            rules={[{ required: true, message: 'Content type is required' }]}
                          >
                            <Select placeholder="Select type">
                              <Option value="video">Video Upload</Option>
                              <Option value="pdf">PDF Upload</Option>
                              <Option value="youtube">YouTube Link</Option>
                              <Option value="text">Text Content</Option>
                            </Select>
                          </Form.Item>
                        </div>

                        <Form.Item
                          {...restField}
                          name={[name, 'description']}
                          label="Description"
                        >
                          <Input placeholder="Brief description" />
                        </Form.Item>

                        <Form.Item
                          noStyle
                          shouldUpdate={(prevValues, currentValues) =>
                            prevValues.content?.[name]?.type !== currentValues.content?.[name]?.type
                          }
                        >
                          {({ getFieldValue }) => {
                            const type = getFieldValue(['content', name, 'type'])
                            
                            if (type === 'youtube') {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, 'url']}
                                  label="YouTube URL"
                                  rules={[{ required: true, message: 'YouTube URL is required' }]}
                                >
                                  <Input placeholder="https://www.youtube.com/watch?v=..." />
                                </Form.Item>
                              )
                            }
                            
                            if (type === 'text') {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, 'content']}
                                  label="Text Content"
                                  rules={[{ required: true, message: 'Text content is required' }]}
                                >
                                  <TextArea rows={4} placeholder="Enter text content" />
                                </Form.Item>
                              )
                            }
                            
                            if (type === 'video' || type === 'pdf') {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, 'file']}
                                  label={`Upload ${type.toUpperCase()}`}
                                  rules={[{ required: true, message: `${type.toUpperCase()} file is required` }]}
                                >
                                  <Upload {...contentUploadProps} maxCount={1}>
                                    <Button icon={<UploadOutlined />}>
                                      Upload {type.toUpperCase()}
                                    </Button>
                                  </Upload>
                                </Form.Item>
                              )
                            }
                            
                            return null
                          }}
                        </Form.Item>
                      </Card>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Content Item
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

            <Card title="MCQ Questions" className="mb-6">
              <Form.List name="mcq">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card
                        key={key}
                        size="small"
                        title={`Question ${name + 1}`}
                        extra={
                          <Button
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(name)}
                          />
                        }
                        className="mb-4"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, 'question']}
                          label="Question"
                          rules={[{ required: true, message: 'Question is required' }]}
                        >
                          <TextArea rows={2} placeholder="Enter your question" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {['A', 'B', 'C', 'D'].map((option, index) => (
                            <Form.Item
                              key={option}
                              {...restField}
                              name={[name, 'options', index]}
                              label={`Option ${option}`}
                              rules={[{ required: true, message: 'Option is required' }]}
                            >
                              <Input placeholder={`Option ${option}`} />
                            </Form.Item>
                          ))}
                        </div>

                        <Form.Item
                          {...restField}
                          name={[name, 'correctAnswer']}
                          label="Correct Answer"
                          rules={[{ required: true, message: 'Correct answer is required' }]}
                        >
                          <Select placeholder="Select correct answer">
                            <Option value={0}>Option A</Option>
                            <Option value={1}>Option B</Option>
                            <Option value={2}>Option C</Option>
                            <Option value={3}>Option D</Option>
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          name={[name, 'explanation']}
                          label="Explanation (Optional)"
                        >
                          <TextArea rows={2} placeholder="Explain why this is the correct answer" />
                        </Form.Item>
                      </Card>
                    ))}
                    
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add MCQ Question
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Card>

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
                  loading={createMutation.isLoading}
                >
                  Create Course
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default CreateCourse