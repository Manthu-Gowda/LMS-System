import React, { useState, useEffect } from 'react';
import { Table, Card, Input, Select, Avatar, Typography, Tag, message as antdMessage, Popconfirm, Button, Space } from 'antd';
import { SearchOutlined, DeleteOutlined, UserAddOutlined, EditOutlined, CrownOutlined } from '@ant-design/icons';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, putApi, deleteApi } from '../../utils/apiServices';
import { GET_ALL_USERS, UPDATE_USER, DELETE_USER } from '../../utils/apiPaths';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminUsers = () => {
  const [filters, setFilters] = useState({ search: '', role: null, status: null });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await getApi(GET_ALL_USERS);
      setUsers(response?.data || []);
    } catch (error) {
      antdMessage.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, data) => {
    try {
      const response = await putApi(`${UPDATE_USER}/${id}`, data);
      if (response.statusCode === 200) {
        antdMessage.success(response.message || 'User updated successfully');
        fetchUsers();
      } else {
        antdMessage.error(response.message || 'Failed to update user');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteApi(`${DELETE_USER}/${id}`);
      if (response.statusCode === 200) {
        antdMessage.success(response.message || 'User deleted successfully');
        fetchUsers();
      } else {
        antdMessage.error(response.message || 'Failed to delete user');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message || 'Failed to delete user');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const filteredUsers = users.filter(user => {
    const searchMatch = user.name.toLowerCase().includes(filters.search.toLowerCase()) || user.email.toLowerCase().includes(filters.search.toLowerCase());
    const roleMatch = filters.role ? user.role === filters.role : true;
    return searchMatch && roleMatch;
  });

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      render: (name, user) => (
        <div className="flex items-center">
          <Avatar src={`https://i.pravatar.cc/150?u=${user._id}`} />
          <div className="ml-3">
            <Text strong>{name}</Text><br/>
            <Text type="secondary">{user.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      align: 'center',
      render: (role, user) => (
          <Tag icon={role === 'admin' && <CrownOutlined/>} color={role === 'admin' ? 'gold' : 'default'}>
              {role.toUpperCase()}
          </Tag>
      )
    },
    {
      title: 'Courses Enrolled',
      dataIndex: 'enrollments',
      align: 'center',
      render: (enrollments) => enrollments.length,
    },
    {
      title: 'Date Joined',
      dataIndex: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      align: 'center',
    },
    {
      title: 'Actions',
      align: 'right',
      render: (_, user) => (
          <Space>
              <Button icon={<EditOutlined />} onClick={() => antdMessage.info('Edit functionality coming soon!')} />
              <Popconfirm title="Are you sure you want to delete this user?" onConfirm={() => handleDeleteUser(user._id)} okText="Delete" cancelText="Cancel">
                  <Button icon={<DeleteOutlined />} danger />
              </Popconfirm>
          </Space>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
            <Title level={2}>User Management</Title>
            <Text>Monitor, manage, and engage with your platform's users.</Text>
        </div>
        <Button type="primary" icon={<UserAddOutlined />} size="large" onClick={() => antdMessage.info('Functionality to add users coming soon!')}>
          Add User
        </Button>
      </div>
      <Card className="shadow-lg border-0">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Input 
            placeholder="Search by name or email..."
            prefix={<SearchOutlined />}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="max-w-md"
            allowClear
          />
          <Select placeholder="Filter by role" onChange={value => setFilters({ ...filters, role: value })} style={{ width: 150 }} allowClear>
            <Option value="user">User</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="_id" 
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </AdminLayout>
  );
};

export default AdminUsers;
