import React, { useState } from 'react';
import { Form, Button, Card, Typography, message as antdMessage } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { postApi } from '../../utils/apiServices';
import { USER_LOGIN } from '../../utils/apiPaths';
import AuthLayout from '../../components/Layout/AuthLayout';
import FormInputs from '../../components/UI/FormInputs';

const { Title, Text } = Typography;

const AdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const payload = {
            email: values.email,
            password: values.password,
            loginType: 1, // Admin login
        };

        try {
            const response = await postApi(USER_LOGIN, payload);
            const { statusCode, data, message } = response
            if (statusCode === 200) {
                const { accessTokenResponseModel, user } = data;
                const loginData = {
                    accessToken: accessTokenResponseModel.accessToken,
                    refreshToken: accessTokenResponseModel.refreshToken || '',
                    expiryTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                    ...user,
                };

                login(loginData);
                antdMessage.success(message);
                navigate('/admin');
            } else {
                antdMessage.error(message || 'Login failed');
            }
        } catch (error) {
            console.error('Admin login failed:', error);
            antdMessage.error(error.response?.data?.message || error.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
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
                    <Text type="secondary">Sign in to access the admin dashboard</Text>
                </div>

                <Form
                    name="admin-login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                >
                    <FormInputs
                        name="email"
                        title="Admin Email"
                        rules={[
                            { required: true, message: 'Please input admin email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                        placeholder="Enter admin email"
                    />

                    <FormInputs
                        name="password"
                        title="Password"
                        type="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                        placeholder="Enter your password"
                    />

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
        </AuthLayout>
    );
};

export default AdminLogin;
