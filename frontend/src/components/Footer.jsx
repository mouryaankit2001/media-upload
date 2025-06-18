import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 1,
        mt: 'auto',
        backgroundColor: 'rgba(26, 32, 44, 0.97)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: { xs: 2, sm: 0 }
          }}
        >
          <CloudUploadOutlinedIcon sx={{ mr: 1.5, color: 'white', opacity: 0.7 }} />
          <Typography variant="body1" color="white" sx={{ fontWeight: 600, letterSpacing: '0.01em' }}>
            Media Share
          </Typography>
        </Box>
        
        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)" align="center" sx={{ fontSize: '0.75rem' }}>
          © {new Date().getFullYear()} Media Share. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 