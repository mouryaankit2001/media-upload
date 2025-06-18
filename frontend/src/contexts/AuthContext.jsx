import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Configure axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_URL;

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          // Verify token expiration
          const decodedToken = jwtDecode(token);

          console.log(decodedToken);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            localStorage.removeItem('authToken');
            setUser(null);
          } else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Fetch current user
            try {
              const response = await axios.get('/api/auth/me');
              setUser(response.data.data.user);
              navigate('/dashboard');
            } catch (fetchError) {
              console.error('Failed to fetch user data:', fetchError);
              localStorage.removeItem('authToken');
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login with Google token
  const loginWithGoogle = async (tokenId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post('/api/auth/google/verify', { token: tokenId });
      
      let token, userData;
      
      if (response?.data?.data) {
        token = response?.data?.data?.token;
        userData = response?.data?.data?.user;
      } else {
        token = response?.data?.token;
        userData = response?.data?.user;
      }
      
      if (!token || !userData) {
        console.error('Invalid response format:', response?.data);
        throw new Error('Invalid authentication response format');
      }
      
      // Save token and set user
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.response?.data?.message || 'Authentication failed');
      return { success: false, error: error.response?.data?.message || 'Authentication failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const saveTokenFromUrl = (token) => {
    try {      
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (error) {
      console.error('Invalid token:', error);
      return false;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  // Value to be provided
  const contextValue = {
    user,
    loading,
    error,
    loginWithGoogle,
    logout,
    isAuthenticated,
    saveTokenFromUrl,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 