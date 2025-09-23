import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Empty, Row, Col, message, Tooltip } from 'antd';
import { DownloadOutlined, TrophyOutlined, EyeOutlined, ShareAltOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../components/Layout/UserLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_MY_CERTIFICATES, GET_CERTIFICATE } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const Certificates = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await getApi(GET_MY_CERTIFICATES);
        setCertificates(response.data || []);
      } catch (error) {
        message.error('Failed to fetch certificates');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleAction = async (action, certificateId) => {
    try {
      const response = await getApi(`${GET_CERTIFICATE}/${certificateId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      if (action === 'download') {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate-${certificateId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else if (action === 'view') {
        window.open(url, '_blank');
      }
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error(`Action failed: ${error.message}`);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <UserLayout>
      <div className="mb-8">
        <Title level={2}>Your Achievements</Title>
        <Text>Congratulations on your well-deserved success.</Text>
      </div>

      {certificates.length > 0 ? (
        <Row gutter={[24, 24]}>
          {certificates.map((cert) => (
            <Col xs={24} md={12} key={cert._id}>
              <motion.div whileHover={{ translateY: -5 }}>
                <Card className="shadow-lg border-0 overflow-hidden">
                  <div className="p-5">
                    <Row align="middle" gutter={16}>
                      <Col>
                        <TrophyOutlined style={{ fontSize: '48px', color: '#ffc107' }}/>
                      </Col>
                      <Col flex={1}>
                        <Title level={5} className="mb-1" ellipsis>{cert.course.title}</Title>
                        <Text type="secondary" className="text-sm">Issued on: {new Date(cert.issuedAt).toLocaleDateString()}</Text>
                      </Col>
                    </Row>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 flex justify-end space-x-2">
                    <Tooltip title="View Certificate">
                      <Button icon={<EyeOutlined />} onClick={() => handleAction('view', cert._id)} />
                    </Tooltip>
                    <Tooltip title="Download">
                      <Button icon={<DownloadOutlined />} onClick={() => handleAction('download', cert._id)} />
                    </Tooltip>
                    <Tooltip title="Share">
                      <Button icon={<ShareAltOutlined />} onClick={() => message.info('Sharing feature coming soon!')} />
                    </Tooltip>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center py-20 shadow-lg border-0">
            <Empty
                image={<SafetyCertificateOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                description={
                <>
                    <Title level={4}>No Certificates to Show</Title>
                    <Text>Your hard work pays off with certificates! Complete courses to see them here.</Text>
                </>
                }
            >
                <Button type="primary" size="large" onClick={() => navigate('/courses')}>
                    Find a Course
                </Button>
            </Empty>
        </Card>
      )}
    </UserLayout>
  );
};

export default Certificates;
