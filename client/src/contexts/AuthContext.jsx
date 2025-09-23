
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { App } from 'antd'; // Use App for message context
import { postApi } from '../utils/apiServices';
import { FORGOT_PASSWORD, RESET_PASSWORD } from '../utils/apiPaths';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { message } = App.useApp(); // Use hook for context-aware messages

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const expiryTime = localStorage.getItem('expiryTime');
      const storedUser = localStorage.getItem('user');

      if (accessToken && expiryTime && Date.now() < parseInt(expiryTime) && storedUser) {
        setToken(accessToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiryTime');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); 
    }
  }, []);

  const login = (loginData) => {
    const { accessToken, refreshToken, expiryTime, ...userData } = loginData;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiryTime', String(expiryTime));
    localStorage.setItem('user', JSON.stringify(userData)); 
    setToken(accessToken);
    setUser(userData); 
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiryTime');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
    message.success('Logged out successfully');
  };

  const forgotPassword = async (email) => {
    try {
      const response = await postApi(FORGOT_PASSWORD, { email });
      if (response.success) {
        message.success(response.message);
      } else {
        message.error(response.message || 'Failed to send reset link');
      }
      return response;
    } catch (error) {
      message.error(error.message || 'An unexpected error occurred');
      throw error;
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await postApi(RESET_PASSWORD, { token, newPassword });
      if (response.success) {
        message.success(response.message);
        navigate('/');
      } else {
        message.error(response.message || 'Failed to reset password');
      }
      return response;
    } catch (error) {
      message.error(error.message || 'An unexpected error occurred');
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading, 
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
