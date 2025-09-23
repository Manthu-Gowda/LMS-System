import api from './api'

export const login = (credentials) => {
  return api.post('/api/auth/login', credentials)
}

export const register = (userData) => {
  return api.post('/api/auth/signup', userData)
}

export const forgotPassword = (data) => {
  return api.post('/api/auth/forgot-password', data)
}

export const resetPassword = (data) => {
  return api.post('/api/auth/reset-password', data)
}
