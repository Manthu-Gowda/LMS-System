import React from 'react';
import { Row, Col, Card, Button, Typography, Badge, Progress, List, Avatar } from 'antd';
import {
  PlayCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  FireOutlined,
  StarOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import UserLayout from '../../components/Layout/UserLayout';
import CourseCard from '../../components/CourseCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_MY_ENROLLMENTS } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const StatCard = ({ icon, title, value, color }) => (
  <motion.div whileHover={{ translateY: -5 }} className="h-full">
    <Card className="shadow-md border-0 h-full">
      <div className="flex items-center">
        <div className={`text-3xl text-${color}-500`}>{icon}</div>
        <div className="ml-4">
          <Text className="text-gray-500">{title}</Text>
          <Title level={3} className="mt-0">
            {value}
          </Title>
        </div>
      </div>
    </Card>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: enrollments, isLoading } = useQuery(
    'my-enrollments',
    () => getApi(GET_MY_ENROLLMENTS)
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const enrollmentData = enrollments?.data || [];
  const inProgressCourses = enrollmentData.filter((e) => !e.isCompleted);
  const completedCourses = enrollmentData.filter((e) => e.isCompleted);

  const leaderboardData = [
    { name: 'Alex Ray', score: 2400, avatar: <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /> },
    { name: 'Jane Doe', score: 2100, avatar: <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704e" /> },
    { name: 'John Smith', score: 1800, avatar: <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704f" /> },
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Title level={2} className="mb-1">
            Welcome Back, User!
          </Title>
          <Text className="text-lg text-gray-500">
            Let's continue your learning journey.
          </Text>
        </motion.div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              icon={<BookOutlined />}
              title="Enrolled Courses"
              value={enrollmentData.length}
              color="blue"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              icon={<TrophyOutlined />}
              title="Completed Courses"
              value={completedCourses.length}
              color="green"
            />
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <StatCard
              icon={<FireOutlined />}
              title="Points Earned"
              value="1,200"
              color="red"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Card className="shadow-md border-0">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4} className="mb-0">
                    Continue Learning
                  </Title>
                  <Button type="link" onClick={() => navigate('/courses')}>
                    View All
                  </Button>
                </div>
                {inProgressCourses.length > 0 ? (
                  <div className="flex overflow-x-auto space-x-4 pb-4">
                    {inProgressCourses.map((enrollment) => (
                      <motion.div key={enrollment._id} className="min-w-[300px]">
                        <CourseCard
                          course={enrollment.course}
                          enrollment={enrollment}
                          showProgress
                        />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOutlined className="text-5xl text-gray-300" />
                    <Text className="block mt-4 text-gray-500">
                      You have no courses in progress.
                    </Text>
                    <Button
                      type="primary"
                      className="mt-4"
                      icon={<PlayCircleOutlined />}
                      onClick={() => navigate('/courses')}
                    >
                      Explore Courses
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-md border-0">
                <div className="flex justify-between items-center mb-4">
                  <Title level={4} className="mb-0">
                    What's New
                  </Title>
                  <Button type="link">See All</Button>
                </div>
                <List
                  itemLayout="horizontal"
                  dataSource={[{ title: 'New Course: Advanced React Testing', description: 'Master testing with Jest and React Testing Library.' }]}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<StarOutlined />} />}
                        title={<a href="#">{item.title}</a>}
                        description={item.description}
                      />
                      <Button type="text" icon={<ArrowRightOutlined />} />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>

          <Col xs={24} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="shadow-md border-0">
                <Title level={4} className="mb-4">
                  Leaderboard
                </Title>
                <List
                  itemLayout="horizontal"
                  dataSource={leaderboardData}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={item.avatar}
                        title={<a href="#">{item.name}</a>}
                        description={`${item.score} points`}
                      />
                      <Badge count={`#${index + 1}`} style={{ backgroundColor: '#52c41a' }} />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </div>
    </UserLayout>
  );
};

export default Dashboard;
