import React, { useState } from 'react';
import { Table, Button, Card, Space, Modal, message, Tag, Input, Select, Avatar, Popconfirm } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, deleteApi, putApi } from '../../utils/apiServices';
import { GET_COURSES, DELETE_COURSE, UPDATE_COURSE } from '../../utils/apiPaths';

const { Option } = Select;

const AdminCourses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({ search: '', status: null });

  const { data: coursesData, isLoading } = useQuery('admin-courses', () => getApi(GET_COURSES));

  const mutation = useMutation(
    ({ id, data }) => putApi(`${UPDATE_COURSE}/${id}`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses');
        message.success('Course updated!');
      },
      onError: (err) => message.error(err.message),
    }
  );

  const deleteMutation = useMutation(
    (id) => deleteApi(`${DELETE_COURSE}/${id}`),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-courses');
        message.success('Course deleted!');
      },
      onError: (err) => message.error(err.message),
    }
  );

  if (isLoading) return <LoadingSpinner />;

  const courses = coursesData?.data || [];

  const filteredCourses = courses.filter(c => 
    (c.title.toLowerCase().includes(filters.search.toLowerCase()) || c.slug.toLowerCase().includes(filters.search.toLowerCase())) &&
    (filters.status === null || c.isPublished === filters.status)
  );

  const columns = [
    { 
      title: 'Course',
      dataIndex: 'title',
      render: (title, r) => (
        <div className="flex items-center">
          <Avatar shape="square" size={48} src={r.thumbnail || 'https://picsum.photos/200'} className="mr-3" />
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-gray-500">{r.slug}</div>
          </div>
        </div>
      )
    },
    { 
      title: 'Status',
      dataIndex: 'isPublished',
      align: 'center',
      render: (isPublished) => <Tag color={isPublished ? 'success' : 'warning'}>{isPublished ? 'Published' : 'Draft'}</Tag>
    },
    { title: 'Enrollments', dataIndex: 'enrollmentCount', align: 'center' },
    { title: 'Created At', dataIndex: 'createdAt', render: (date) => new Date(date).toLocaleDateString() },
    {
      title: 'Actions',
      align: 'right',
      render: (_, r) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`/courses/${r.slug}`)} />
          <Button icon={<EditOutlined />} onClick={() => navigate(`/admin/courses/${r._id}/edit`)} />
          <Popconfirm 
            title={`Are you sure you want to ${r.isPublished ? 'unpublish' : 'publish'} this course?`}
            onConfirm={() => mutation.mutate({ id: r._id, data: { isPublished: !r.isPublished } })}
          >
            <Button icon={r.isPublished ? <CloudDownloadOutlined /> : <CloudUploadOutlined />} />
          </Popconfirm>
          <Popconfirm title="Are you sure you want to delete this course?" onConfirm={() => deleteMutation.mutate(r._id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-gray-600">Manage all courses in the platform.</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => navigate('/admin/courses/new')}>
            New Course
          </Button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-md border-0">
            <div className="flex justify-between mb-4">
              <Input 
                placeholder="Search courses..."
                prefix={<SearchOutlined />}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="max-w-xs"
              />
              <Select defaultValue={null} onChange={value => setFilters({ ...filters, status: value })} className="w-40">
                <Option value={null}>All Statuses</Option>
                <Option value={true}>Published</Option>
                <Option value={false}>Draft</Option>
              </Select>
            </div>
            <Table 
              columns={columns} 
              dataSource={filteredCourses} 
              rowKey="_id" 
              pagination={{ pageSize: 10, showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}` }}
            />
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
