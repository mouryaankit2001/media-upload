import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadMedia from './pages/UploadMedia';
import ViewMedia from './pages/ViewMedia';
import PublicGallery from './pages/PublicGallery';
import UserProfile from './pages/UserProfile';
import AuthSuccess from './pages/AuthSuccess';
import NotFound from './pages/NotFound';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A202C',      // Deep blue-gray
      light: '#2D3748',
      dark: '#121721',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#3182CE',      // Bright blue
      light: '#4299E1',
      dark: '#2B6CB0',
      contrastText: '#FFFFFF',
    },
    accent: {
      main: '#805AD5',      // Purple accent
      light: '#9F7AEA',
      dark: '#6B46C1',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#38A169',      // Green
      light: '#48BB78',
      dark: '#2F855A',
    },
    error: {
      main: '#E53E3E',      // Red
      light: '#FC8181',
      dark: '#C53030',
    },
    warning: {
      main: '#DD6B20',      // Orange
      light: '#ED8936',
      dark: '#C05621',
    },
    info: {
      main: '#3182CE',      // Blue
      light: '#4299E1',
      dark: '#2B6CB0',
    },
    background: {
      default: '#F7FAFC',   // Very light blue-gray
      paper: '#FFFFFF',
      card: 'rgba(255, 255, 255, 0.8)',
      dark: '#1A202C',
      gradient: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
    },
    text: {
      primary: '#1A202C',
      secondary: '#4A5568',
      disabled: '#A0AEC0',
    },
    divider: 'rgba(160, 174, 192, 0.2)',
    action: {
      active: '#4A5568',
      hover: 'rgba(74, 85, 104, 0.04)',
      selected: 'rgba(49, 130, 206, 0.08)',
      disabled: 'rgba(160, 174, 192, 0.3)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.4,
    },
    subtitle1: {
      fontWeight: 500,
      letterSpacing: '0em',
    },
    subtitle2: {
      fontWeight: 500,
      letterSpacing: '0em',
    },
    body1: {
      lineHeight: 1.6,
    },
    body2: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.015em',
    },
    caption: {
      letterSpacing: '0.01em',
    },
    overline: {
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontWeight: 600,
      fontSize: '0.75rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.04), 0px 1px 2px rgba(0, 0, 0, 0.02)',
    '0px 3px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)',
    '0px 5px 15px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.04)',
    '0px 10px 24px rgba(0, 0, 0, 0.07), 0px 4px 8px rgba(0, 0, 0, 0.05)',
    '0px 15px 35px rgba(0, 0, 0, 0.08), 0px 5px 12px rgba(0, 0, 0, 0.06)',
    '0px 20px 45px rgba(0, 0, 0, 0.09), 0px 7px 15px rgba(0, 0, 0, 0.07)',
    '0px 22px 50px rgba(0, 0, 0, 0.1), 0px 10px 20px rgba(0, 0, 0, 0.08)',
    '0px 25px 55px rgba(0, 0, 0, 0.11), 0px 12px 24px rgba(0, 0, 0, 0.09)',
    '0px 28px 60px rgba(0, 0, 0, 0.12), 0px 15px 28px rgba(0, 0, 0, 0.1)',
    '0px 30px 65px rgba(0, 0, 0, 0.13), 0px 18px 32px rgba(0, 0, 0, 0.11)',
    '0px 32px 70px rgba(0, 0, 0, 0.14), 0px 20px 36px rgba(0, 0, 0, 0.12)',
    '0px 35px 75px rgba(0, 0, 0, 0.15), 0px 22px 40px rgba(0, 0, 0, 0.13)',
    '0px 38px 80px rgba(0, 0, 0, 0.16), 0px 24px 44px rgba(0, 0, 0, 0.14)',
    '0px 40px 85px rgba(0, 0, 0, 0.17), 0px 26px 48px rgba(0, 0, 0, 0.15)',
    '0px 42px 90px rgba(0, 0, 0, 0.18), 0px 28px 52px rgba(0, 0, 0, 0.16)',
    '0px 45px 95px rgba(0, 0, 0, 0.19), 0px 30px 56px rgba(0, 0, 0, 0.17)',
    '0px 48px 100px rgba(0, 0, 0, 0.2), 0px 32px 60px rgba(0, 0, 0, 0.18)',
    '0px 50px 105px rgba(0, 0, 0, 0.21), 0px 34px 64px rgba(0, 0, 0, 0.19)',
    '0px 52px 110px rgba(0, 0, 0, 0.22), 0px 36px 68px rgba(0, 0, 0, 0.2)',
    '0px 55px 115px rgba(0, 0, 0, 0.23), 0px 38px 72px rgba(0, 0, 0, 0.21)',
    '0px 58px 120px rgba(0, 0, 0, 0.24), 0px 40px 76px rgba(0, 0, 0, 0.22)',
    '0px 60px 125px rgba(0, 0, 0, 0.25), 0px 42px 80px rgba(0, 0, 0, 0.23)',
    '0px 62px 130px rgba(0, 0, 0, 0.26), 0px 44px 84px rgba(0, 0, 0, 0.24)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--toastify-color-light': '#fff',
          '--toastify-color-dark': '#1A202C',
          '--toastify-color-info': '#3182CE',
          '--toastify-color-success': '#38A169',
          '--toastify-color-warning': '#DD6B20',
          '--toastify-color-error': '#E53E3E',
          '--toastify-color-progress-light': 'var(--toastify-color-info)',
          '--toastify-color-progress-dark': 'var(--toastify-color-info)',
        },
        body: {
          overflowX: 'hidden',
          backgroundImage: 'linear-gradient(135deg, #F7FAFC 0%, #EDF2F7 100%)',
          backgroundAttachment: 'fixed',
        },
        '::selection': {
          backgroundColor: 'rgba(49, 130, 206, 0.2)',
        },
        '::-webkit-scrollbar': {
          width: '10px',
          height: '10px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(160, 174, 192, 0.5)',
          borderRadius: '10px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'rgba(237, 242, 247, 0.8)',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.15), 0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
        text: {
          '&:hover': {
            backgroundColor: 'rgba(49, 130, 206, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.04)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: 16,
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.04)',
        },
        elevation1: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.05), 0px 2px 4px rgba(0, 0, 0, 0.03)',
        },
        elevation2: {
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.06), 0px 3px 6px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(26, 32, 44, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: '8px 0',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginLeft: 8,
          marginRight: 8,
          width: 'auto',
          '&$selected': {
            backgroundColor: 'rgba(49, 130, 206, 0.08)',
          },
          '&$selected:hover': {
            backgroundColor: 'rgba(49, 130, 206, 0.12)',
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(49, 130, 206, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(49, 130, 206, 0.12)',
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          padding: '12px 16px',
          minWidth: 100,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 32,
          fontSize: '0.85rem',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0px 20px 45px rgba(0, 0, 0, 0.09), 0px 7px 15px rgba(0, 0, 0, 0.07)',
          backgroundImage: 'none',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(160, 174, 192, 0.2)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(49, 130, 206, 0.5)',
            },
          },
          '& .MuiOutlinedInput-notchedOutline': {
            transition: 'border-color 0.2s ease-in-out',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(160, 174, 192, 0.2)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(237, 242, 247, 0.5)',
          color: '#1A202C',
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            
            <Route path="/" element={<Layout />}>
              <Route index element={<PublicGallery />} />
              
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="upload" element={
                <ProtectedRoute>
                  <UploadMedia />
                </ProtectedRoute>
              } />
              
              <Route path="media/:id" element={<ViewMedia />} />
              <Route path="profile/:id" element={<UserProfile />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 