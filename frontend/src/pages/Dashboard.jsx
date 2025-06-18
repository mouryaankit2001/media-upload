import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import axios from 'axios';

import MediaCard from '../components/MediaCard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [deleting, setDeleting] = useState(false);

  // Fetch user's media
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get('/api/users/media');
        setMedia(response.data.data.media || []);
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Failed to load your media. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id) => {
    setDeleteDialog({ open: true, id });
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, id: null });
  };

  // Delete media
  const handleDeleteMedia = async () => {
    if (!deleteDialog.id) return;
    
    try {
      setDeleting(true);
      await axios.delete(`/api/media/${deleteDialog.id}`);
      
      // Update state to remove deleted item
      setMedia(media.filter(item => item._id !== deleteDialog.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete media. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter media based on selected tab
  const filteredMedia = tabValue === 'public' 
    ? media.filter(item => item.visibility === 'public')
    : tabValue === 'private' 
      ? media.filter(item => item.visibility === 'private')
      : media;

  return (
    <Box>
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          backgroundImage: 'linear-gradient(to right, rgba(25, 118, 210, 0.05), rgba(25, 118, 210, 0.1))'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'space-between', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.dark', 
                mb: 1 
              }}
            >
              My Media Collection
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and organize all your uploaded content in one place
            </Typography>
          </Box>
          <Button 
            variant="contained"
            color="primary"
            size="large"
            startIcon={<CloudUploadIcon />}
            component={RouterLink}
            to="/upload"
            sx={{ 
              px: 3, 
              py: 1, 
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 2
            }}
          >
            Upload New
          </Button>
        </Box>
      </Paper>
      
      {error && (
        <Alert 
          severity="error" 
          variant="filled"
          sx={{ mb: 4 }}
        >
          {error}
        </Alert>
      )}
      
      <Paper sx={{ mb: 4, borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          variant="fullWidth"
          sx={{ 
            '& .MuiTab-root': {
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab value="all" label="All Media" />
          <Tab value="public" label="Public Media" />
          <Tab value="private" label="Private Media" />
        </Tabs>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : filteredMedia.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            textAlign: 'center', 
            py: 6,
            px: 3,
            backgroundColor: 'grey.50',
            borderRadius: 2,
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
            No {tabValue !== 'all' ? tabValue : ''} media found
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 500, mx: 'auto', mb: 3 }}
          >
            {tabValue === 'all' 
              ? "You haven't uploaded any media yet. Get started by uploading your first file." 
              : `You don't have any ${tabValue} media. Upload new content or change visibility settings of existing media.`}
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<CloudUploadIcon />}
            component={RouterLink}
            to="/upload"
            sx={{ fontWeight: 500, px: 3 }}
          >
            Upload Media
          </Button>
        </Paper>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {filteredMedia.length} {tabValue !== 'all' ? tabValue : ''} item{filteredMedia.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {filteredMedia.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item._id}>
                <MediaCard 
                  media={item} 
                  onDelete={() => handleOpenDeleteDialog(item._id)}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={!deleting ? handleCloseDeleteDialog : undefined}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: 600 }}>
          Delete Media
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this media? This action cannot be undone and the file will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={deleting}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteMedia} 
            color="error" 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
            sx={{ ml: 1 }}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 