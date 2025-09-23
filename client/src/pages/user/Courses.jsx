import React, { useState, useEffect } from 'react';
import { Row, Col, Input, Card, Empty, message, Radio, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import UserLayout from '../../components/Layout/UserLayout';
import CourseCard from '../../components/CourseCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, postApi } from '../../utils/apiServices';
import { GET_COURSES, GET_MY_ENROLLMENTS, ENROLL_IN_COURSE } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const response = await getApi(GET_COURSES, { isPublished: true });
      setCourses(response.data || []);
    } catch (error) {
      message.error('Failed to fetch courses');
    }
  };

  const fetchEnrollments = async () => {
    try {
      const response = await getApi(GET_MY_ENROLLMENTS);
      setEnrollments(response.data || []);
    } catch (error) {
      message.error('Failed to fetch enrollments');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchCourses(), fetchEnrollments()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await postApi(ENROLL_IN_COURSE, { courseId });
      message.success('Successfully enrolled in course!');
      fetchEnrollments();
    } catch (error) {
      message.error(error.message || 'Failed to enroll');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course._id));

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popularity') return (b.enrollments?.length || 0) - (a.enrollments?.length || 0);
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <UserLayout>
      <div className="mb-8">
        <Title level={2}>Explore Courses</Title>
        <Text>Find the perfect course to expand your knowledge.</Text>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={24}>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <Input
                    placeholder="Search courses..."
                    prefix={<SearchOutlined className="site-form-item-icon" />}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ maxWidth: 300, width: '100%' }}
                    allowClear
                />
                <Radio.Group value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <Radio.Button value="popularity">Popular</Radio.Button>
                    <Radio.Button value="newest">Newest</Radio.Button>
                </Radio.Group>
            </div>

          {sortedCourses.length > 0 ? (
            <Row gutter={[24, 24]}>
              {sortedCourses.map((course) => (
                <Col xs={24} sm={12} lg={8} key={course._id}>
                   <CourseCard
                        course={course}
                        enrollment={enrollments.find(e => e.course._id === course._id)}
                        onEnroll={() => handleEnroll(course._id)}
                        isEnrolled={enrolledCourseIds.has(course._id)}
                    />
                </Col>
              ))}
            </Row>
          ) : (
            <Card className="text-center py-16 shadow-lg border-0">
                <Empty description="No courses match your search. Try a different term!" />
            </Card>
          )}
        </Col>
      </Row>
    </UserLayout>
  );
};

export default Courses;
