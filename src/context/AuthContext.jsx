import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from backend
  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/verify');
      console.log(response.data)
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching user data:', err);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle login
  const handleLogin = async (token) => {
    try {
      localStorage.setItem('token', token);
      await fetchUserData();
    } catch (err) {
      console.error('Login error:', err);
      localStorage.removeItem('token');
      throw err;
    }
  };

  // Handle signup
  const handleSignup = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      const token = response.data.token;

      if (token) {
        localStorage.setItem('token', token);
        await fetchUserData();
        navigate('/'); // Redirect to homepage after signup
      }
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  };

  // Handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login: handleLogin,
    signup: handleSignup,     // ✅ Added here
    logout: handleLogout,
    refreshUser: fetchUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
