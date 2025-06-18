import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CollectionsIcon from '@mui/icons-material/Collections';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import MediaCard from '../components/MediaCard';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/users/${id}`);

        setProfile(response.data.data.user);
        setMedia(response.data.data.media || []);
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load user profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Alert 
          severity="error" 
          variant="filled" 
          sx={{ 
            mb: 4, 
            maxWidth: 500, 
            mx: 'auto',
            fontSize: '1rem'
          }}
        >
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          onClick={() => navigate(-1)}
          size="large"
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Alert 
          severity="warning" 
          variant="filled"
          sx={{ 
            mb: 4, 
            maxWidth: 500, 
            mx: 'auto',
            fontSize: '1rem'
          }}
        >
          User not found
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="contained"
          onClick={() => navigate(-1)}
          size="large"
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        onClick={() => navigate(-1)}
        sx={{ mb: 3, borderRadius: 2, px: 2, py: 0.75 }}
      >
        Back to Gallery
      </Button>
      
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 4 }, 
          mb: 5, 
          borderRadius: 3,
          backgroundImage: 'linear-gradient(120deg, rgba(25, 118, 210, 0.03), rgba(225, 245, 254, 0.2))',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            backgroundColor: 'primary.light',
            opacity: 0.05,
            zIndex: 0
          }}
        />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'center', sm: 'flex-start' },
              mb: 3 
            }}
          >
            <Avatar
              src={profile.avatar}
              alt={profile.displayName}
              sx={{ 
                width: 120, 
                height: 120, 
                mr: { xs: 0, sm: 4 },
                mb: { xs: 3, sm: 0 },
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: '4px solid white'
              }}
            />
            
            <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  mb: 1, 
                  fontWeight: 700,
                  color: 'primary.dark'
                }}
              >
                {profile.displayName}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap',
                  gap: 2, 
                  mb: 2,
                  justifyContent: { xs: 'center', sm: 'flex-start' } 
                }}
              >
                {profile.email && (
                  <Chip 
                    icon={<EmailIcon />} 
                    label={profile.email}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                  />
                )}
                <Chip
                  icon={<CollectionsIcon />}
                  label={`${media.length} Public Media`}
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600, 
            display: 'flex',
            alignItems: 'center',
            color: 'primary.dark'
          }}
        >
          <CollectionsIcon sx={{ mr: 1 }} />
          Public Media Collection
        </Typography>
        <Divider sx={{ mb: 4 }} />
      </Box>
      
      {media.length > 0 ? (
        <Grid container spacing={3}>
          {media.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item._id}>
              <MediaCard media={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 5, 
            px: 3,
            borderRadius: 3,
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.6 }} />
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            No public media available
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
            This user hasn't shared any public media yet.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default UserProfile; 