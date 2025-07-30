import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for CORS
});

// Helper function to get stored token
const getStoredToken = () => localStorage.getItem('token');

// Helper function to handle auth errors
const handleAuthError = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // Handle 401 Unauthorized errors ONLY
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh the token
          const response = await api.post('/auth/refresh');
          const { token } = response.data;
          
          if (token) {
            localStorage.setItem('token', token);
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          handleAuthError();
          return Promise.reject(refreshError);
        }
      }

      // Log different error types but don't interfere with the response
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data);
      } else if (error.response.status === 500) {
        console.error('Server error:', error.response.data);
      } else if (error.response.status >= 400) {
        console.error('Client error:', error.response.status, error.response.data);
      }
      
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      // Don't modify the error for network issues - let the component handle it
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
    }
    
    // Always return the original error so components can handle it properly
    return Promise.reject(error);
  }
);

export default api;