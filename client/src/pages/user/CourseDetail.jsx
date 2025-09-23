import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Typography,
  Tag,
  List,
  Progress,
  Space,
  Alert,
  Avatar,
  Rate,
} from 'antd';
import {
  PlayCircleOutlined,
  FileTextOutlined,
  YoutubeOutlined,
  QuestionCircleOutlined,
  ExperimentOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BookOutlined,
  StarFilled,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import UserLayout from '../../components/Layout/UserLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, putApi } from '../../utils/apiServices';
import {
  GET_COURSES,
  GET_MY_ENROLLMENTS,
  UPDATE_ENROLLMENT_PROGRESS,
} from '../../utils/apiPaths';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const CourseDetail = () => {
  const { slug } = useParams();
  const [activeContent, setActiveContent] = useState(null);
  const queryClient = useQueryClient();

  const { data: courseData, isLoading } = useQuery(
    ['course', slug],
    () => getApi(`${GET_COURSES}/${slug}`)
  );

  const { data: enrollmentData } = useQuery(
    'my-enrollments',
    () => getApi(GET_MY_ENROLLMENTS)
  );

  const progressMutation = useMutation(
    ({ enrollmentId, contentId }) =>
      putApi(`${UPDATE_ENROLLMENT_PROGRESS}/${enrollmentId}/progress`, {
        contentId,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-enrollments');
      },
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const course = courseData?.data;
  const enrollment = enrollmentData?.data?.find((e) => e.course.slug === slug);

  if (!course || !enrollment) {
    return (
      <UserLayout>
        <div className="text-center py-16">
          <Title level={2}>Course not found or not enrolled</Title>
        </div>
      </UserLayout>
    );
  }

  const completedContent = new Set(enrollment.progress?.contentCompleted || []);
  const progressPercentage = Math.round(
    (completedContent.size / course.content.length) * 100
  );

  const handleContentSelect = (content) => {
    setActiveContent(content);
    if (!completedContent.has(content._id)) {
      progressMutation.mutate({
        enrollmentId: enrollment._id,
        contentId: content._id,
      });
    }
  };

  const renderMedia = (content) => {
    switch (content.type) {
      case 'video':
        return (
          <video controls className="w-full rounded-lg" src={`${import.meta.env.VITE_API_BASE_URL}${content.url}`} />
        );
      case 'youtube':
        const videoId = content.url.split('v=')[1];
        return (
          <iframe
            className="w-full rounded-lg aspect-video"
            src={`https://www.youtube.com/embed/${videoId}`}
            allowFullScreen
          />
        );
      case 'pdf':
        return (
          <embed
            src={`${import.meta.env.VITE_API_BASE_URL}${content.url}`}
            type="application/pdf"
            className="w-full h-[600px] rounded-lg"
          />
        );
      case 'text':
        return <Paragraph className="p-4 bg-gray-50 rounded-lg">{content.content}</Paragraph>;
      default:
        return <p>Unsupported content type.</p>;
    }
  };

  const contentIcons = {
    video: <PlayCircleOutlined />,
    pdf: <FileTextOutlined />,
    youtube: <YoutubeOutlined />,
    text: <BookOutlined />,
  };

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        <Row gutter={[32, 32]}>
          <Col xs={24} lg={16}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-lg border-0 mb-6">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  {activeContent ? (
                    renderMedia(activeContent)
                  ) : (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-lg" />
                  )}
                </div>
                <Title level={3}>{activeContent?.title || course.title}</Title>
                <Text className="text-gray-500">
                  {activeContent?.description || course.shortDescription}
                </Text>
              </Card>

              <Card className="shadow-lg border-0">
                <Tabs defaultActiveKey="overview">
                  <TabPane tab="Overview" key="overview">
                    <Title level={4}>About This Course</Title>
                    <Paragraph>{course.description}</Paragraph>
                    <Title level={4} className="mt-6">What You'll Learn</Title>
                    <Row gutter={[16, 16]}>
                      {course.tags.map(tag => (
                        <Col span={12} key={tag}>
                          <CheckCircleOutlined className="text-green-500 mr-2" /> {tag}
                        </Col>
                      ))}
                    </Row>
                  </TabPane>
                  <TabPane tab="Instructor" key="instructor">
                    <div className="flex items-center">
                      <Avatar size={64} src="https://i.pravatar.cc/150" />
                      <div className="ml-4">
                        <Title level={4}>John Doe</Title>
                        <Text>Lead Instructor</Text>
                      </div>
                    </div>
                  </TabPane>
                  <TabPane tab="Reviews" key="reviews">
                    <Rate defaultValue={4.5} disabled />
                  </TabPane>
                </Tabs>
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-lg border-0">
                <Title level={4}>Course Content</Title>
                <Progress percent={progressPercentage} className="mb-4" />
                <List
                  dataSource={course.content}
                  renderItem={(item) => (
                    <List.Item
                      onClick={() => handleContentSelect(item)}
                      className={`cursor-pointer rounded-lg p-2 ${activeContent?._id === item._id ? 'bg-blue-50' : ''}`}
                    >
                      <List.Item.Meta
                        avatar={contentIcons[item.type]}
                        title={item.title}
                      />
                      {completedContent.has(item._id) && (
                        <CheckCircleOutlined className="text-green-500" />
                      )}
                    </List.Item>
                  )}
                />
              </Card>
              
              <Card className="shadow-lg border-0 mt-6 text-center">
                <TrophyOutlined className="text-5xl text-yellow-500 mb-4" />
                <Title level={3}>Certificate</Title>
                {enrollment.isCompleted ? (
                   <Button type="primary" href="/certificates">View Certificate</Button>
                ): (
                  <Text>Complete the course to unlock your certificate.</Text>
                )}
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </UserLayout>
  );
};

export default CourseDetail;
