import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
      // Handle 401 Unauthorized errors
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

      // Handle other errors
      console.error('Response error:', error.response.data);
      
      if (error.response.status === 403) {
        // Handle forbidden errors (e.g., insufficient permissions)
        console.error('Access forbidden:', error.response.data);
      }
      
    } else if (error.request) {
      // Request made but no response
      console.error('Network error:', error.request);
      error.response = { data: { message: 'Network error - please try again' } };
    } else {
      // Request setup error
      console.error('Error:', error.message);
      error.response = { data: { message: error.message } };
    }
    
    return Promise.reject(error);
  }
);

export default api; 