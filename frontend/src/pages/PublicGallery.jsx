import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import axios from 'axios';
import MediaCard from '../components/MediaCard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';

const PublicGallery = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/media?visibility=public');
        setMedia(response.data.data.media || []);
      } catch (err) {
        console.error('Error fetching public media:', err);
        setError('Failed to load gallery. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <Box>
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 6, 
          pt: 2,
          pb: 4,
          backgroundImage: 'linear-gradient(rgba(25, 118, 210, 0.05), rgba(225, 245, 254, 0.4))',
          borderRadius: 2
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.dark',
              mb: 2 
            }}
          >
            Discover Media Content
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            paragraph 
            sx={{ 
              fontSize: '1.1rem',
              mb: 3,
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Explore public media shared by our community of creators
          </Typography>
          
          {isAuthenticated() && (
            <Button
              variant="contained"
              component={RouterLink}
              to="/upload"
              startIcon={<CloudUploadIcon />}
              sx={{ 
                mt: 1,
                py: 1,
                px: 3,
                borderRadius: 2,
                fontWeight: 600
              }}
              size="large"
            >
              Share Your Media
            </Button>
          )}
        </Container>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : media.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            maxWidth: 'md',
            mx: 'auto'
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No public media available
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}
          >
            Be the first to share your media with the community.
          </Typography>
          {isAuthenticated() ? (
            <Button 
              variant="contained" 
              component={RouterLink}
              to="/upload"
              startIcon={<CloudUploadIcon />}
              sx={{ fontWeight: 500, px: 3 }}
              size="large"
            >
              Upload Media
            </Button>
          ) : (
            <Button 
              variant="contained" 
              component={RouterLink}
              to="/login"
              sx={{ fontWeight: 500, px: 3 }}
              size="large"
            >
              Sign In to Upload
            </Button>
          )}
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Uploads
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {media.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <MediaCard media={item} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default PublicGallery; 