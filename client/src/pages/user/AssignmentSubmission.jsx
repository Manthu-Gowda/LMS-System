import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Upload, Button, Card, Typography, Alert, message as antdMessage } from 'antd';
import { LinkOutlined, UploadOutlined, SendOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

import UserLayout from '../../components/Layout/UserLayout';
import { postApi } from '../../utils/apiServices';
import { SUBMIT_ASSIGNMENT } from '../../utils/apiPaths';
import FormInputs from '../../components/UI/FormInputs';
import TextField from '../../components/UI/TextField';

const { Title, Paragraph } = Typography;

const AssignmentSubmission = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    const formData = new FormData();

    if (values.projectLink) {
      formData.append('link', values.projectLink);
    }

    if (values.description) {
      formData.append('description', values.description);
    }

    if (fileList.length > 0) {
      formData.append('file', fileList[0].originFileObj);
    }

    setIsSubmitting(true);
    try {
      const response = await postApi(`${SUBMIT_ASSIGNMENT}/${slug}/assignment`, formData);
      if (response.statusCode === 200) {
        antdMessage.success(response.message || 'Assignment submitted successfully!');
        navigate(`/courses/${slug}`);
      } else {
        antdMessage.error(response.message || 'Failed to submit assignment');
      }
    } catch (error) {
      antdMessage.error(error.response?.data?.message || error.message || 'Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isValidType =
        file.type === 'application/pdf' ||
        file.type.startsWith('image/') ||
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed';

      if (!isValidType) {
        antdMessage.error('You can only upload PDF, images, or ZIP files!');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        antdMessage.error('File must be smaller than 10MB!');
        return false;
      }

      return false; // Prevent automatic upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1)); // Keep only the last file
    },
    fileList,
  };

  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card>
            <div className="text-center">
              <SendOutlined className="text-5xl text-blue-500 mb-4" />
              <Title level={2}>Submit Your Assignment</Title>
              <Paragraph type="secondary" className="text-lg">
                Complete your learning journey by submitting your project or relevant work. This is the final step to receive your course certificate.
              </Paragraph>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card title="Assignment Submission Form">
            <Alert
              message="Submission Guidelines"
              description={
                <ul className="mt-2 space-y-1">
                  <li>• Provide a link to your project (GitHub, demo site, etc.) OR upload a file</li>
                  <li>• Include a brief description of your work</li>
                  <li>• Accepted file types: PDF, images, ZIP files (max 10MB)</li>
                  <li>• Make sure your submission demonstrates the skills learned in this course</li>
                </ul>
              }
              type="info"
              showIcon
              className="mb-6"
            />

            <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
              <FormInputs
                name="projectLink"
                title="Project Link (Optional)"
                prefix={<LinkOutlined />}
                rules={[{ type: 'url', message: 'Please enter a valid URL' }]}
                placeholder="https://github.com/username/project or https://your-demo-site.com"
              />

              <TextField
                name="description"
                title="Project Description"
                rows={6}
                rules={[
                  { required: true, message: 'Please provide a description of your work' },
                  { min: 50, message: 'Description must be at least 50 characters' },
                ]}
                placeholder="Describe your project, what you built, technologies used, challenges faced, and key learnings from this course..."
              />

              <Form.Item
                name="file"
                label="Upload File (Optional)"
                extra="Alternative to project link. Upload screenshots, documentation, or project files."
              >
                <Upload {...uploadProps} maxCount={1}>
                  <Button icon={<UploadOutlined />}>
                    Select File (PDF, Images, ZIP - Max 10MB)
                  </Button>
                </Upload>
              </Form.Item>

              <Alert
                message="Note"
                description="Your assignment will be reviewed and you'll automatically receive your certificate upon successful submission."
                type="warning"
                showIcon
                className="mb-6"
              />

              <Form.Item>
                <div className="flex justify-between">
                  <Button size="large" onClick={() => navigate(`/courses/${slug}`)}>
                    Back to Course
                  </Button>

                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    loading={isSubmitting}
                    icon={<SendOutlined />}
                  >
                    Submit Assignment
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </div>
    </UserLayout>
  );
};

export default AssignmentSubmission;
