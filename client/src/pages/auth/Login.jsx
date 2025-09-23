import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { postApi } from '../../utils/apiServices';
import { USER_LOGIN } from '../../utils/apiPaths';
import { message } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      email: values.email,
      password: values.password,
      loginType: 2 // User login
    };
    
    try {
      const response = await postApi(USER_LOGIN, payload);
      if (response.success) {
        const { accessTokenResponseModel, user } = response.data;
        const loginData = {
          accessToken: accessTokenResponseModel.accessToken,
          refreshToken: accessTokenResponseModel.refreshToken || '',
          expiryTime: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
          ...user
        };
        
        login(loginData);
        message.success(response.message);
        navigate('/dashboard');
      } else {
        message.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      message.error(error.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

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
              <UserOutlined className="text-3xl text-blue-600" />
            </motion.div>
            <Title level={2} className="mb-2">
              Welcome Back
            </Title>
            <Text type="secondary">
              Sign in to your account to continue learning
            </Text>
          </div>

          <Alert
            message="Demo Credentials"
            description="Email: student@example.com | Password: password123"
            type="info"
            showIcon
            className="mb-6"
          />

          <Form
            name="login"
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
                className="text-blue-600 hover:text-blue-800"
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
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <Divider />

          <div className="text-center space-y-4">
            <Text>
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up here
              </Link>
            </Text>
            
            <div>
              <Link
                to="/admin-login"
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                Admin Login
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
