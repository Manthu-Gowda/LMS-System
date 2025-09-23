import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Typography, Progress, List, Avatar } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; 
import {
  PlayCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  LineChartOutlined,
  StarOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import UserLayout from '../../components/Layout/UserLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_MY_ENROLLMENTS } from '../../utils/apiPaths';

const { Title, Text, Paragraph } = Typography;

const StatCard = ({ icon, title, value, colorClass }) => (
  <Card className="shadow-lg border-0 h-full">
    <div className="flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
      <div>
        <Text className="text-md text-gray-500">{title}</Text>
        <Title level={4} className="mt-0">{value}</Title>
      </div>
    </div>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await getApi(GET_MY_ENROLLMENTS);
        setEnrollments(response.data || []);
      } catch (error) {
        console.error("Failed to fetch enrollments", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  console.log("enrollments", enrollments)

  if (isLoading) return <LoadingSpinner />;

  const inProgressCourses = enrollments.filter(e => !e.isCompleted);
  const completedCourses = enrollments.filter(e => e.isCompleted);

  const recentActivity = [
    { text: 'You completed the "Introduction to React" course.', time: '2 days ago' },
    { text: 'A new course "Advanced Node.js" has been published.', time: '3 days ago' },
  ];

  return (
    <UserLayout>
      <Title level={2} className="mb-4">Welcome Back, User!</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <motion.div whileHover={{ translateY: -5 }}>
            <Card
              className="shadow-xl border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white"
              style={{ minHeight: '200px' }}
            >
              <Title level={3} className="text-white">Keep up the great work!</Title>
              <Paragraph className="text-blue-100">You are on a roll. Here is an overview of your progress.</Paragraph>
              <Button type="primary" size="large" onClick={() => navigate('/courses')}>Explore Courses</Button>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} md={8}>
          <StatCard icon={<BookOutlined className="text-white" />} title="Enrolled Courses" value={enrollments.length} colorClass="bg-blue-500" />
        </Col>
        <Col xs={24} md={8}>
          <StatCard icon={<TrophyOutlined className="text-white" />} title="Completed Courses" value={completedCourses.length} colorClass="bg-green-500" />
        </Col>
        <Col xs={24} md={8}>
          <StatCard icon={<LineChartOutlined className="text-white" />} title="Overall Progress" value={`${Math.round(Math.random() * 20 + 10)}%`} colorClass="bg-purple-500" />
        </Col>

        <Col xs={24} lg={16}>
          <Card title="Continue Learning" className="shadow-lg border-0 h-full">
            {inProgressCourses.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={inProgressCourses.slice(0, 3)}
                renderItem={item => (
                  <List.Item
                    actions={[<Button type="text" icon={<RightOutlined />} onClick={() => navigate(`/courses/${item.course.slug}`)} />]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={item.course.thumbnail} />}
                      title={<Link to={`/courses/${item.course.slug}`}>{item.course.title}</Link>}
                      description={<Progress percent={Math.round((item.progress.contentCompleted.length / item.course.content.length) * 100)} size="small" />}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-8">
                <BookOutlined className="text-4xl text-gray-300" />
                <Text className="block mt-2 text-gray-500">No courses in progress. Time to learn something new!</Text>
                <Button type="primary" className="mt-4" onClick={() => navigate('/courses')}>Explore Courses</Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Recent Activity" className="shadow-lg border-0 h-full">
            <List
              dataSource={recentActivity}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<StarOutlined />} />}
                    title={item.text}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </UserLayout>
  );
};

export default Dashboard;
