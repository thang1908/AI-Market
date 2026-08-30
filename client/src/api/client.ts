import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// 1. Request Interceptor: Tự động đính kèm JWT Token nếu có
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 2. Response Interceptor: Chuẩn hóa bắt lỗi toàn cục
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      // 401 Unauthorized: Xóa token khi phiên hết hạn
      if (error.response.status === 401) {
        localStorage.removeItem('access_token');
      }
      console.error(`[API Error ${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.warn('[API Network Error]: Không thể kết nối tới máy chủ Backend.');
    }
    return Promise.reject(error);
  }
);
