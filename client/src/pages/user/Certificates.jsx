import React from 'react';
import { Card, Button, Typography, Empty, Row, Col, message } from 'antd';
import { DownloadOutlined, TrophyOutlined, EyeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import UserLayout from '../../components/Layout/UserLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_MY_CERTIFICATES, GET_CERTIFICATE } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const Certificates = () => {
  const { data: certificatesData, isLoading } = useQuery(
    'my-certificates',
    () => getApi(GET_MY_CERTIFICATES)
  );

  const handleAction = async (action, certificateId) => {
    try {
      const response = await getApi(`${GET_CERTIFICATE}/${certificateId}/download`);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      if (action === 'download') {
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificateId}.pdf`;
        a.click();
      } else if (action === 'view') {
        window.open(url, '_blank');
      }

      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(`Action failed: ${error.message}`);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const certificates = certificatesData?.data || [];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <TrophyOutlined className="text-6xl text-yellow-500 mb-4" />
          <Title level={1}>Your Achievements</Title>
          <Text className="text-lg text-gray-500">
            A collection of all your hard-earned certificates.
          </Text>
        </motion.div>

        {certificates.length > 0 ? (
          <Row gutter={[24, 24]}>
            {certificates.map((cert, i) => (
              <Col xs={24} md={12} key={cert._id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="shadow-lg border-0 h-full flex flex-col">
                    <div className="p-6 flex-grow">
                      <Row align="middle" gutter={16}>
                        <Col span={6} className="text-center">
                          <TrophyOutlined className="text-5xl text-yellow-500" />
                        </Col>
                        <Col span={18}>
                          <Text className="text-xs text-gray-500">Certificate of Completion</Text>
                          <Title level={4} className="mt-0 mb-2 truncate">{cert.course.title}</Title>
                          <Text className="text-sm text-gray-600">
                            Issued on {new Date(cert.issuedAt).toLocaleDateString()}
                          </Text>
                        </Col>
                      </Row>
                    </div>
                    <div className="bg-gray-50 p-4 flex justify-around border-t">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleAction('view', cert._id)}
                      >
                        View
                      </Button>
                      <Button
                        type="text"
                        icon={<DownloadOutlined />}
                        onClick={() => handleAction('download', cert._id)}
                      >
                        Download
                      </Button>
                      <Button type="text" icon={<ShareAltOutlined />}>
                        Share
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="text-center py-20 shadow-sm border-0">
              <Empty
                image={<TrophyOutlined style={{ fontSize: 60, color: '#d9d9d9' }} />}
                description={
                  <div>
                    <Title level={3} className="text-gray-700">
                      No Certificates Yet
                    </Title>
                    <Text className="text-gray-500">
                      Complete a course to earn your first certificate.
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
  );
};

export default Certificates;
