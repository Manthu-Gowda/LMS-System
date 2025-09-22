import React from 'react'
import { Card, Tag, Progress, Button } from 'antd'
import { PlayCircleOutlined, FileTextOutlined, YoutubeOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const { Meta } = Card

const CourseCard = ({ course, enrollment, onEnroll, showProgress = false }) => {
  const navigate = useNavigate()

  const getContentIcons = (content) => {
    const icons = []
    content.forEach((item) => {
      if (item.type === 'video') {
        icons.push(<PlayCircleOutlined key="video" />)
      } else if (item.type === 'pdf') {
        icons.push(<FileTextOutlined key="pdf" />)
      } else if (item.type === 'youtube') {
        icons.push(<YoutubeOutlined key="youtube" />)
      }
    })
    return icons.slice(0, 3) // Show max 3 icons
  }

  const getProgressPercentage = () => {
    if (!enrollment) return 0
    const totalContent = course.content?.length || 1
    const completedContent = enrollment.progress?.contentCompleted?.length || 0
    return Math.round((completedContent / totalContent) * 100)
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return 'green'
      case 'intermediate':
        return 'orange'
      case 'advanced':
        return 'red'
      default:
        return 'blue'
    }
  }

  const handleCardClick = () => {
    if (enrollment) {
      navigate(`/courses/${course.slug}`)
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        hoverable={!!enrollment}
        onClick={enrollment ? handleCardClick : undefined}
        cover={
          <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <div className="text-4xl text-white opacity-80">
              {getContentIcons(course.content || [])}
            </div>
          </div>
        }
        actions={
          !enrollment
            ? [
                <Button
                  key="enroll"
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEnroll(course._id)
                  }}
                  block
                >
                  Enroll Now
                </Button>,
              ]
            : []
        }
        className="h-full course-card"
      >
        <Meta
          title={
            <div className="flex items-start justify-between">
              <span className="text-base font-semibold line-clamp-2">
                {course.title}
              </span>
              <Tag color={getDifficultyColor(course.difficulty)} className="ml-2">
                {course.difficulty}
              </Tag>
            </div>
          }
          description={
            <div className="space-y-3">
              <p className="text-gray-600 text-sm line-clamp-2">
                {course.shortDescription}
              </p>
              
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                <span className="flex items-center">
                  <ClockCircleOutlined className="mr-1" />
                  {course.estimatedDuration}
                </span>
                <span>{course.content?.length || 0} lessons</span>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag} size="small">
                      {tag}
                    </Tag>
                  ))}
                  {course.tags.length > 3 && (
                    <Tag size="small">+{course.tags.length - 3}</Tag>
                  )}
                </div>
              )}

              {showProgress && enrollment && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium">
                      {getProgressPercentage()}%
                    </span>
                  </div>
                  <Progress
                    percent={getProgressPercentage()}
                    showInfo={false}
                    size="small"
                    strokeColor={{
                      from: '#1890ff',
                      to: '#52c41a',
                    }}
                  />
                  
                  {enrollment.isCompleted && (
                    <Tag color="success" className="mt-2">
                      Completed
                    </Tag>
                  )}
                </div>
              )}
            </div>
          }
        />
      </Card>
    </motion.div>
  )
}

export default CourseCard