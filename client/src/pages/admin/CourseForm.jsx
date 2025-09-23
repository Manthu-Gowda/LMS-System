import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Select, Row, Col, Upload, message, Space, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, postApi, putApi } from '../../utils/apiServices';
import { GET_COURSE_BY_ID, CREATE_COURSE, UPDATE_COURSE } from '../../utils/apiPaths';

const { Option } = Select;
const { TextArea } = Input;

const CourseForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: courseData, isLoading } = useQuery(
    ['admin-course', id],
    () => getApi(`${GET_COURSE_BY_ID}/${id}`),
    { enabled: !!id }
  );

  const mutation = useMutation(
    (data) => id ? putApi(`${UPDATE_COURSE}/${id}`, data) : postApi(CREATE_COURSE, data),
    {
      onSuccess: () => {
        message.success(`Course ${id ? 'updated' : 'created'} successfully!`);
        queryClient.invalidateQueries('admin-courses');
        navigate('/admin/courses');
      },
      onError: (err) => message.error(err.message),
    }
  );

  useEffect(() => {
    if (courseData) {
      form.setFieldsValue(courseData.data);
    }
  }, [courseData, form]);

  if (isLoading) return <LoadingSpinner />;

  const onFinish = (values) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      if (key === 'content') {
        formData.append(key, JSON.stringify(values[key]));
      } else {
        formData.append(key, values[key]);
      }
    });
    // Handle file uploads for content
    mutation.mutate(formData);
  };

  return (
    <AdminLayout>
      <Card title={id ? 'Edit Course' : 'Create Course'}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="slug" label="Slug" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="shortDescription" label="Short Description">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="difficulty" label="Difficulty">
                <Select>
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="estimatedDuration" label="Estimated Duration">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isPublished" label="Status">
                <Select>
                  <Option value={true}>Published</Option>
                  <Option value={false}>Draft</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" tokenSeparators={[',']} />
          </Form.Item>
          
          <Card title="Course Content">
            <Form.List name="content">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item {...restField} name={[name, 'type']} initialValue="video">
                        <Select style={{ width: 120 }}>
                          <Option value="video">Video</Option>
                          <Option value="text">Text</Option>
                          <Option value="pdf">PDF</Option>
                          <Option value="youtube">YouTube</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'title']} rules={[{ required: true }]}>
                        <Input placeholder="Content Title" />
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'url']}>
                        <Upload><Button icon={<UploadOutlined/>}>Upload</Button></Upload>
                      </Form.Item>
                      <DeleteOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add Content
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Card>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
              {id ? 'Update' : 'Create'} Course
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </AdminLayout>
  );
};

export default CourseForm;
