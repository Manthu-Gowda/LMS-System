import React from 'react'
import { Row, Col, Card, Statistic, Table, Typography, Tag } from 'antd'
import { 
  UserOutlined, 
  BookOutlined, 
  TrophyOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'

import AdminLayout from '../../components/Layout/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as adminAPI from '../../services/admin'

const { Title } = Typography

const AdminDashboard = () => {
  const { data: overviewData, isLoading: overviewLoading } = useQuery(
    'admin-overview',
    adminAPI.getAdminOverview
  )

  const { data: usersData, isLoading: usersLoading } = useQuery(
    'admin-users',
    adminAPI.getAllUsers
  )

  if (overviewLoading || usersLoading) {
    return <LoadingSpinner />
  }

  const overview = overviewData || {}
  const users = usersData?.data || []

  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)

  const userColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Enrollments',
      key: 'enrollments',
      render: (_, user) => (
        <span>{user.enrollments?.length || 0}</span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, user) => {
        const hasCompletedCourses = user.enrollments?.some(e => e.isCompleted)
        return hasCompletedCourses ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>Active Learner</Tag>
        ) : (
          <Tag color="processing" icon={<ClockCircleOutlined />}>Learning</Tag>
        )
      },
    },
    {
      title: 'Joined',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Title level={1}>Admin Dashboard</Title>
          <p className="text-gray-600 text-lg">
            Monitor your LMS performance and user activity
          </p>
        </motion.div>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card>
                <Statistic
                  title="Total Users"
                  value={overview.totalUsers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card>
                <Statistic
                  title="Total Courses"
                  value={overview.totalCourses || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card>
                <Statistic
                  title="Total Enrollments"
                  value={overview.totalEnrollments || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card>
                <Statistic
                  title="Certificates Issued"
                  value={overview.totalCertificates || 0}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Recent Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card
            title="Recent Users"
            extra={
              <a href="/admin/users" className="text-blue-600">
                View All Users
              </a>
            }
          >
            <Table
              columns={userColumns}
              dataSource={recentUsers}
              rowKey="_id"
              pagination={false}
              size="middle"
            />
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard