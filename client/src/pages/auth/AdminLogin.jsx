import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert } from 'antd'
import { LockOutlined, MailOutlined, CrownOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../contexts/AuthContext'
import { postApi } from '../../utils/apiServices'
import { USER_LOGIN } from '../../utils/apiPaths'
import { message } from 'antd'

const { Title, Text } = Typography

const AdminLogin = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    const payload = {
      email: values.email,
      password: values.password,
      loginType: 1 // Admin login
    }
    
    try {
      const response = await postApi(USER_LOGIN, payload)
      if (response.success) {
        const { accessTokenResponseModel, user } = response.data
        const loginData = {
          accessToken: accessTokenResponseModel.accessToken,
          refreshToken: accessTokenResponseModel.refreshToken || '',
          expiryTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          ...user
        }
        
        login(loginData)
        message.success(response.message)
        navigate('/admin')
      } else {
        message.error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Admin login failed:', error)
      message.error(error.message || 'An error occurred during login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4">
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
              className="inline-block p-4 bg-purple-100 rounded-full mb-4"
            >
              <CrownOutlined className="text-3xl text-purple-600" />
            </motion.div>
            <Title level={2} className="mb-2">
              Admin Panel
            </Title>
            <Text type="secondary">
              Sign in to access the admin dashboard
            </Text>
          </div>

          <Alert
            message="Demo Credentials"
            description="Email: lmsadmin@yopmail.com | Password: Password@123"
            type="info"
            showIcon
            className="mb-6"
          />

          <Form
            name="admin-login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Admin Email"
              rules={[
                { required: true, message: 'Please input admin email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter admin email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <div className="text-right mb-4">
              <Link
                to="/forgot-password"
                className="text-purple-600 hover:text-purple-800"
              >
                Forgot password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12"
                style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
              >
                Admin Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-6">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              ← Back to Student Login
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminLogin
