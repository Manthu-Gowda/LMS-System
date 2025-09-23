import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Avatar, Progress } from 'antd';
import { Link } from 'react-router-dom';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  BarChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_ADMIN_OVERVIEW, GET_ALL_USERS } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const StatCard = ({ title, value, icon, trend, period, colorClass }) => (
  <Card className="shadow-lg border-0 h-full">
      <div className="flex justify-between items-center">
          <div>
              <Text type="secondary">{title}</Text>
              <Title level={3} className="mt-0">{value}</Title>
          </div>
          <div className={`text-2xl text-white p-3 rounded-full ${colorClass}`}>{icon}</div>
      </div>
      <div className="flex items-center text-sm mt-2">
          <span className={trend.change > 0 ? 'text-green-500' : 'text-red-500'}>
              {trend.change > 0 ? <ArrowUpOutlined/> : <ArrowDownOutlined/>}
              {trend.change}%
          </span>
          <Text type="secondary" className="ml-1">{period}</Text>
      </div>
  </Card>
);

const AdminDashboard = () => {
  const [overview, setOverview] = useState({});
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overviewResponse, usersResponse] = await Promise.all([
          getApi(GET_ADMIN_OVERVIEW),
          getApi(GET_ALL_USERS)
        ]);
        setOverview(overviewResponse.data || {});
        setUsers(usersResponse.data?.users || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  const salesData = [
    { name: 'Jan', Sales: 2300 }, { name: 'Feb', Sales: 3100 },
    { name: 'Mar', Sales: 2800 }, { name: 'Apr', Sales: 4200 },
    { name: 'May', Sales: 3500 }, { name: 'Jun', Sales: 5000 },
  ];

  const userColumns = [
    { 
      title: 'User', 
      dataIndex: 'name', 
      render: (name, record) => (
          <div className="flex items-center">
              <Avatar src={`https://i.pravatar.cc/150?u=${record._id}`} />
              <Text className="ml-3">{name}</Text>
          </div>
      )
    },
    { 
      title: 'Enrolled', 
      dataIndex: 'enrollments',
      render: (enrollments) => `${enrollments.length} courses`
    },
  ];

  return (
    <AdminLayout>
      <Title level={2} className="mb-4">Dashboard</Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}><StatCard title="Total Users" value={overview.totalUsers} icon={<UserOutlined />} trend={{ change: 3.2 }} period="last month" colorClass="bg-blue-500"/></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Total Courses" value={overview.totalCourses} icon={<BookOutlined />} trend={{ change: -1.5 }} period="last month" colorClass="bg-green-500"/></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Enrollments" value={overview.totalEnrollments} icon={<BarChartOutlined />} trend={{ change: 8.0 }} period="last week" colorClass="bg-purple-500"/></Col>
        <Col xs={24} sm={12} lg={6}><StatCard title="Certificates Issued" value={overview.totalCertificates} icon={<TrophyOutlined />} trend={{ change: 4.7 }} period="last week" colorClass="bg-yellow-500"/></Col>

        <Col xs={24} lg={16}>
          <Card title="Revenue Overview" className="shadow-lg border-0 h-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Area type="monotone" dataKey="Sales" stroke="#8884d8" fill="#8884d8" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="New Users" className="shadow-lg border-0 h-full">
            <Table
                columns={userColumns}
                dataSource={users.slice(0, 5)}
                pagination={false}
                showHeader={false}
                rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  );
};

export default AdminDashboard;
