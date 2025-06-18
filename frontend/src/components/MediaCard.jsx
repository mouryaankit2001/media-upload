import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';

const MediaCard = ({ media, onDelete }) => {
  // Helper to determine correct preview based on file type
  const renderMediaPreview = () => {
    const fileType = media.fileType;

    if (fileType.startsWith('image/')) {
      return (
        <CardMedia
          component="img"
          height="180"
          image={media.fileUrl}
          alt={media.title}
          sx={{ 
            objectFit: 'cover',
            objectPosition: 'center',
            backgroundColor: '#f0f0f0'
          }}
        />
      );
    } else if (fileType.startsWith('video/')) {
      return (
        <CardMedia
          component="video"
          height="180"
          image={media.fileUrl}
          controls
          sx={{ backgroundColor: '#f0f0f0' }}
        />
      );
    } else {
      // For other file types like PDFs, show a placeholder
      return (
        <Box
          sx={{
            height: 180,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            color: 'text.secondary'
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            {media.fileType.split('/')[1].toUpperCase()} File
          </Typography>
        </Box>
      );
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      {renderMediaPreview()}
      
      <CardContent sx={{ flexGrow: 1, pt: 2.5, px: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 600 }}>
            {media.title}
          </Typography>
          <Chip
            icon={media.visibility === 'private' ? <LockIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            label={media.visibility === 'private' ? 'Private' : 'Public'}
            size="small"
            color={media.visibility === 'private' ? 'default' : 'primary'}
            variant="outlined"
            sx={{ height: 24 }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5
          }}
        >
          {media.description || 'No description'}
        </Typography>
        
        {media.owner && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Avatar 
              src={media.owner.avatar} 
              alt={media.owner.displayName}
              sx={{ width: 28, height: 28, mr: 1 }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body2" fontWeight={500}>
                {media.owner.displayName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(media.createdAt)}
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/media/${media._id}`}
          variant="contained"
          sx={{ px: 2, py: 0.7 }}
        >
          View
        </Button>
        {onDelete && (
          <Button 
            size="small" 
            color="error" 
            onClick={() => onDelete(media._id)}
            variant="outlined"
            sx={{ ml: 1, px: 2, py: 0.7 }}
          >
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default MediaCard; 