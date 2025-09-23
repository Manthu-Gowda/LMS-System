import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Row, Col, Space, message as antdMessage } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, postApi, putApi } from '../../utils/apiServices';
import { GET_COURSE_BY_ID, CREATE_COURSE, UPDATE_COURSE } from '../../utils/apiPaths';
import FormInputs from '../../components/UI/FormInputs';
import SelectInput from '../../components/UI/SelectInput';
import TextField from '../../components/UI/TextField';
import UploadInput from '../../components/UI/UploadInput';

const CourseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(!!id);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (id) {
                try {
                    const response = await getApi(`${GET_COURSE_BY_ID}/${id}`);
                    if (response.data) {
                        form.setFieldsValue(response.data);
                    }
                } catch (error) {
                    antdMessage.error('Failed to fetch course data.');
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchCourse();
    }, [id, form]);

    const onFinish = async (values) => {
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
            if (key === 'content') {
                formData.append(key, JSON.stringify(values[key]));
            } else {
                formData.append(key, values[key]);
            }
        });

        setIsSubmitting(true);
        try {
            const response = id
                ? await putApi(`${UPDATE_COURSE}/${id}`, formData)
                : await postApi(CREATE_COURSE, formData);

            if (response.statusCode === 200 || response.statusCode === 201) {
                antdMessage.success(response.message || `Course ${id ? 'updated' : 'created'} successfully!`);
                navigate('/admin/courses');
            } else {
                antdMessage.error(response.message || 'An error occurred.');
            }
        } catch (err) {
            antdMessage.error(err.response?.data?.message || err.message || 'An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        form.setFieldsValue({ slug });
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <AdminLayout>
            <Card title={id ? 'Edit Course' : 'Create Course'}>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={12}>
                            <FormInputs
                                name="title"
                                title="Title"
                                rules={[{ required: true, message: 'Title is required' }]}
                                placeholder="Enter the course title"
                                onChange={handleTitleChange}
                            />
                        </Col>
                        <Col span={12}>
                            <FormInputs
                                name="slug"
                                title="Slug"
                                rules={[{ required: true, message: 'Slug is required' }]}
                                placeholder="Enter the course slug"
                                disabled
                            />
                        </Col>
                    </Row>
                    <TextField
                        name="shortDescription"
                        title="Short Description"
                        rows={2}
                    />
                    <TextField name="description" title="Description" rows={4} />
                    <Row gutter={24}>
                        <Col span={8}>
                            <SelectInput
                                name="difficulty"
                                title="Difficulty"
                                options={[
                                    { value: 'beginner', label: 'Beginner' },
                                    { value: 'intermediate', label: 'Intermediate' },
                                    { value: 'advanced', label: 'Advanced' },
                                ]}
                            />
                        </Col>
                        <Col span={8}>
                            <FormInputs
                                name="estimatedDuration"
                                title="Estimated Duration"
                                placeholder="e.g., 8 hours"
                            />
                        </Col>
                        <Col span={8}>
                            <SelectInput
                                name="isPublished"
                                title="Status"
                                options={[
                                    { value: true, label: 'Published' },
                                    { value: false, label: 'Draft' },
                                ]}
                            />
                        </Col>
                    </Row>
                    <SelectInput name="tags" title="Tags" mode="tags" tokenSeparators={[',']} />

                    <Card title="Course Content">
                        <Form.List name="content">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                            <SelectInput
                                                {...restField}
                                                name={[name, 'type']}
                                                initialValue="video"
                                                options={[
                                                    { value: 'video', label: 'Video' },
                                                    { value: 'text', label: 'Text' },
                                                    { value: 'pdf', label: 'PDF' },
                                                    { value: 'youtube', label: 'YouTube' },
                                                ]}
                                            />
                                            <FormInputs
                                                {...restField}
                                                name={[name, 'title']}
                                                rules={[{ required: true, message: 'Content title is required' }]}
                                                placeholder="Content Title"
                                            />
                                            <UploadInput {...restField} name={[name, 'url']} />
                                            <DeleteOutlined onClick={() => remove(name)} />
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Content
                                        </Button>
                                    </Form.Item>
                                </>)}
                        </Form.List>
                    </Card>

                    <Form.Item className="mt-6">
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            {id ? 'Update' : 'Create'} Course
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </AdminLayout>
    );
};

export default CourseForm;