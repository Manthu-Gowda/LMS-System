import axios from 'axios'
import { message } from 'antd'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.clear()
      window.location.href = '/'
      message.error('Your session has expired. Please log in again.')
    } else if (error.response?.status >= 500) {
      message.error('Server error. Please try again later.')
    }
    return Promise.reject(error.response?.data || error)
  }
)

// API methods
export const getApi = (url, params) => api.get(url, { params })
export const postApi = (url, data) => api.post(url, data)
export const putApi = (url, data) => api.put(url, data)
export const deleteApi = (url) => api.delete(url)
export const patchApi = (url, data) => api.patch(url, data)

export default api