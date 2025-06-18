import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Paper from '@mui/material/Paper';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { styled } from '@mui/material/styles';

const StyledDropzone = styled('div')(({ theme, isDragActive, isDragReject }) => ({
  padding: theme.spacing(4),
  borderWidth: 2,
  borderRadius: theme.shape.borderRadius,
  borderStyle: 'dashed',
  borderColor: isDragReject 
    ? theme.palette.error.main 
    : isDragActive 
      ? theme.palette.primary.main 
      : theme.palette.grey[300],
  backgroundColor: isDragActive 
    ? theme.palette.action.hover 
    : isDragReject 
      ? theme.palette.error.light 
      : theme.palette.background.paper,
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  textAlign: 'center',
}));

const UploadMedia = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        
        // Free memory when component unmounts
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    }
  };
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'application/pdf': []
    },
    maxSize: 10485760, // 10MB
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setUploading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('visibility', visibility);
      
      const response = await axios.post('/api/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate(`/media/${response.data.data.media.id}`);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Media
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <StyledDropzone {...getRootProps()} isDragActive={isDragActive} isDragReject={isDragReject}>
              <input {...getInputProps()} />
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography>
                  {isDragActive
                    ? 'Drop the file here'
                    : 'Drag & drop a file here, or click to select'}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Supported formats: Images, Videos, PDFs (Max: 10MB)
                </Typography>
              </Box>
            </StyledDropzone>
          </Box>
          
          {file && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </Typography>
              
              {previewUrl && (
                <Box sx={{ mt: 2, mb: 2, textAlign: 'center' }}>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    style={{ maxHeight: '200px', maxWidth: '100%' }} 
                  />
                </Box>
              )}
            </Box>
          )}
          
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          
          <FormControl component="fieldset" margin="normal">
            <Typography variant="subtitle2" gutterBottom>
              Visibility
            </Typography>
            <RadioGroup 
              row 
              value={visibility} 
              onChange={(e) => setVisibility(e.target.value)}
            >
              <FormControlLabel 
                value="private" 
                control={<Radio />} 
                label="Private (only you can see)" 
              />
              <FormControlLabel 
                value="public" 
                control={<Radio />} 
                label="Public (everyone can see)" 
              />
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={uploading || !file || !title}
              startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default UploadMedia; 