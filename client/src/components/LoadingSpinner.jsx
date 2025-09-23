import React from 'react';
import { Spin } from 'antd';

const LoadingSpinner = ({ size = 'large', tip = 'Loading...' }) => {
  // The `fullscreen` prop is designed for this use case.
  // It creates a full-page overlay for the spinner and resolves the Ant Design warning about the `tip` prop.
  return <Spin size={size} tip={tip} fullscreen />;
};

export default LoadingSpinner;