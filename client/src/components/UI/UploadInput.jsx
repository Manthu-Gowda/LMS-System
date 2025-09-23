import React from 'react';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadInput = ({ name, title, ...rest }) => {
  return (
    <Form.Item name={name} label={title}>
      <Upload {...rest}>
        <Button icon={<UploadOutlined />}>Upload</Button>
      </Upload>
    </Form.Item>
  );
};

export default UploadInput;
