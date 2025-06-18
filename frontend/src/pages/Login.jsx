import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, isAuthenticated, error: authError, loading: authLoading } = useAuth();
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get redirect path from URL params
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(redirectPath);
    }
  }, [isAuthenticated, navigate, redirectPath]);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setLocalError(null);
      console.log('Google login success, credential received');
      
      if (!credentialResponse.credential) {
        throw new Error('No credential received from Google');
      }
      
      const result = await loginWithGoogle(credentialResponse.credential);
      
      if (result.success) {
        console.log('Login successful, navigating to:', redirectPath);
        navigate(redirectPath);
      } else {
        setLocalError(result.error || 'Failed to authenticate with the server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLocalError(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
    setLocalError('Google authentication failed. Please try again or use another method.');
  };

  // Display errors
  const displayError = localError || authError;

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', mt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            
            {displayError && (
              <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                {displayError}
              </Alert>
            )}
            
            <Box sx={{ mt: 3, width: '100%' }}>
              {(isLoading || authLoading) ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      shape="rectangular"
                      text="signin_with"
                      size="large"
                    />
                  </Box>
                </>
              )}
              
              <Button
                fullWidth
                variant="outlined"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => navigate('/')}
                disabled={isLoading || authLoading}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 