import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useAuth } from '../contexts/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { saveTokenFromUrl } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processAuth = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }
        
        // Save token
        const success = saveTokenFromUrl(token);
        
        if (!success) {
          setError('Invalid authentication token');
          return;
        }

        // Fetch user info with token
        try {
          await axios.get('/api/auth/me');
          // Redirect to dashboard on success
          navigate('/dashboard');
        } catch (apiError) {
          console.error('API error:', apiError);
          setError('Failed to fetch user data');
        }
      } catch (err) {
        console.error('Auth processing error:', err);
        setError('Authentication failed');
      }
    };

    processAuth();
  }, [location.search, navigate, saveTokenFromUrl]);

  if (error) {
    return (
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" align="center">
          Please try logging in again.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <CircularProgress size={60} />
      <Typography variant="h6" sx={{ mt: 3 }}>
        Completing sign in...
      </Typography>
    </Box>
  );
};

export default AuthSuccess; 