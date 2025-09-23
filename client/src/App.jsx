import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, App as AntdApp } from 'antd'; // Import App and rename to avoid conflict
import { motion } from 'framer-motion';

import { AuthProvider, useAuth } from './contexts/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Public Pages
import Login from './pages/auth/Login';
import AdminLogin from './pages/auth/AdminLogin';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Pages
import UserDashboard from './pages/user/Dashboard';
import Courses from './pages/user/Courses';
import CourseDetail from './pages/user/CourseDetail';
import MCQQuiz from './pages/user/MCQQuiz';
import AssignmentSubmission from './pages/user/AssignmentSubmission';
import Certificates from './pages/user/Certificates';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/Courses';
import CourseForm from './pages/admin/CourseForm';
import UserProgress from './pages/admin/UserProgress';

const { Content } = Layout;

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <Layout className="min-h-screen">
      <Content>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* User Routes */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:slug" element={<CourseDetail />} />
            <Route path="/courses/:slug/mcq" element={<MCQQuiz />} />
            <Route path="/courses/:slug/assignment" element={<AssignmentSubmission />} />
            <Route path="/certificates" element={<Certificates />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/new" element={<CourseForm />} />
            <Route path="/admin/courses/:id/edit" element={<CourseForm />} />
            <Route path="/admin/users/:id" element={<UserProgress />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </Content>
    </Layout>
  );
}

function App() {
  return (
    <AntdApp>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AntdApp>
  );
}

export default App;
