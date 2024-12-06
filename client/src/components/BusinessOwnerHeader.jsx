import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

const BusinessOwnerHeader = ({ buttonText, onClick, onLogout }) => {
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#ffffff', // White background, update to red if needed
        boxShadow: 'none',
        borderBottom: '1px solid #d8d8d8',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingY: 1,
        }}
      >
        {/* Logo and Title */}
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
            Bite Check Business Owner Dashboard
          </Typography>
        </Box>

        {/* Navigation Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Add Restaurant Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#d32323', // Same red color as your home page header
              color: '#ffffff',
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                backgroundColor: '#b81e1e',
              },
            }}
            onClick={onClick}
          >
            {buttonText || 'Add Restaurant'}
          </Button>

          {/* Logout Button */}
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#d32323', // Same red color as your home page header
              color: '#ffffff',
              textTransform: 'none',
              fontSize: 16,
              '&:hover': {
                backgroundColor: '#b81e1e',
              },
            }}
            onClick={onLogout} // Attach the onLogout handler
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BusinessOwnerHeader;
