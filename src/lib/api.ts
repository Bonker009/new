import axios from 'axios';
import { getCookie, removeCookie } from './cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://96.9.81.187:9024/api';
 

console.log('API Base URL:', API_BASE_URL);

// Flag to suppress console errors during logout
let suppressErrors = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (!suppressErrors) {
      console.log('Making request to:', config.url);
      console.log('Request method:', config.method);
      console.log('Request headers:', config.headers);
    }
    
    const token = getCookie('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (!suppressErrors) {
        console.log('Added auth token to request');
      }
    }
    return config;
  },
  (error) => {
    if (!suppressErrors) {
      console.error('Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    if (!suppressErrors) {
      console.log('Response received:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // Handle 401 errors silently without console logging
    if (error.response?.status === 401) {
      removeCookie('auth-token');
      removeCookie('user-role');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    // Don't log other errors to console to prevent console pollution
    return Promise.reject(error);
  }
);

// Function to suppress errors during logout
export const suppressApiErrors = (suppress: boolean) => {
  suppressErrors = suppress;
};

export default api;