import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Upload, Button, Card, Typography, Alert, message } from 'antd'
import { LinkOutlined, UploadOutlined, SendOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useMutation, useQueryClient } from 'react-query'

import UserLayout from '../../components/Layout/UserLayout'
import * as courseAPI from '../../services/courses'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const AssignmentSubmission = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState([])

  const submitMutation = useMutation(
    (formData) => {
      // Get the course ID from the URL or state
      // For now, we'll need to fetch it from the enrollments
      return courseAPI.submitAssignment(slug, formData)
    },
    {
      onSuccess: () => {
        message.success('Assignment submitted successfully!')
        queryClient.invalidateQueries('my-enrollments')
        navigate(`/courses/${slug}`)
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to submit assignment')
      },
    }
  )

  const handleSubmit = (values) => {
    const formData = new FormData()
    
    if (values.projectLink) {
      formData.append('link', values.projectLink)
    }
    
    if (values.description) {
      formData.append('description', values.description)
    }
    
    if (fileList.length > 0) {
      formData.append('file', fileList[0].originFileObj)
    }

    submitMutation.mutate(formData)
  }

  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type.startsWith('image/') ||
                         file.type === 'application/zip' ||
                         file.type === 'application/x-zip-compressed'
      
      if (!isValidType) {
        message.error('You can only upload PDF, images, or ZIP files!')
        return false
      }
      
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!')
        return false
      }
      
      return false // Prevent automatic upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)) // Keep only the last file
    },
    fileList,
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <div className="text-center">
              <SendOutlined className="text-5xl text-blue-500 mb-4" />
              <Title level={2}>Submit Your Assignment</Title>
              <Paragraph type="secondary" className="text-lg">
                Complete your learning journey by submitting your project or relevant work.
                This is the final step to receive your course certificate.
              </Paragraph>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card title="Assignment Submission Form">
            <Alert
              message="Submission Guidelines"
              description={
                <ul className="mt-2 space-y-1">
                  <li>• Provide a link to your project (GitHub, demo site, etc.) OR upload a file</li>
                  <li>• Include a brief description of your work</li>
                  <li>• Accepted file types: PDF, images, ZIP files (max 10MB)</li>
                  <li>• Make sure your submission demonstrates the skills learned in this course</li>
                </ul>
              }
              type="info"
              showIcon
              className="mb-6"
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              size="large"
            >
              <Form.Item
                name="projectLink"
                label="Project Link (Optional)"
                rules={[
                  {
                    type: 'url',
                    message: 'Please enter a valid URL',
                  },
                ]}
              >
                <Input
                  prefix={<LinkOutlined />}
                  placeholder="https://github.com/username/project or https://your-demo-site.com"
                />
              </Form.Item>

              <Form.Item
                name="description"
                label="Project Description"
                rules={[
                  { required: true, message: 'Please provide a description of your work' },
                  { min: 50, message: 'Description must be at least 50 characters' },
                ]}
              >
                <TextArea
                  rows={6}
                  placeholder="Describe your project, what you built, technologies used, challenges faced, and key learnings from this course..."
                />
              </Form.Item>

              <Form.Item
                name="file"
                label="Upload File (Optional)"
                extra="Alternative to project link. Upload screenshots, documentation, or project files."
              >
                <Upload {...uploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />}>
                    Select File (PDF, Images, ZIP - Max 10MB)
                  </Button>
                </Upload>
              </Form.Item>

              <Alert
                message="Note"
                description="Your assignment will be reviewed and you'll automatically receive your certificate upon successful submission."
                type="warning"
                showIcon
                className="mb-6"
              />

              <Form.Item>
                <div className="flex justify-between">
                  <Button
                    size="large"
                    onClick={() => navigate(`/courses/${slug}`)}
                  >
                    Back to Course
                  </Button>
                  
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={submitMutation.isLoading}
                    icon={<SendOutlined />}
                  >
                    Submit Assignment
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </div>
    </UserLayout>
  )
}

export default AssignmentSubmission