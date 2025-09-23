import React, { useState } from 'react';
import { Form, Button, Card, Typography, message as antdMessage } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { postApi } from '../../utils/apiServices';
import { FORGOT_PASSWORD } from '../../utils/apiPaths';
import AuthLayout from '../../components/Layout/AuthLayout';
import { motion } from 'framer-motion';
import FormInputs from '../../components/UI/FormInputs';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await postApi(FORGOT_PASSWORD, values);
            const { statusCode, message } = response
            if (statusCode === 200) {
                setEmailSent(true);
                antdMessage.success(message);
            } else {
                antdMessage.error(message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error('Forgot password error:', error);
            antdMessage.error(error.response?.data?.message || error.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <AuthLayout>
                <Card className="bg-white/10 backdrop-blur-lg border-0 shadow-2xl rounded-2xl text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                        className="inline-block p-4 bg-green-500/20 rounded-full mb-4"
                    >
                        <MailOutlined className="text-3xl text-green-300" />
                    </motion.div>

                    <Title level={2} className="mb-4 text-white">
                        Check Your Email
                    </Title>

                    <Text className="block mb-6 text-gray-300">
                        We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                    </Text>

                    <Button type="primary" block className="h-12 text-lg mb-4">
                        Open Email App
                    </Button>

                    <Link to="/" className="text-blue-400 hover:text-blue-300">
                        <ArrowLeftOutlined /> Back to Login
                    </Link>
                </Card>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <Card className="shadow-xl">
                <div className="text-center mb-8">
                    <Title level={2} className="mb-2 text-white">
                        Forgot Password?
                    </Title>
                    <Text className="text-gray-300">
                        Enter your email and we'll send a reset link.
                    </Text>
                </div>

                <Form
                    name="forgot-password"
                    onFinish={onFinish}
                    layout="vertical"
                    size="large"
                    autoComplete="off"
                >
                    <FormInputs
                        name="email"
                        title="Email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' },
                        ]}
                        placeholder="Enter your email"
                    />

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="h-12 text-lg"
                        >
                            Send Reset Link
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center">
                    <Link to="/" className="text-blue-400 hover:text-blue-300">
                        <ArrowLeftOutlined /> Back to Login
                    </Link>
                </div>
            </Card>
        </AuthLayout>
    );
};

export default ForgotPassword;
