import { getApi, postApi, patchApi, deleteApi } from './api'

export const getCourses = (params = {}) => {
  return getApi('/courses', params)
}

export const getCourseBySlug = (slug) => {
  return getApi(`/courses/${slug}`)
}

export const getCourseById = (id) => {
  return getApi(`/courses/id/${id}`)
}

export const createCourse = (courseData) => {
  return postApi('/courses', courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateCourse = (id, courseData) => {
  return patchApi(`/courses/${id}`, courseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteCourse = (id) => {
  return deleteApi(`/courses/${id}`)
}

export const enrollInCourse = (courseId) => {
  return postApi('/enrollments', { courseId })
}

export const getMyEnrollments = () => {
  return getApi('/enrollments/me')
}

export const updateProgress = (enrollmentId, progressData) => {
  return patchApi(`/progress/${enrollmentId}`, progressData)
}

export const getMCQByCourseId = (courseId) => {
  return getApi(`/courses/${courseId}/mcq`)
}

export const submitMCQ = (courseId, answers) => {
  return postApi(`/courses/${courseId}/mcq/submit`, { answers })
}

export const submitAssignment = (courseSlug, assignmentData) => {
  // First get course by slug to get ID
  return getCourseBySlug(courseSlug).then(courseResponse => {
    const courseId = courseResponse.data._id
    return postApi(`/courses/${courseId}/assignment`, assignmentData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  })
}

export const getMyCertificates = () => {
  return getApi('/certificates/me')
}

export const getCertificate = (id) => {
  return getApi(`/certificates/${id}`, {
    responseType: 'blob',
  })
}