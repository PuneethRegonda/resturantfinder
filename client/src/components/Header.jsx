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
  // Central filters state
  const [filters, setFilters] = useState({
    cuisineType: '',
    foodType: '',
    priceLevel: '',
    rating: '',
  });

  // Snackbar state for showing errors
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Dialog states for Login and Signup
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for user menu

  // Check localStorage for token to determine if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearch = (triggeredBy, query, isValid) => {
    if (!isValid) {
      console.warn("Invalid search input");
      setOpenSnackbar(true); // Show error notification
      return;
    }
  
    // Prepare the search payload
    const searchPayload = {
      ...filters, // Include selected filters
      name: query.trim() || '', // Set search bar query
      page: 0, // Reset to first page on new search
      size: 20, // Default page size
      sortBy: 'rating', // Default sorting
    };
  
    console.log("Triggering search with payload:", searchPayload); // Debugging purposes
    onSearch(triggeredBy, searchPayload, true); // Pass the payload to parent component
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
            {/* Cuisine Type Filter */}
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={filters.cuisineType}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    cuisineType: e.target.value,
                  }))
                }
                label="Cuisine"
              >
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Thai">Thai</MenuItem>
              </Select>
            </FormControl>

            {/* Food Type Filter */}
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Food Type</InputLabel>
              <Select
                value={filters.foodType}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    foodType: e.target.value,
                  }))
                }
                label="Food Type"
              >
                <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
                <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
                <MenuItem value="Organic">Organic</MenuItem>
                <MenuItem value="Seafood">Seafood</MenuItem>
                <MenuItem value="Non-Veg">Non-Veg</MenuItem>
              </Select>
            </FormControl>

            {/* Price Level Filter */}
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Price</InputLabel>
              <Select
                value={filters.priceLevel}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    priceLevel: e.target.value,
                  }))
                }
                label="Price"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            {/* Rating Filter */}
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={filters.rating}
                onChange={(e) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    rating: e.target.value,
                  }))
                }
                label="Rating"
              >
                <MenuItem value={1}>1 Star</MenuItem>
                <MenuItem value={2}>2 Stars</MenuItem>
                <MenuItem value={3}>3 Stars</MenuItem>
                <MenuItem value={4}>4 Stars</MenuItem>
                <MenuItem value={5}>5 Stars</MenuItem>
              </Select>
            </FormControl>
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
            <SearchBar onSearch={(query, isValid) => handleSearch('SearchBar', query, isValid)} />
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
        </Toolbar>
      </AppBar>

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
