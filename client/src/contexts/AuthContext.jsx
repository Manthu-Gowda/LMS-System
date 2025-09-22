import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import * as authAPI from '../services/auth'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      // Decode token to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.userId,
            email: payload.email,
            role: payload.role,
            name: payload.name
          })
        } else {
          // Token expired
          logout()
        }
      } catch (error) {
        console.error('Invalid token:', error)
        logout()
      }
    }
    setLoading(false)
  }, [token])

  const login = async (email, password, loginType = 2) => {
    try {
      const response = await authAPI.login({ email, password, loginType })
      const { token: newToken, user: userData } = response.data

      localStorage.setItem('token', newToken)
      setToken(newToken)
      setUser(userData)

      message.success('Login successful!')
      
      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
      
      return response
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      message.success('Registration successful! Please login.')
      navigate('/')
      return response
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/')
    message.success('Logged out successfully')
  }

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword({ email })
      message.success('Password reset link sent to your email')
      return response
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send reset email')
      throw error
    }
  }

  const resetPassword = async (token, password) => {
    try {
      const response = await authAPI.resetPassword({ token, password })
      message.success('Password reset successful! Please login.')
      navigate('/')
      return response
    } catch (error) {
      message.error(error.response?.data?.message || 'Password reset failed')
      throw error
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isUser: user?.role === 'user'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}