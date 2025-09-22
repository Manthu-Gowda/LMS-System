import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text } = Typography

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { forgotPassword } = useAuth()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await forgotPassword(values.email)
      setEmailSent(true)
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-xl text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="inline-block p-4 bg-green-100 rounded-full mb-4"
            >
              <MailOutlined className="text-3xl text-green-600" />
            </motion.div>
            
            <Title level={2} className="mb-4">
              Check Your Email
            </Title>
            
            <Text type="secondary" className="block mb-6">
              We've sent a password reset link to your email address. 
              Please check your inbox and follow the instructions.
            </Text>
            
            <Button type="primary" block className="h-12 mb-4">
              Open Email App
            </Button>
            
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="inline-block p-4 bg-blue-100 rounded-full mb-4"
            >
              <MailOutlined className="text-3xl text-blue-600" />
            </motion.div>
            <Title level={2} className="mb-2">
              Forgot Password?
            </Title>
            <Text type="secondary">
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </div>

          <Form
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12"
              >
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ForgotPassword