import React from 'react'
import { Card, Button, Typography, Empty, Tag } from 'antd'
import { DownloadOutlined, TrophyOutlined, EyeOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import { useQuery } from 'react-query'

import UserLayout from '../../components/Layout/UserLayout'
import LoadingSpinner from '../../components/LoadingSpinner'
import * as courseAPI from '../../services/courses'

const { Title, Text } = Typography

const Certificates = () => {
  const { data: certificatesData, isLoading } = useQuery(
    'my-certificates',
    courseAPI.getMyCertificates
  )

  const handleDownload = async (certificateId) => {
    try {
      const response = await courseAPI.getCertificate(certificateId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificateId}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const handleView = async (certificateId) => {
    try {
      const response = await courseAPI.getCertificate(certificateId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('View failed:', error)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  const certificates = certificatesData?.data || []

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="text-center">
            <TrophyOutlined className="text-6xl text-yellow-500 mb-4" />
            <Title level={1}>Your Certificates</Title>
            <Text type="secondary" className="text-lg">
              Celebrate your achievements and showcase your skills
            </Text>
          </div>
        </motion.div>

        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate, index) => (
              <motion.div
                key={certificate._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
              >
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="h-48 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
                      <TrophyOutlined className="text-6xl text-white" />
                    </div>
                  }
                  actions={[
                    <Button
                      key="view"
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => handleView(certificate._id)}
                    >
                      View
                    </Button>,
                    <Button
                      key="download"
                      type="text"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(certificate._id)}
                    >
                      Download
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Text strong className="text-lg">
                            Certificate of Completion
                          </Text>
                          <Tag color="gold">Verified</Tag>
                        </div>
                        <Text className="text-base text-gray-700">
                          {certificate.course.title}
                        </Text>
                      </div>
                    }
                    description={
                      <div className="space-y-3 mt-4">
                        <div>
                          <Text type="secondary" className="text-xs">
                            Certificate ID
                          </Text>
                          <div className="font-mono text-sm">
                            {certificate.certificateId}
                          </div>
                        </div>
                        
                        <div>
                          <Text type="secondary" className="text-xs">
                            Issued Date
                          </Text>
                          <div>
                            {new Date(certificate.issuedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div>
                          <Text type="secondary" className="text-xs">
                            Recipient
                          </Text>
                          <div>{certificate.user.name}</div>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Card className="text-center py-16">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={3} type="secondary">
                      No Certificates Yet
                    </Title>
                    <Text type="secondary" className="text-lg">
                      Complete courses to earn certificates and showcase your achievements.
                    </Text>
                  </div>
                }
              >
                <Button type="primary" size="large" href="/courses">
                  Explore Courses
                </Button>
              </Empty>
            </Card>
          </motion.div>
        )}
      </div>
    </UserLayout>
  )
}

export default Certificates