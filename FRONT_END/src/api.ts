import axios from 'axios';

// Create a configured axios instance
export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('votechain_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[API Request] Token attached for ${config.url}`);
    } else {
      console.log(`[API Request] No token found for ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
