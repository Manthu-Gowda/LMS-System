import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Tabs, Button, Typography, Tag, List, Progress, Space, Alert } from 'antd'
import { 
  PlayCircleOutlined, 
  FileTextOutlined, 
  YoutubeOutlined,
  QuestionCircleOutlined,
  LinkOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import UserLayout from '../../components/Layout/UserLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as courseAPI from '../../services/courses'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs

const CourseDetail = () => {
  const { slug } = useParams()
  const [activeContent, setActiveContent] = useState(0)
  const queryClient = useQueryClient()

  const { data: courseData, isLoading } = useQuery(
    ['course', slug],
    () => courseAPI.getCourseBySlug(slug)
  )

  const { data: enrollmentData } = useQuery(
    'my-enrollments',
    courseAPI.getMyEnrollments
  )

  const progressMutation = useMutation(
    ({ enrollmentId, progressData }) => 
      courseAPI.updateProgress(enrollmentId, progressData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-enrollments')
      },
    }
  )

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!courseData) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <Title level={2}>Course not found</Title>
        </div>
      </UserLayout>
    )
  }

  const course = courseData
  const enrollments = enrollmentData || []
  const enrollment = enrollments.find(e => e.course.slug === slug)

  if (!enrollment) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <Title level={2}>Access Denied</Title>
          <Text>You need to enroll in this course to view its content.</Text>
        </div>
      </UserLayout>
    )
  }

  const completedContent = enrollment.progress?.contentCompleted || []
  const progressPercentage = Math.round((completedContent.length / course.content.length) * 100)

  const markContentComplete = (contentIndex) => {
    if (!completedContent.includes(contentIndex)) {
      const newCompleted = [...completedContent, contentIndex]
      progressMutation.mutate({
        enrollmentId: enrollment._id,
        progressData: { contentCompleted: newCompleted }
      })
    }
  }

  const renderContent = (content, index) => {
    const isCompleted = completedContent.includes(index)
    
    switch (content.type) {
      case 'video':
        return (
          <div className="video-container mb-4">
            <video
              controls
              className="w-full"
              onEnded={() => markContentComplete(index)}
            >
              <source src={`${import.meta.env.VITE_API_BASE_URL}${content.url}`} />
              Your browser does not support the video tag.
            </video>
          </div>
        )
      
      case 'youtube':
        const videoId = content.url.split('v=')[1]?.split('&')[0] ||
                       content.url.split('youtu.be/')[1]?.split('?')[0]
        return (
          <div className="video-container mb-4">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                // Auto-mark YouTube videos as completed after a delay
                setTimeout(() => markContentComplete(index), 5000)
              }}
            ></iframe>
          </div>
        )
      
      case 'pdf':
        return (
          <div className="mb-4">
            <embed
              src={`${import.meta.env.VITE_API_BASE_URL}${content.url}`}
              type="application/pdf"
              width="100%"
              height="600px"
              className="border rounded"
              onLoad={() => markContentComplete(index)}
            />
          </div>
        )
      
      case 'text':
        return (
          <Card className="mb-4">
            <Paragraph className="whitespace-pre-wrap">
              {content.content}
            </Paragraph>
            <Button 
              type="primary" 
              ghost 
              onClick={() => markContentComplete(index)}
              disabled={isCompleted}
              icon={isCompleted ? <CheckCircleOutlined /> : null}
            >
              {isCompleted ? 'Completed' : 'Mark as Complete'}
            </Button>
          </Card>
        )
      
      default:
        return null
    }
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <PlayCircleOutlined />
      case 'pdf':
        return <FileTextOutlined />
      case 'youtube':
        return <YoutubeOutlined />
      default:
        return <FileTextOutlined />
    }
  }

  const canTakeMCQ = progressPercentage >= 80 // Must complete 80% of content
  const canSubmitAssignment = enrollment.mcqScore && enrollment.mcqScore >= 70
  const canViewCertificate = enrollment.isCompleted

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Title level={1} className="text-white mb-2">
                  {course.title}
                </Title>
                <Paragraph className="text-blue-100 text-lg mb-4">
                  {course.shortDescription}
                </Paragraph>
                
                <Space size="middle" className="mb-4">
                  <Tag color="orange">{course.difficulty}</Tag>
                  <span className="flex items-center text-blue-100">
                    <ClockCircleOutlined className="mr-1" />
                    {course.estimatedDuration}
                  </span>
                  <span className="text-blue-100">
                    {course.content.length} lessons
                  </span>
                </Space>

                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Text className="text-white font-medium">Your Progress</Text>
                    <Text className="text-white font-bold">{progressPercentage}%</Text>
                  </div>
                  <Progress
                    percent={progressPercentage}
                    strokeColor="#52c41a"
                    trailColor="rgba(255,255,255,0.3)"
                    showInfo={false}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Course Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultActiveKey="overview" size="large">
            <TabPane tab="Overview" key="overview">
              <Card>
                <Title level={3}>About This Course</Title>
                <Paragraph className="text-gray-600 text-lg mb-6">
                  {course.description}
                </Paragraph>

                <Title level={4} className="mb-4">What You'll Learn</Title>
                <List
                  dataSource={course.content}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={getContentIcon(item.type)}
                        title={item.title}
                        description={item.description}
                      />
                      {completedContent.includes(index) && (
                        <CheckCircleOutlined className="text-green-500" />
                      )}
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>

            <TabPane tab="Content" key="content">
              <div className="flex gap-6">
                {/* Content List */}
                <div className="w-1/3">
                  <Card title="Course Content" size="small">
                    <List
                      size="small"
                      dataSource={course.content}
                      renderItem={(item, index) => (
                        <List.Item
                          className={`cursor-pointer ${
                            activeContent === index ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                          onClick={() => setActiveContent(index)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                              {getContentIcon(item.type)}
                              <span className="ml-2">{item.title}</span>
                            </div>
                            {completedContent.includes(index) && (
                              <CheckCircleOutlined className="text-green-500" />
                            )}
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </div>

                {/* Active Content */}
                <div className="flex-1">
                  <Card title={course.content[activeContent]?.title}>
                    {renderContent(course.content[activeContent], activeContent)}
                  </Card>
                </div>
              </div>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <QuestionCircleOutlined />
                  MCQ Quiz
                  {!canTakeMCQ && <Tag color="orange" className="ml-2">Locked</Tag>}
                </span>
              } 
              key="mcq"
            >
              <Card>
                {!canTakeMCQ ? (
                  <Alert
                    message="Complete More Content"
                    description="You need to complete at least 80% of the course content before taking the quiz."
                    type="warning"
                    showIcon
                  />
                ) : enrollment.mcqScore ? (
                  <Alert
                    message={`Quiz Completed - Score: ${enrollment.mcqScore}%`}
                    description={
                      enrollment.mcqScore >= 70
                        ? "Congratulations! You passed the quiz."
                        : "You need 70% to pass. You can retake the quiz."
                    }
                    type={enrollment.mcqScore >= 70 ? "success" : "warning"}
                    showIcon
                  />
                ) : (
                  <div className="text-center py-8">
                    <QuestionCircleOutlined className="text-6xl text-blue-500 mb-4" />
                    <Title level={3}>Ready to Take the Quiz?</Title>
                    <Text type="secondary" className="text-lg block mb-6">
                      Test your knowledge with {course.mcq?.length || 15} questions.
                      You need 70% to pass.
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      href={`/courses/${course.slug}/mcq`}
                    >
                      Start Quiz
                    </Button>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <LinkOutlined />
                  Assignment
                  {!canSubmitAssignment && <Tag color="orange" className="ml-2">Locked</Tag>}
                </span>
              } 
              key="assignment"
            >
              <Card>
                {!canSubmitAssignment ? (
                  <Alert
                    message="Pass the Quiz First"
                    description="You need to pass the MCQ quiz with 70% or higher before submitting your assignment."
                    type="warning"
                    showIcon
                  />
                ) : enrollment.assignment ? (
                  <Alert
                    message="Assignment Submitted"
                    description="Your assignment has been submitted and is being reviewed."
                    type="success"
                    showIcon
                  />
                ) : (
                  <div className="text-center py-8">
                    <LinkOutlined className="text-6xl text-green-500 mb-4" />
                    <Title level={3}>Submit Your Assignment</Title>
                    <Text type="secondary" className="text-lg block mb-6">
                      Share your project or provide relevant links to complete the course.
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      href={`/courses/${course.slug}/assignment`}
                    >
                      Submit Assignment
                    </Button>
                  </div>
                )}
              </Card>
            </TabPane>

            <TabPane 
              tab={
                <span>
                  <TrophyOutlined />
                  Certificate
                  {!canViewCertificate && <Tag color="orange" className="ml-2">Locked</Tag>}
                </span>
              } 
              key="certificate"
            >
              <Card>
                {!canViewCertificate ? (
                  <Alert
                    message="Complete All Requirements"
                    description="Complete the course content, pass the quiz, and submit your assignment to unlock your certificate."
                    type="info"
                    showIcon
                  />
                ) : (
                  <div className="text-center py-8">
                    <TrophyOutlined className="text-6xl text-yellow-500 mb-4" />
                    <Title level={3}>Congratulations!</Title>
                    <Text type="secondary" className="text-lg block mb-6">
                      You have successfully completed this course. Your certificate is ready!
                    </Text>
                    <Button
                      type="primary"
                      size="large"
                      href="/certificates"
                    >
                      View Certificate
                    </Button>
                  </div>
                )}
              </Card>
            </TabPane>
          </Tabs>
        </motion.div>
      </div>
    </UserLayout>
  )
}

export default CourseDetail