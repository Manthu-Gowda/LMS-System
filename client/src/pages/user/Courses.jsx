import React, { useState } from 'react'
import { Row, Col, Input, Select, Card, Empty, message } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import UserLayout from '../../components/Layout/UserLayout'
import CourseCard from '../../components/CourseCard'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as courseAPI from '../../services/courses'

const { Option } = Select

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const queryClient = useQueryClient()

  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    'courses',
    () => courseAPI.getCourses({ isPublished: true })
  )

  const { data: enrollmentsData } = useQuery(
    'my-enrollments',
    courseAPI.getMyEnrollments
  )

  const enrollMutation = useMutation(
    courseAPI.enrollInCourse,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-enrollments')
        message.success('Successfully enrolled in course!')
      },
      onError: (error) => {
        message.error(error.response?.data?.message || 'Failed to enroll')
      },
    }
  )

  const courses = coursesData?.data || []
  const enrollments = enrollmentsData?.data || []
  
  // Create a map of enrolled course IDs for quick lookup
  const enrolledCourseIds = new Set(
    enrollments.map(enrollment => enrollment.course._id)
  )

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.tags || []).some(tag => 
                           tag.toLowerCase().includes(searchTerm.toLowerCase())
                         )
    
    const matchesDifficulty = !difficultyFilter || course.difficulty === difficultyFilter

    return matchesSearch && matchesDifficulty
  })

  const handleEnroll = (courseId) => {
    enrollMutation.mutate(courseId)
  }

  if (coursesLoading) {
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
          <h1 className="text-3xl font-bold mb-2">Course Catalog</h1>
          <p className="text-gray-600 text-lg">
            Discover and enroll in courses to advance your skills
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="mb-6">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={12}>
                <Input
                  size="large"
                  placeholder="Search courses, topics, or tags..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={6}>
                <Select
                  size="large"
                  placeholder="Difficulty Level"
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
                  allowClear
                  className="w-full"
                  suffixIcon={<FilterOutlined />}
                >
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </Col>
              <Col xs={24} md={6}>
                <div className="text-center text-gray-600">
                  {filteredCourses.length} of {courses.length} courses
                </div>
              </Col>
            </Row>
          </Card>
        </motion.div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <Row gutter={[24, 24]}>
            {filteredCourses.map((course, index) => (
              <Col xs={24} sm={12} lg={8} key={course._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index % 6), duration: 0.5 }}
                >
                  <CourseCard
                    course={course}
                    enrollment={enrollments.find(e => e.course._id === course._id)}
                    onEnroll={handleEnroll}
                    showProgress={enrolledCourseIds.has(course._id)}
                  />
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Empty
              description={
                searchTerm || difficultyFilter
                  ? 'No courses match your search criteria'
                  : 'No courses available'
              }
              className="py-16"
            />
          </motion.div>
        )}
      </div>
    </UserLayout>
  )
}

export default Courses