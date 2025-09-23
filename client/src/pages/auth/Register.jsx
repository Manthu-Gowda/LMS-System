import React, { useState } from 'react';
import { Form, Button, Card, Typography, message as antdMessage } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { postApi } from '../../utils/apiServices';
import { USER_REGISTER } from '../../utils/apiPaths';
import AuthLayout from '../../components/Layout/AuthLayout';
import FormInputs from '../../components/UI/FormInputs';

const { Title, Text } = Typography;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        const { confirmPassword, ...payload } = values;

        try {
            const response = await postApi(USER_REGISTER, payload);
            const { statusCode, message } = response;
            if (statusCode === 201) {
                antdMessage.success(message);
                navigate('/');
            } else {
                antdMessage.error(message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            antdMessage.error(error.response?.data?.message || error.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <Card className="shadow-xl">
                <div className="text-center mb-8">
                    <Title level={2} className="text-white">Create Your Account</Title>
                    <Text className="text-gray-300">Join us and start your learning journey!</Text>
                </div>

                <Form name="register" onFinish={onFinish} layout="vertical" size="large" autoComplete="off">
                    <FormInputs
                        name="name"
                        title="Full Name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                        placeholder="Enter your full name"
                    />
                    <FormInputs
                        name="email"
                        title="Email"
                        rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'A valid email is required!' }]}
                        placeholder="Enter your email"
                    />
                    <FormInputs
                        name="password"
                        title="Password"
                        type="password"
                        rules={[{ required: true, message: 'Please input a password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}
                        placeholder="Create a password"
                    />
                    <FormInputs
                        name="confirmPassword"
                        title="Confirm Password"
                        type="password"
                        dependencies={['password']}
                        rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Passwords do not match!')); } })]}
                        placeholder="Confirm your password"
                    />
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block className="h-12 text-lg">Create Account</Button>
                    </Form.Item>
                </Form>

                <div className="text-center">
                    <Text className="text-gray-300">
                        Already have an account?{' '}
                        <Link to="/" className="font-medium text-blue-400 hover:text-blue-300">Sign in</Link>
                    </Text>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default Register;
