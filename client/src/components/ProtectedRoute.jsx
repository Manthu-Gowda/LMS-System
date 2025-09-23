import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner'; // Import the spinner

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth(); // Get loading and isAuthenticated state

  // While we are checking for a session, show a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not authenticated after checking, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the route requires a specific role and the user doesn't have it, redirect
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to a more appropriate page, e.g., the user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
