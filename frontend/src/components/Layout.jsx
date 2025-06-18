import React from 'react';
import { Outlet } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at top right, rgba(49, 130, 206, 0.04), transparent 70%), radial-gradient(circle at bottom left, rgba(128, 90, 213, 0.04), transparent 70%)',
          zIndex: -1,
        }
      }}
    >
      <Header />
      <Container 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: { xs: 4, md: 6 },
          px: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xl: '1400px' },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout; 