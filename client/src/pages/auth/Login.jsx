import React, { useState } from 'react';
import { Form, Button, Card, Typography, Divider, message as antdMessage } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { postApi } from '../../utils/apiServices';
import { USER_LOGIN } from '../../utils/apiPaths';
import AuthLayout from '../../components/Layout/AuthLayout';
import FormInputs from '../../components/UI/FormInputs';

const { Title, Text } = Typography;

const Login = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const payload = { email: values.email, password: values.password, loginType: 2 };

        try {
            const response = await postApi(USER_LOGIN, payload);
            const { statusCode, data, message } = response
            if (statusCode === 200) {
                const { accessTokenResponseModel, user } = data;
                const loginData = {
                    accessToken: accessTokenResponseModel.accessToken,
                    refreshToken: accessTokenResponseModel.refreshToken || '',
                    expiryTime: Date.now() + 24 * 60 * 60 * 1000,
                    ...user,
                };
                login(loginData);
                antdMessage.success(message);
                navigate('/dashboard');
            } else {
                antdMessage.error(message || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            antdMessage.error(error.response?.data?.message || error.message || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="shadow-xl">
                <div className="text-center mb-8">
                    <Title level={2} className="text-white">
                        Welcome Back
                    </Title>
                    <Text className="text-gray-300">
                        Sign in to your account to continue learning
                    </Text>
                </div>

                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                >
                    <FormInputs
                        name="email"
                        title="Email"
                        placeholder="Enter your email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                    />

                    <FormInputs
                        name="password"
                        title="Password"
                        type="password"
                        placeholder="Enter your password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    />

                    <div className="text-right mb-4">
                        <Link
                            to="/forgot-password"
                            className="text-blue-400 hover:text-blue-300"
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
                            className="h-12 text-lg"
                        >
                            Sign In
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ borderColor: 'rgb(107 114 128 / 0.5)' }} />

                <div className="text-center">
                    <Text className="text-gray-300">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                            Sign up here
                        </Link>
                    </Text>
                    <div className="mt-2">
                        <Link to="/admin-login" className="text-sm text-gray-400 hover:text-gray-300">
                            Admin Login
                        </Link>
                    </div>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default Login;
