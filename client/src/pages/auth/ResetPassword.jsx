import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Typography, message as antdMessage } from 'antd';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { postApi } from '../../utils/apiServices';
import { RESET_PASSWORD } from '../../utils/apiPaths';
import AuthLayout from '../../components/Layout/AuthLayout';
import { motion } from 'framer-motion';
import FormInputs from '../../components/UI/FormInputs';

const { Title, Text } = Typography;

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [passwordReset, setPasswordReset] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await postApi(RESET_PASSWORD, { token, password: values.password });
            const { statusCode, message } = response;
            if (statusCode === 200) {
                setPasswordReset(true);
                antdMessage.success(message);
                setTimeout(() => navigate('/'), 3000);
            } else {
                antdMessage.error(message || 'Failed to reset password');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            antdMessage.error(error.response?.data?.message || error.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => (
        <Card className="shadow-xl">
            <div className="text-center mb-8">
                <Title level={2} className="mb-2 text-white">Reset Your Password</Title>
                <Text className="text-gray-300">Choose a new, strong password.</Text>
            </div>
            <Form name="reset-password" onFinish={onFinish} layout="vertical" size="large" autoComplete="off">
                <FormInputs
                    name="password"
                    title="New Password"
                    type="password"
                    rules={[{ required: true, message: 'Please input new password!' }, { min: 6, message: 'Must be at least 6 characters!' }]}
                    placeholder="New Password"
                />
                <FormInputs
                    name="confirmPassword"
                    title="Confirm New Password"
                    type="password"
                    dependencies={['password']}
                    rules={[{ required: true, message: 'Please confirm new password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) return Promise.resolve(); return Promise.reject(new Error('Passwords do not match!')); } })]}
                    placeholder="Confirm New Password"
                />
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block className="h-12 text-lg">Reset Password</Button>
                </Form.Item>
            </Form>
        </Card>
    );

    const renderSuccess = () => (
        <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl rounded-2xl text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
                <CheckCircleOutlined className="text-3xl text-green-300" />
            </motion.div>
            <Title level={2} className="mb-4 text-white">Password Reset Successful</Title>
            <Text className="block mb-6 text-gray-300">You can now log in with your new password.</Text>
            <Link to="/"><Button type="primary" block className="h-12 text-lg">Back to Login</Button></Link>
        </Card>
    );

    const renderInvalidToken = () => (
        <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl rounded-2xl text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="inline-block p-4 bg-red-500/20 rounded-full mb-4">
                <WarningOutlined className="text-3xl text-red-300" />
            </motion.div>
            <Title level={3} className="text-white">Invalid or Expired Link</Title>
            <Text className="block my-4 text-gray-300">This password reset link is not valid. Please request a new one.</Text>
            <Link to="/forgot-password">
                <Button type="primary" block className="h-12 text-lg">Request New Link</Button>
            </Link>
        </Card>
    );

    return (
        <AuthLayout>
            {!token ? renderInvalidToken() : (passwordReset ? renderSuccess() : renderForm())}
        </AuthLayout>
    );
};

export default ResetPassword;
