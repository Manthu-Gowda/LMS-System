import api from './api'

export const getAdminOverview = () => {
  return api.get('/admin/overview')
}

export const getAllUsers = () => {
  return api.get('/users')
}

export const getUserProgress = (userId) => {
  return api.get(`/admin/users/${userId}/progress`)
}