import React from 'react'
import { Row, Col, Card, Button, Typography, Badge } from 'antd'
import { PlayCircleOutlined, TrophyOutlined, BookOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

import UserLayout from '../../components/Layout/UserLayout'
import CourseCard from '../../components/CourseCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import ProgressRing from '../../components/ProgressRing'
import * as courseAPI from '../../services/courses'

const { Title, Text } = Typography

const Dashboard = () => {
  const navigate = useNavigate()

  const { data: enrollments, isLoading } = useQuery(
    'my-enrollments',
    courseAPI.getMyEnrollments
  )

  const enrollmentData = enrollments?.data || []
  const inProgressCourses = enrollmentData.filter(e => !e.isCompleted)
  const completedCourses = enrollmentData.filter(e => e.isCompleted)

  const getTotalProgress = () => {
    if (enrollmentData.length === 0) return 0
    const totalProgress = enrollmentData.reduce((sum, enrollment) => {
      const courseContent = enrollment.course.content?.length || 1
      const completedContent = enrollment.progress?.contentCompleted?.length || 0
      return sum + (completedContent / courseContent)
    }, 0)
    return (totalProgress / enrollmentData.length) * 100
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Title level={1} className="mb-2">
            Welcome to Your Learning Dashboard
          </Title>
          <Text type="secondary" className="text-lg">
            Track your progress and continue your learning journey
          </Text>
        </motion.div>

        {/* Stats Cards */}
        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="text-center">
                <div className="p-4">
                  <BookOutlined className="text-4xl text-blue-600 mb-3" />
                  <Title level={2} className="mb-1">
                    {enrollmentData.length}
                  </Title>
                  <Text type="secondary">Enrolled Courses</Text>
                </div>
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="text-center">
                <div className="p-4">
                  <TrophyOutlined className="text-4xl text-green-600 mb-3" />
                  <Title level={2} className="mb-1">
                    {completedCourses.length}
                  </Title>
                  <Text type="secondary">Completed</Text>
                </div>
              </Card>
            </motion.div>
          </Col>
          
          <Col xs={24} sm={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="text-center">
                <div className="p-4">
                  <ProgressRing
                    size={80}
                    progress={getTotalProgress()}
                    strokeWidth={6}
                  />
                  <div className="mt-3">
                    <Text type="secondary">Overall Progress</Text>
                  </div>
                </div>
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Continue Learning Section */}
        {inProgressCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Title level={2} className="mb-0">
                Continue Learning
              </Title>
              <Button
                type="link"
                onClick={() => navigate('/courses')}
                icon={<PlayCircleOutlined />}
              >
                View All
              </Button>
            </div>
            
            <Row gutter={[24, 24]}>
              {inProgressCourses.slice(0, 3).map((enrollment) => (
                <Col xs={24} md={8} key={enrollment._id}>
                  <CourseCard
                    course={enrollment.course}
                    enrollment={enrollment}
                    showProgress={true}
                  />
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Completed Courses */}
        {completedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <Title level={2} className="mb-0">
                Completed Courses
                <Badge
                  count={completedCourses.length}
                  style={{ backgroundColor: '#52c41a', marginLeft: 12 }}
                />
              </Title>
              <Button
                type="link"
                onClick={() => navigate('/certificates')}
                icon={<TrophyOutlined />}
              >
                View Certificates
              </Button>
            </div>
            
            <Row gutter={[24, 24]}>
              {completedCourses.slice(0, 3).map((enrollment) => (
                <Col xs={24} md={8} key={enrollment._id}>
                  <CourseCard
                    course={enrollment.course}
                    enrollment={enrollment}
                    showProgress={true}
                  />
                </Col>
              ))}
            </Row>
          </motion.div>
        )}

        {/* Empty State */}
        {enrollmentData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="text-center py-16">
              <BookOutlined className="text-6xl text-gray-400 mb-6" />
              <Title level={3} type="secondary">
                Start Your Learning Journey
              </Title>
              <Text type="secondary" className="text-lg block mb-8">
                You haven't enrolled in any courses yet. Browse our course catalog to get started.
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/courses')}
                icon={<PlayCircleOutlined />}
              >
                Explore Courses
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </UserLayout>
  )
}

export default Dashboard