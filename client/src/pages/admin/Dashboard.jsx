import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Tag, Avatar } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_ADMIN_OVERVIEW, GET_ALL_USERS } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const StatCard = ({ title, value, icon, change, color }) => (
  <motion.div whileHover={{ translateY: -5 }}>
    <Card className="shadow-md border-0">
      <div className="flex justify-between items-start">
        <div>
          <Text className="text-gray-500">{title}</Text>
          <Title level={2} className="mt-1 mb-0">{value}</Title>
        </div>
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
      </div>
      <div className="mt-2 flex items-center">
        {change > 0 ? (
          <ArrowUpOutlined className="text-green-500" />
        ) : (
          <ArrowDownOutlined className="text-red-500" />
        )}
        <Text className={`ml-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {change}%
        </Text>
        <Text className="ml-1 text-gray-400">vs last month</Text>
      </div>
    </Card>
  </motion.div>
);

const AdminDashboard = () => {
  const { data: overviewData, isLoading: overviewLoading } = useQuery(
    'admin-overview',
    () => getApi(GET_ADMIN_OVERVIEW)
  );
  const { data: usersData, isLoading: usersLoading } = useQuery(
    'admin-users',
    () => getApi(GET_ALL_USERS)
  );

  if (overviewLoading || usersLoading) {
    return <LoadingSpinner />;
  }

  const overview = overviewData?.data || {};
  const users = usersData?.data || [];

  const chartData = [
    { name: 'Jan', uv: 400, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 300, pv: 4567, amt: 2400 },
    { name: 'Mar', uv: 200, pv: 1398, amt: 2400 },
    { name: 'Apr', uv: 278, pv: 9800, amt: 2400 },
    { name: 'May', uv: 189, pv: 3908, amt: 2400 },
  ];

  const userColumns = [
    {
      title: 'User',
      dataIndex: 'name',
      render: (name, record) => (
        <div className="flex items-center">
          <Avatar src={`https://i.pravatar.cc/150?u=${record._id}`} />
          <div className="ml-3">
            <Text strong>{name}</Text><br/>
            <Text type="secondary">{record.email}</Text>
          </div>
        </div>
      ),
    },
    { title: 'Courses', dataIndex: 'enrollments', render: (e) => e.length, align: 'center' },
    { 
      title: 'Status',
      dataIndex: 'isCompleted',
      render: (val) => <Tag color={val ? 'green' : 'blue'}>{val ? 'Completed' : 'In Progress'}</Tag>,
      align: 'center'
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Title level={2} className="mb-1">
            Good morning, Admin!
          </Title>
          <Text className="text-lg text-gray-500">
            Here's what's happening with your platform today.
          </Text>
        </motion.div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}><StatCard title="Total Users" value={overview.totalUsers} icon={<UserOutlined />} change={5.4} color="blue" /></Col>
          <Col xs={24} sm={12} lg={6}><StatCard title="Total Courses" value={overview.totalCourses} icon={<BookOutlined />} change={-2.1} color="green" /></Col>
          <Col xs={24} sm={12} lg={6}><StatCard title="Enrollments" value={overview.totalEnrollments} icon={<UserOutlined />} change={10.2} color="purple" /></Col>
          <Col xs={24} sm={12} lg={6}><StatCard title="Certificates" value={overview.totalCertificates} icon={<TrophyOutlined />} change={7} color="orange" /></Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card className="shadow-md border-0 h-full">
              <Title level={4}>User Enrollments</Title>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Recent Signups" className="shadow-md border-0 h-full">
              <Table
                columns={userColumns}
                dataSource={users.slice(0, 5)}
                pagination={false}
                rowKey="_id"
                showHeader={false}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
