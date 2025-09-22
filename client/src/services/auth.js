import api from './api'

export const login = (credentials) => {
  return api.post('/auth/login', credentials)
}

export const register = (userData) => {
  return api.post('/auth/signup', userData)
}

export const forgotPassword = (data) => {
  return api.post('/auth/forgot-password', data)
}

export const resetPassword = (data) => {
  return api.post('/auth/reset-password', data)
}