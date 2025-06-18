import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ViewMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch media details
  useEffect(() => {
    const fetchMediaDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`/api/media/${id}`);
        setMedia(response.data.data.media);
      } catch (err) {
        console.error('Error fetching media:', err);
        if (err.response?.status === 404) {
          setError('Media not found');
        } else if (err.response?.status === 403) {
          setError('You do not have permission to view this media');
        } else {
          setError('Failed to load media. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMediaDetails();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if current user is the owner
  const isOwner = () => {
    if (!isAuthenticated() || !media || !user) return false;
    return media.owner._id === user.id;
  };

  // Handle delete media
  const handleDeleteMedia = async () => {
    try {
      setDeleting(true);
      await axios.delete(`/api/media/${id}`);
      navigate('/dashboard');
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete media. Please try again.');
      setDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  // Render media content based on type
  const renderMediaContent = () => {
    if (!media) return null;

    const fileType = media.fileType;

    if (fileType.startsWith('image/')) {
      return (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img
            src={media.fileUrl}
            alt={media.title}
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        </Box>
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <video
            src={media.fileUrl}
            controls
            style={{ maxWidth: '100%', maxHeight: '500px' }}
          />
        </Box>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <iframe
            src={media.fileUrl}
            title={media.title}
            width="100%"
            height="500px"
          />
        </Box>
      );
    } else {
      // For other file types, provide a download link
      return (
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" paragraph>
            This file type cannot be previewed.
          </Typography>
          <Button
            variant="contained"
            href={media.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download File
          </Button>
        </Box>
      );
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!media) {
    return (
      <Box sx={{ my: 4 }}>
        <Alert severity="warning">Media not found</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
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
        variant="text"
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" component="h1">
                {media.title}
              </Typography>
              <Chip
                icon={media.visibility === 'private' ? <LockIcon /> : <VisibilityIcon />}
                label={media.visibility === 'private' ? 'Private' : 'Public'}
                color={media.visibility === 'private' ? 'default' : 'primary'}
                size="small"
              />
            </Box>

            {renderMediaContent()}

            <Typography variant="body1" paragraph>
              {media.description || 'No description provided.'}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="textSecondary">
                Uploaded on {formatDate(media.createdAt)}
              </Typography>

              {isOwner() && (
                <Box>
                  <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={() => setDeleteDialog(true)}
                    sx={{ ml: 1 }}
                  >
                    Delete
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploader
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  src={media.owner.avatar} 
                  alt={media.owner.displayName}
                  sx={{ width: 48, height: 48, mr: 2 }}
                />
                <Box>
                  <Typography variant="body1">
                    {media.owner.displayName}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/profile/${media.owner._id}`}
                    size="small"
                    sx={{ mt: 0.5, p: 0 }}
                  >
                    View Profile
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Media</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{media?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteMedia} 
            color="error" 
            autoFocus
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewMedia; 