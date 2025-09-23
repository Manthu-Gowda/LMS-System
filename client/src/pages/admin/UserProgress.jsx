import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Progress, Table, Typography, Tag, Space, Avatar, Row, Col } from 'antd';
import { BookOutlined, MailOutlined, CalendarOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useQuery } from 'react-query';
import AdminLayout from '../../components/Layout/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getApi } from '../../utils/apiServices';
import { GET_USER_PROGRESS } from '../../utils/apiPaths';

const { Title, Text } = Typography;

const UserProgress = () => {
  const { id } = useParams();

  const { data: progressData, isLoading } = useQuery(
    ['user-progress', id],
    () => getApi(`${GET_USER_PROGRESS}/${id}`)
  );

  if (isLoading) return <LoadingSpinner />;

  if (!progressData) {
    return (
      <AdminLayout><div className="text-center py-16"><Title level={2}>User not found</Title></div></AdminLayout>
    );
  }

  const { user, enrollments } = progressData?.data;

  const chartData = enrollments.map(e => ({ 
    name: e.course.title.slice(0, 15), 
    progress: Math.round(((e.progress?.contentCompleted?.length || 0) / e.course.content.length) * 100)
  }));

  const columns = [
    { 
      title: 'Course', 
      dataIndex: ['course', 'title'],
      render: (title, r) => (
        <div className="flex items-center">
          <Avatar shape="square" src={r.course.thumbnail} />
          <span className="ml-3 font-medium">{title}</span>
        </div>
      )
    },
    { 
      title: 'Progress', 
      dataIndex: 'progress',
      render: (_, r) => <Progress percent={Math.round(((r.progress?.contentCompleted?.length || 0) / r.course.content.length) * 100)} />
    },
    { 
      title: 'Status', 
      dataIndex: 'isCompleted', 
      align: 'center', 
      render: (isCompleted) => <Tag color={isCompleted ? 'green' : 'blue'}>{isCompleted ? 'Completed' : 'In Progress'}</Tag> 
    },
    { 
      title: 'Certificate', 
      dataIndex: 'certificateId', 
      align: 'center',
      render: (cert) => cert ? <Tag icon={<TrophyOutlined />} color="gold">Issued</Tag> : <Tag>None</Tag>
    },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-lg border-0 mb-8">
            <Row align="middle">
              <Col xs={24} sm={6} className="text-center">
                <Avatar size={96} src={`https://i.pravatar.cc/150?u=${user._id}`} />
              </Col>
              <Col xs={24} sm={18}>
                <Title level={2} className="mb-1">{user.name}</Title>
                <Space direction="vertical">
                  <Text><MailOutlined className="mr-2"/>{user.email}</Text>
                  <Text><CalendarOutlined className="mr-2"/>Joined on {new Date(user.createdAt).toLocaleDateString()}</Text>
                </Space>
              </Col>
            </Row>
          </Card>
        </motion.div>

        <Row gutter={[24, 24]} className="mb-8">
          <Col span={8}><Card><Statistic title="Total Enrollments" value={enrollments.length} prefix={<BookOutlined />} /></Card></Col>
          <Col span={8}><Card><Statistic title="Completed Courses" value={enrollments.filter(e => e.isCompleted).length} prefix={<CheckCircleOutlined />} /></Card></Col>
          <Col span={8}><Card><Statistic title="Certificates Earned" value={enrollments.filter(e => e.certificateId).length} prefix={<TrophyOutlined />} /></Card></Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <Card title="Enrollment Progress" className="shadow-md border-0 h-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80}/>
                  <Tooltip />
                  <Bar dataKey="progress" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Course Details" className="shadow-md border-0 h-full">
              <Table columns={columns} dataSource={enrollments} rowKey="_id" pagination={false} />
            </Card>
          </Col>
        </Row>
      </div>
    </AdminLayout>
  );
};

export default UserProgress;
