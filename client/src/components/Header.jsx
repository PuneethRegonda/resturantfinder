import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Menu,
  MenuItem as DropdownItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import SearchBar from './SearchBar';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AppHeader = ({ onSearch }) => {
  const [cuisineType, setCuisineType] = useState('');
  const [foodType, setFoodType] = useState('');
  const [priceLevel, setPriceLevel] = useState('');
  const [rating, setRating] = useState('');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for user menu

  // Check localStorage for token to determine if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Handle search with filters
  const handleSearch = (triggeredBy, query, isValid) => {
    if (isValid) {
      onSearch(triggeredBy, query, isValid);
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear token on logout
    setIsLoggedIn(false);
    setAnchorEl(null); // Close user menu
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#ffffff',
          color: '#000000',
          boxShadow: 'none',
          borderBottom: '1px solid #d8d8d8',
          paddingY: 1,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton edge="start" color="inherit" aria-label="logo" sx={{ marginRight: 1 }}>
              <BakeryDiningIcon sx={{ color: '#d32323', fontSize: 40 }} />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: '#000', fontWeight: 'bold', fontSize: 24 }}
            >
              Bite Check
            </Typography>
          </Box>

          {/* Filters Section */}
          <Box sx={{ display: 'flex', gap: 2, marginX: 4 }}>
            {/* Add filter dropdowns here */}
          </Box>

          {/* Search Section */}
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              maxWidth: '600px',
              marginX: 4,
            }}
          >
            <SearchBar onSearch={handleSearch} />
          </Box>

          {/* Auth Section */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <AccountCircleIcon sx={{ fontSize: 32 }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <DropdownItem onClick={() => setAnchorEl(null)}>Profile</DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  sx={{
                    textTransform: 'none',
                    fontSize: 16,
                    marginRight: 2,
                    borderColor: '#d8d8d8',
                    '&:hover': { borderColor: '#000', backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                  }}
                  onClick={() => setOpenLoginDialog(true)}
                >
                  Log In
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    textTransform: 'none',
                    fontSize: 16,
                    backgroundColor: '#d32323',
                    '&:hover': { backgroundColor: '#b81e1e' },
                  }}
                  onClick={() => setOpenSignupDialog(true)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Login Dialog */}
      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
  <DialogTitle>
    Sign in to Bite Check
    <IconButton
      aria-label="close"
      onClick={() => setOpenLoginDialog(false)}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  <DialogContent>
    <LoginForm
    onClose={() => setOpenLoginDialog(false)}
    onLoginSuccess={() => {
      setIsLoggedIn(true); // Update AppHeader state
      setOpenLoginDialog(false); // Close login dialog
    }}
  />
  </DialogContent>
</Dialog>


      {/* Signup Dialog */}
      <Dialog open={openSignupDialog} onClose={() => setOpenSignupDialog(false)}>
        <DialogTitle>
          Sign up for Bite Check
          <IconButton
            aria-label="close"
            onClick={() => setOpenSignupDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
        <RegisterForm
          onClose={() => setOpenSignupDialog(false)}
          onSignupSuccess={() => {
            setIsLoggedIn(true); // Update AppHeader state
            setOpenSignupDialog(false); // Close signup dialog
          }}
        />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          Invalid search term. Please enter a valid query without special characters, excessive numbers, or too many words.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppHeader;
