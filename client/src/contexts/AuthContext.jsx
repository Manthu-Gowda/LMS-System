import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
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
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            name: payload.name
          });
        } else {
          logout();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, [token]);

  const login = (loginData) => {
    const { accessToken, refreshToken, expiryTime, ...userData } = loginData;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('expiryTime', expiryTime);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expiryTime');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
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
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
