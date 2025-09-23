import React, { useState } from 'react';
import { Row, Col, Input, Select, Card, Empty, message, Tag, Radio } from 'antd';
import { SearchOutlined, FunnelPlotOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import UserLayout from '../../components/Layout/UserLayout';
import CourseCard from '../../components/CourseCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi, postApi } from '../../utils/apiServices';
import { GET_COURSES, GET_MY_ENROLLMENTS, ENROLL_IN_COURSE } from '../../utils/apiPaths';

const { Option } = Select;

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    difficulty: [],
    tags: [],
  });
  const [sortBy, setSortBy] = useState('popularity');
  const queryClient = useQueryClient();

  const { data: coursesData, isLoading: coursesLoading } = useQuery(
    'courses',
    () => getApi(GET_COURSES, { isPublished: true })
  );

  const { data: enrollmentsData } = useQuery(
    'my-enrollments',
    () => getApi(GET_MY_ENROLLMENTS)
  );

  const enrollMutation = useMutation(
    (courseId) => postApi(ENROLL_IN_COURSE, { courseId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('my-enrollments');
        message.success('Successfully enrolled in course!');
      },
      onError: (error) => {
        message.error(error.message || 'Failed to enroll');
      },
    }
  );

  if (coursesLoading) {
    return <LoadingSpinner />;
  }

  const courses = coursesData?.data || [];
  const enrollments = enrollmentsData?.data || [];
  const enrolledCourseIds = new Set(enrollments.map((e) => e.course._id));

  const allTags = [...new Set(courses.flatMap((c) => c.tags))];

  const filteredAndSortedCourses = courses
    .filter((course) => {
      const searchMatch = 
        searchTerm === '' ||
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
      
      const difficultyMatch =
        filters.difficulty.length === 0 ||
        filters.difficulty.includes(course.difficulty);

      const tagsMatch =
        filters.tags.length === 0 ||
        filters.tags.every((tag) => course.tags.includes(tag));

      return searchMatch && difficultyMatch && tagsMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Explore Our Courses</h1>
          <p className="text-lg text-gray-500">
            Find the perfect course to boost your skills.
          </p>
        </motion.div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Card className="shadow-md border-0">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              <div className="mb-6">
                <h4 className="font-medium mb-2">Difficulty</h4>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select difficulty"
                  onChange={(value) => setFilters({ ...filters, difficulty: value })}
                  style={{ width: '100%' }}
                >
                  <Option value="beginner">Beginner</Option>
                  <Option value="intermediate">Intermediate</Option>
                  <Option value="advanced">Advanced</Option>
                </Select>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <Select
                  mode="multiple"
                  allowClear
                  placeholder="Select tags"
                  onChange={(value) => setFilters({ ...filters, tags: value })}
                  style={{ width: '100%' }}
                >
                  {allTags.map((tag) => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={18}>
            <Card className="shadow-md border-0 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <Input
                  placeholder="Search courses..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-4 md:mb-0 md:max-w-xs"
                  allowClear
                />
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Sort by:</span>
                  <Radio.Group
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <Radio.Button value="popularity">Popularity</Radio.Button>
                    <Radio.Button value="newest">Newest</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </Card>

            {filteredAndSortedCourses.length > 0 ? (
              <Row gutter={[24, 24]}>
                {filteredAndSortedCourses.map((course, i) => (
                  <Col xs={24} sm={12} lg={8} key={course._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CourseCard
                        course={course}
                        enrollment={enrollments.find((e) => e.course._id === course._id)}
                        onEnroll={() => enrollMutation.mutate(course._id)}
                        showProgress={enrolledCourseIds.has(course._id)}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-gray-500">
                      No courses found. Try adjusting your filters.
                    </span>
                  }
                  className="bg-white p-16 rounded-md shadow-sm"
                />
              </motion.div>
            )}
          </Col>
        </Row>
      </div>
    </UserLayout>
  );
};

export default Courses;
