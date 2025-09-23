import api from './api'

export const getCourses = (params = {}) => {
  return api.get('/courses', { params })
}

export const getCourseBySlug = (slug) => {
  return api.get(`/courses/${slug}`)
}

export const getCourseById = (id) => {
  return api.get(`/courses/id/${id}`)
}

export const createCourse = (courseData) => {
  return api.post('/courses', courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateCourse = (id, courseData) => {
  return api.patch(`/courses/${id}`, courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteCourse = (id) => {
  return api.delete(`/courses/${id}`)
}

export const enrollInCourse = (courseId) => {
  return api.post('/enrollments', { courseId })
}

export const getMyEnrollments = () => {
  return api.get('/enrollments/me')
}

export const updateProgress = (enrollmentId, progressData) => {
  return api.patch(`/progress/${enrollmentId}`, progressData)
}

export const getMCQByCourseId = (courseId) => {
  return api.get(`/courses/${courseId}/mcq`)
}

export const submitMCQ = (courseId, answers) => {
  return api.post(`/courses/${courseId}/mcq/submit`, { answers })
}

export const submitAssignment = (courseId, assignmentData) => {
  return api.post(`/courses/${courseId}/assignment`, assignmentData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getMyCertificates = () => {
  return api.get('/certificates/me')
}

export const getCertificate = (id) => {
  return api.get(`/certificates/${id}`, {
    responseType: 'blob',
  })
}