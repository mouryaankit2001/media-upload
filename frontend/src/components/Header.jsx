import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import Fade from '@mui/material/Fade';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#2c3e50',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 68 } }}>
          <CloudUploadOutlinedIcon 
            sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              mr: 2, 
              fontSize: 28,
              color: '#ecf0f1'
            }} 
          />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 4,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 600,
              letterSpacing: '-0.5px',
              color: '#ecf0f1',
              textDecoration: 'none'
            }}
          >
            Media Share
          </Typography>

          {/* Mobile Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#ecf0f1' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              TransitionComponent={Fade}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
              PaperProps={{
                elevation: 1,
                sx: {
                  borderRadius: 1,
                  mt: 1
                }
              }}
            >
              <MenuItem 
                onClick={handleCloseNavMenu} 
                component={RouterLink} 
                to="/"
                selected={isActive('/')}
              >
                <ListItemIcon>
                  <CollectionsOutlinedIcon fontSize="small" color={isActive('/') ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Gallery" />
              </MenuItem>

              {isAuthenticated() && (
                <>
                  <MenuItem 
                    onClick={handleCloseNavMenu} 
                    component={RouterLink} 
                    to="/dashboard"
                    selected={isActive('/dashboard')}
                  >
                    <ListItemIcon>
                      <DashboardOutlinedIcon fontSize="small" color={isActive('/dashboard') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="My Media" />
                  </MenuItem>

                  <MenuItem 
                    onClick={handleCloseNavMenu} 
                    component={RouterLink} 
                    to="/upload"
                    selected={isActive('/upload')}
                  >
                    <ListItemIcon>
                      <CloudUploadOutlinedIcon fontSize="small" color={isActive('/upload') ? 'primary' : 'inherit'} />
                    </ListItemIcon>
                    <ListItemText primary="Upload" />
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
          
          {/* Mobile Logo */}
          <CloudUploadOutlinedIcon 
            sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              mr: 1, 
              fontSize: 24,
              color: '#ecf0f1'
            }} 
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '-0.5px',
              color: '#ecf0f1',
              textDecoration: 'none'
            }}
          >
            Media Share
          </Typography>
          
          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
              component={RouterLink}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ 
                mx: 0.5, 
                my: 2, 
                color: '#ecf0f1', 
                px: 2.5,
                fontSize: '0.925rem',
                position: 'relative',
                backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                fontWeight: isActive('/') ? 600 : 400
              }}
              startIcon={<CollectionsOutlinedIcon />}
            >
              Gallery
            </Button>
            {isAuthenticated() && (
              <>
                <Button
                  component={RouterLink}
                  to="/dashboard"
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    mx: 0.5, 
                    my: 2, 
                    color: '#ecf0f1', 
                    px: 2.5,
                    fontSize: '0.925rem',
                    position: 'relative',
                    backgroundColor: isActive('/dashboard') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    fontWeight: isActive('/dashboard') ? 600 : 400
                  }}
                  startIcon={<DashboardOutlinedIcon />}
                >
                  My Media
                </Button>
                <Button
                  component={RouterLink}
                  to="/upload"
                  onClick={handleCloseNavMenu}
                  sx={{ 
                    mx: 0.5, 
                    my: 2, 
                    color: '#ecf0f1', 
                    px: 2.5,
                    fontSize: '0.925rem',
                    position: 'relative',
                    backgroundColor: isActive('/upload') ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    fontWeight: isActive('/upload') ? 600 : 400
                  }}
                  startIcon={<CloudUploadOutlinedIcon />}
                >
                  Upload
                </Button>
              </>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated() ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0.5,
                      border: '2px solid rgba(236, 240, 241, 0.3)'
                    }}
                  >
                    <Avatar 
                      alt={user?.displayName || 'User'} 
                      src={user?.avatar} 
                      sx={{ width: 34, height: 34 }} 
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 1,
                    sx: { 
                      minWidth: 200,
                      borderRadius: 1,
                      mt: 1,
                    }
                  }}
                >
                  <Box sx={{ px: 3, py: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={600} noWrap sx={{ color: '#2c3e50' }}>
                      {user?.displayName}
                    </Typography>
                    {user?.email && (
                      <Typography variant="body2" color="text.secondary" noWrap fontSize="0.8rem">
                        {user?.email}
                      </Typography>
                    )}
                  </Box>

                  <Divider />

                  <MenuItem 
                    onClick={handleCloseUserMenu} 
                    component={RouterLink} 
                    to="/dashboard"
                    sx={{ py: 1.2, px: 3 }}
                  >
                    <ListItemIcon>
                      <DashboardOutlinedIcon fontSize="small" sx={{ color: '#2c3e50' }} />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </MenuItem>

                  <MenuItem 
                    onClick={handleCloseUserMenu} 
                    component={RouterLink} 
                    to={`/profile/${user?.id}`}
                    sx={{ py: 1.2, px: 3 }}
                  >
                    <ListItemIcon>
                      <PersonOutlineOutlinedIcon fontSize="small" sx={{ color: '#2c3e50' }} />
                    </ListItemIcon>
                    <ListItemText primary="Profile" />
                  </MenuItem>

                  <Divider />

                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ py: 1.2, px: 3 }}
                  >
                    <ListItemIcon>
                      <LogoutOutlinedIcon fontSize="small" sx={{ color: '#e74c3c' }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: '#e74c3c' }} />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                disableElevation
                sx={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#2980b9',
                  },
                  fontWeight: 500,
                  px: 3,
                  py: 0.7,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontSize: '0.95rem'
                }}
              >
                Sign In
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 