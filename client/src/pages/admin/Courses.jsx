import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Space, message as antdMessage, Tag, Input, Select, Avatar, Popconfirm, Typography } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, deleteApi, putApi } from '../../utils/apiServices';
import { GET_COURSES, DELETE_COURSE, UPDATE_COURSE } from '../../utils/apiPaths';

const { Option } = Select;
const { Title, Text } = Typography;

const AdminCourses = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: '', status: null });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await getApi(GET_COURSES);
      const coursesList = response.data?.courses || response.data || [];
      setCourses(coursesList);
    } catch (error) {
      antdMessage.error('Failed to fetch courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdate = async (id, data) => {
    try {
      const response = await putApi(`${UPDATE_COURSE}/${id}`, data);
      if (response.statusCode === 200) {
        antdMessage.success(response.message || 'Course updated successfully!');
        fetchCourses();
      } else {
        antdMessage.error(response.message || 'Failed to update course.');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message || 'An error occurred.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteApi(`${DELETE_COURSE}/${id}`);
      if (response.statusCode === 200) {
        antdMessage.success(response.message || 'Course deleted successfully!');
        fetchCourses();
      } else {
        antdMessage.error(response.message || 'Failed to delete course.');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message || 'An error occurred.');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const filteredCourses = Array.isArray(courses) ? courses.filter(c => 
    c.title.toLowerCase().includes(filters.search.toLowerCase()) &&
    (filters.status === null || c.isPublished === filters.status)
  ) : [];

  const columns = [
    {
      title: 'Course',
      dataIndex: 'title',
      render: (title, r) => (
        <div className="flex items-center">
          <Avatar shape="square" size={64} src={r.thumbnail || 'https://via.placeholder.com/150'} className="mr-4" />
          <div>
            <Text strong>{title}</Text>
            <br />
            <Text type="secondary">{r.shortDescription}</Text>
          </div>
        </div>
      ),
    },
    {
        title: 'Status',
        dataIndex: 'isPublished',
        align: 'center',
        render: (isPublished, r) => (
            <Popconfirm 
                title={`Change status to ${isPublished ? 'Draft' : 'Published'}?`}
                onConfirm={() => handleUpdate(r._id, { isPublished: !r.isPublished })}
                okText="Yes"
                cancelText="No"
            >
                <Tag color={isPublished ? 'success' : 'volcano'} className="cursor-pointer">
                    {isPublished ? 'Published' : 'Draft'}
                </Tag>
            </Popconfirm>
        ),
    },
    { title: 'Enrollments', dataIndex: 'enrollmentCount', align: 'center' },
    { title: 'Created', dataIndex: 'createdAt', render: (date) => new Date(date).toLocaleDateString(), align: 'center' },
    {
      title: 'Actions',
      align: 'right',
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/courses/${r.slug}`)} />
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/courses/${r._id}/edit`)} />
          <Popconfirm title="Are you sure you want to delete this course?" onConfirm={() => handleDelete(r._id)} okText="Delete" cancelText="Cancel">
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2}>Course Management</Title>
          <Text>Oversee and manage all courses in the platform.</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/admin/courses/new')}>
          Add New Course
        </Button>
      </div>
      <Card className="shadow-lg border-0">
        <div className="flex justify-between mb-6">
          <Input 
            placeholder="Search by course title..."
            prefix={<SearchOutlined />}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            style={{ maxWidth: 350, width: '100%' }}
            allowClear
          />
          <Select defaultValue={null} onChange={value => setFilters({ ...filters, status: value })} style={{ width: 150 }}>
            <Option value={null}>All Statuses</Option>
            <Option value={true}>Published</Option>
            <Option value={false}>Draft</Option>
          </Select>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredCourses} 
          rowKey="_id"
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
        />
      </Card>
    </AdminLayout>
  );
};

export default AdminCourses;
