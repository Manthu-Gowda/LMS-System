// Base API URL
export const BASE_API_URL = "/api";

// Auth endpoints
export const USER_LOGIN = "Account/Login";
export const USER_REGISTER = "Account/Register";
export const USER_LOGOUT = "auth/logout";
export const FORGOT_PASSWORD = "auth/forgot-password";
export const RESET_PASSWORD = "auth/reset-password";
export const SERVER_STATUS_CHECK = "Account/ServerStatusCheck";

// Admin Auth
export const ADMIN_LOGIN = "admin/login";

// Courses
export const GET_COURSES = "courses";
export const GET_COURSE_BY_SLUG = "courses"; // Add /:slug in component
export const GET_COURSE_BY_ID = "courses/id"; // Add /:id in component
export const CREATE_COURSE = "courses";
export const UPDATE_COURSE = "courses"; // Add /:id in component
export const DELETE_COURSE = "courses"; // Add /:id in component
export const GET_MCQ = "courses"; // Add /:id/mcq in component
export const SUBMIT_MCQ = "courses"; // Add /:id/mcq/submit in component
export const SUBMIT_ASSIGNMENT = "courses"; // Add /:id/assignment in component

// Enrollments
export const ENROLL_COURSE = "enrollments";
export const GET_MY_ENROLLMENTS = "enrollments/me";

// Progress
export const UPDATE_PROGRESS = "progress"; // Add /:enrollmentId in component

// Certificates
export const GET_MY_CERTIFICATES = "certificates/me";
export const GET_CERTIFICATE = "certificates"; // Add /:id in component

// Users
export const GET_ALL_USERS = "users";
export const GET_USER_BY_ID = "users"; // Add /:id in component

// Admin
export const GET_ADMIN_OVERVIEW = "admin/overview";
export const GET_USER_PROGRESS = "admin/users"; // Add /:id/progress in component