import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request Interceptor: Inject JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexoria_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages and handle unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract server message or fallback
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // Auto logout if 401 on protected route and token exists
    if (error.response?.status === 401 && localStorage.getItem('nexoria_token')) {
      // Don't auto-logout if the error was just a failed login attempt
      const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('nexoria_token');
        localStorage.removeItem('nexoria_user');
        window.dispatchEvent(new Event('nexoria-logout'));
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
