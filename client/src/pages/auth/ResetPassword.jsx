import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text } = Typography

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  const onFinish = async (values) => {
    if (!token) {
      return
    }

    setLoading(true)
    try {
      await resetPassword(token, values.password)
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
        <Card className="shadow-xl text-center w-full max-w-md">
          <Alert
            message="Invalid Reset Link"
            description="This password reset link is invalid or has expired. Please request a new one."
            type="error"
            showIcon
            className="mb-6"
          />
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
            Request New Reset Link
          </Link>
        </Card>
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
              className="inline-block p-4 bg-green-100 rounded-full mb-4"
            >
              <LockOutlined className="text-3xl text-green-600" />
            </motion.div>
            <Title level={2} className="mb-2">
              Reset Password
            </Title>
            <Text type="secondary">
              Enter your new password below
            </Text>
          </div>

          <Form
            name="reset-password"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="password"
              label="New Password"
              rules={[
                { required: true, message: 'Please input your new password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('Passwords do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
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
                Reset Password
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ResetPassword