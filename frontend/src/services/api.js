import axios from 'axios';

// Resolve API Base URL for local development and deployed production
const getApiBaseUrl = () => {
  // 1. Explicit environment variable takes top priority
  if (import.meta.env.VITE_API_URL) {
    let url = import.meta.env.VITE_API_URL.trim();
    if (url.startsWith('http') && !url.endsWith('/api') && !url.includes('/api/')) {
      url = url.replace(/\/+$/, '') + '/api';
    }
    return url;
  }

  // 2. In browser production environment on Vercel or any remote domain
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // If running on deployed host (Vercel), point directly to deployed Render backend
    return 'https://placement-prep-ku9x.onrender.com/api';
  }

  // 3. Localhost development fallback (proxied by Vite to localhost:5000)
  return '/api';
};

const API = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000, // 35s timeout for Render free tier cold starts
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors gracefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token only if on a protected route (do not interrupt landing, login, register)
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && path !== '/' && path !== '/landing') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
