import axios from "axios";
import { BASE_API_URL } from "./api-constant";

axios.defaults.baseURL = BASE_API_URL;

axios.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("accessToken");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => {
    // Pass the response data to the first `then` block
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/";
      // Return a promise that never resolves to prevent further action
      return new Promise(() => {});
    }
    // For other errors, reject the promise to be caught by the `apiRequest` function
    return Promise.reject(error);
  }
);

export const apiRequest = async ({ method, url, req, params }) => {
  try {
    const response = method === "get"
        ? await axios[method](url, params)
        : await axios[method](url, req, params);
    return response;
  } catch (error) {
    // Format a consistent error response object
    return {
      statusCode: error.response?.data?.statusCode || error.response?.status || 500,
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      data: error.response?.data?.data || null,
      success: false
    };
  }
};

export const getApi = async (url, params) =>
  await apiRequest({ method: "get", url, params });
export const postApi = async (url, req, params) =>
  await apiRequest({ method: "post", url, req, params });
export const putApi = async (url, req, params) =>
  await apiRequest({ method: "put", url, req, params });
export const deleteApi = async (url, req, params) =>
  await apiRequest({ method: "delete", url, req, params });
export const patchApi = async (url, req, params) =>
  await apiRequest({ method: "patch", url, req, params });
