import React from 'react';
import { Card, Tag, Progress, Button, Avatar } from 'antd';
import {
  PlayCircleOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, enrollment, onEnroll, showProgress = false }) => {
  const navigate = useNavigate();

  const getProgressPercentage = () => {
    if (!enrollment || !course.content?.length) return 0;
    return Math.round(
      (enrollment.progress?.contentCompleted?.length / course.content.length) * 100
    );
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty === 'beginner') return 'success';
    if (difficulty === 'intermediate') return 'warning';
    if (difficulty === 'advanced') return 'error';
    return 'default';
  };

  const handleCardClick = () => {
    if (enrollment) {
      navigate(`/courses/${course.slug}`);
    }
  };

  return (
    <motion.div
      whileHover={{ translateY: -5 }}
      className="h-full flex flex-col"
    >
      <Card
        hoverable={!!enrollment}
        onClick={handleCardClick}
        className="shadow-md border-0 flex-grow"
        cover={
          <img
            alt={course.title}
            src={course.thumbnail || `https://picsum.photos/seed/${course._id}/500/300`}
            className="h-48 object-cover"
          />
        }
      >
        <div className="p-4 flex flex-col flex-grow">
          <Tag color={getDifficultyColor(course.difficulty)} className="mb-2 self-start">
            {course.difficulty}
          </Tag>

          <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">
            {course.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
            {course.shortDescription}
          </p>

          <div className="flex items-center text-xs text-gray-500 mb-4">
            <span className="flex items-center mr-4">
              <BookOutlined className="mr-1" /> {course.content?.length || 0} Lessons
            </span>
            <span className="flex items-center">
              <ClockCircleOutlined className="mr-1" /> {course.estimatedDuration}
            </span>
          </div>

          {showProgress && enrollment && (
            <div>
              <Progress
                percent={getProgressPercentage()}
                showInfo={false}
                strokeColor={{ from: '#108ee9', to: '#87d068' }}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {enrollment.isCompleted ? 'Completed' : 'In Progress'}
                </span>
                <Button
                  type="primary"
                  size="small"
                  icon={enrollment.isCompleted ? <CheckCircleOutlined /> : <PlayCircleOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/courses/${course.slug}`);
                  }}
                >
                  {enrollment.isCompleted ? 'View Details' : 'Continue'}
                </Button>
              </div>
            </div>
          )}

          {!enrollment && (
            <Button
              type="primary"
              ghost
              block
              onClick={(e) => {
                e.stopPropagation();
                onEnroll(course._id);
              }}
            >
              Enroll Now
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
