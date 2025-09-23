import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Radio, Button, Typography, Progress, Alert, message } from 'antd'
import { ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import UserLayout from '../../components/Layout/UserLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { getApi, postApi } from '../../utils/apiServices'
import { GET_COURSE_BY_ID, GET_MCQ_BY_COURSE_ID, SUBMIT_MCQ } from '../../utils/apiPaths'

const { Title, Text } = Typography

const MCQQuiz = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(null)
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes

  const { data: courseData, isLoading } = useQuery(
    ['course', slug],
    () => getApi(`${GET_COURSE_BY_ID}/${slug}`)
  )

  const { data: mcqData, isLoading: mcqLoading } = useQuery(
    ['mcq', courseData?.data?._id],
    () => getApi(`${GET_MCQ_BY_COURSE_ID}/course/${courseData.data._id}`),
    {
      enabled: !!courseData?.data?._id,
    }
  )

  const submitMutation = useMutation(
    (answers) => postApi(`${SUBMIT_MCQ}/${courseData.data._id}/submit`, answers),
    {
      onSuccess: (response) => {
        setResults(response.data)
        setSubmitted(true)
        queryClient.invalidateQueries('my-enrollments')
        
        if (response.data.score >= 70) {
          message.success('Congratulations! You passed the quiz!')
        } else {
          message.warning('You need 70% to pass. You can retake the quiz.')
        }
      },
      onError: (error) => {
        message.error(error.message || 'Failed to submit quiz')
      },
    }
  )

  // Timer effect
  React.useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !submitted) {
      handleSubmit()
    }
  }, [timeLeft, submitted])

  if (isLoading || mcqLoading) {
    return <LoadingSpinner />
  }

  if (!courseData?.data || !mcqData?.data) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <Title level={2}>Quiz not available</Title>
        </div>
      </UserLayout>
    )
  }

  const questions = mcqData.data
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    })
  }

  const handleSubmit = () => {
    submitMutation.mutate(answers)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  if (submitted && results) {
    return (
      <UserLayout>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="text-center">
              <div className="py-8">
                {results.score >= 70 ? (
                  <CheckCircleOutlined className="text-6xl text-green-500 mb-4" />
                ) : (
                  <CloseCircleOutlined className="text-6xl text-red-500 mb-4" />
                )}
                
                <Title level={2}>
                  {results.score >= 70 ? 'Congratulations!' : 'Quiz Completed'}
                </Title>
                
                <div className="text-6xl font-bold text-blue-600 mb-4">
                  {results.score}%
                </div>
                
                <Text type="secondary" className="text-lg block mb-6">
                  You answered {results.correctAnswers} out of {questions.length} questions correctly
                </Text>
                
                {results.score >= 70 ? (
                  <Alert
                    message="You passed the quiz!"
                    description="You can now proceed to submit your assignment."
                    type="success"
                    showIcon
                    className="mb-6"
                  />
                ) : (
                  <Alert
                    message="You need 70% to pass"
                    description="Don't worry, you can retake the quiz anytime."
                    type="warning"
                    showIcon
                    className="mb-6"
                  />
                )}
                
                <div className="space-x-4">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate(`/courses/${slug}`)}
                  >
                    Back to Course
                  </Button>
                  
                  {results.score < 70 && (
                    <Button
                      size="large"
                      onClick={() => window.location.reload()}
                    >
                      Retake Quiz
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <Title level={2} className="mb-1">
                  {courseData.data.title} - Quiz
                </Title>
                <Text type="secondary">
                  Question {currentQuestion + 1} of {questions.length}
                </Text>
              </div>
              
              <div className="text-right">
                <div className="flex items-center text-red-500 mb-2">
                  <ClockCircleOutlined className="mr-1" />
                  <Text className="text-red-500 font-mono text-lg">
                    {formatTime(timeLeft)}
                  </Text>
                </div>
                <Progress
                  percent={Math.round(((currentQuestion + 1) / questions.length) * 100)}
                  strokeColor="#1890ff"
                  size="small"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Question Card */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card>
            <Title level={3} className="mb-6">
              {questions[currentQuestion].question}
            </Title>
            
            <Radio.Group
              value={answers[currentQuestion]}
              onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              className="w-full"
            >
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <Radio
                    key={index}
                    value={option}
                    className="flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="ml-2">{option}</span>
                  </Radio>
                ))}
              </div>
            </Radio.Group>
          </Card>
        </motion.div>

        {/* Navigation */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <Text type="secondary">
                Answered: {getAnsweredCount()} / {questions.length}
              </Text>
            </div>
            
            <div className="space-x-4">
              <Button
                disabled={currentQuestion === 0}
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
              >
                Previous
              </Button>
              
              {currentQuestion < questions.length - 1 ? (
                <Button
                  type="primary"
                  onClick={() => setCurrentQuestion(currentQuestion + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={submitMutation.isLoading}
                  disabled={getAnsweredCount() === 0}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Question Navigator */}
        <Card className="mt-6">
          <Title level={4} className="mb-4">Question Navigator</Title>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                size="small"
                type={currentQuestion === index ? 'primary' : answers[index] ? 'default' : 'dashed'}
                onClick={() => setCurrentQuestion(index)}
                className={`w-full ${answers[index] ? 'bg-green-100 border-green-300' : ''}`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </UserLayout>
  )
}

export default MCQQuiz
