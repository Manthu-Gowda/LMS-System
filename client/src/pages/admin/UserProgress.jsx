import React from 'react'
import { useParams } from 'react-router-dom'
import { Card, Progress, Table, Typography, Tag, Space } from 'antd'
import { BookOutlined, TrophyOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'

import AdminLayout from '../../components/Layout/AdminLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as adminAPI from '../../services/admin'

const { Title, Text } = Typography

const UserProgress = () => {
  const { id } = useParams()

  const { data: progressData, isLoading } = useQuery(
    ['user-progress', id],
    () => adminAPI.getUserProgress(id)
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!progressData) {
    return (
      <AdminLayout>
        <div className="text-center py-16">
          <Title level={2}>User not found</Title>
        </div>
      </AdminLayout>
    )
  }

  const { user, enrollments } = progressData

  const columns = [
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      render: (course) => (
        <div>
          <div className="font-medium">{course.title}</div>
          <div className="text-gray-500 text-sm">{course.difficulty}</div>
        </div>
      ),
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_, enrollment) => {
        const total = enrollment.course.content?.length || 1
        const completed = enrollment.progress?.contentCompleted?.length || 0
        const percent = Math.round((completed / total) * 100)
        
        return (
          <div>
            <Progress percent={percent} size="small" />
            <Text type="secondary" className="text-xs">
              {completed} / {total} lessons completed
            </Text>
          </div>
        )
      },
    },
    {
      title: 'MCQ Score',
      dataIndex: 'mcqScore',
      key: 'mcqScore',
      render: (score) => (
        score !== null ? (
          <Tag color={score >= 70 ? 'success' : 'warning'}>
            {score}%
          </Tag>
        ) : (
          <Tag color="default">Not taken</Tag>
        )
      ),
    },
    {
      title: 'Assignment',
      key: 'assignment',
      render: (_, enrollment) => (
        enrollment.assignment ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Submitted
          </Tag>
        ) : (
          <Tag color="default">Pending</Tag>
        )
      ),
    },
    {
      title: 'Certificate',
      dataIndex: 'certificateId',
      key: 'certificateId',
      render: (certificateId) => (
        certificateId ? (
          <Tag color="gold" icon={<TrophyOutlined />}>
            Issued
          </Tag>
        ) : (
          <Tag color="default">Not issued</Tag>
        )
      ),
    },
    {
      title: 'Enrolled',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <Title level={2} className="mb-1">
                  {user.name}
                </Title>
                <Text type="secondary" className="text-lg">
                  {user.email}
                </Text>
                
                <div className="mt-4">
                  <Space size="large">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {enrollments.length}
                      </div>
                      <div className="text-gray-500">Total Enrollments</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {enrollments.filter(e => e.isCompleted).length}
                      </div>
                      <div className="text-gray-500">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {enrollments.filter(e => e.certificateId).length}
                      </div>
                      <div className="text-gray-500">Certificates</div>
                    </div>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Progress Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card title="Course Progress">
            <Table
              columns={columns}
              dataSource={enrollments}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default UserProgress