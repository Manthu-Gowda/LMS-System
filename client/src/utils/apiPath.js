// User Auth
export const USER_LOGIN = "Account/Login";
export const USER_LOGOUT = "auth/logout"; // Corrected from Account/Logout to auth/logout based on auth.js
export const ADD_USER = "Account/Register";
export const SERVER_STATUS_CHECK = "Account/ServerStatusCheck";

// Admin Auth
export const ADMIN_LOGIN = "admin/login";

// Courses
export const GET_COURSES = "courses";
export const GET_COURSE_DETAILS = "courses"; // Add /:id in the component
export const CREATE_COURSE = "courses";
export const UPDATE_COURSE = "courses"; // Add /:id in the component
export const DELETE_COURSE = "courses"; // Add /:id in the component

// Enrollments
export const ENROLL_COURSE = "enrollments/enroll";
export const GET_ENROLLED_COURSES = "enrollments/user"; // Add /:userId in the component

// User Progress
export const UPDATE_PROGRESS = "progress/update";
export const GET_PROGRESS = "progress/course"; // Add /:courseId/user/:userId in the component
