import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const AdminHeader = ({ buttonText, onLogout }) => (
  <AppBar
    position="static"
    sx={{
      backgroundColor: '#d32f2f', // Red color
      boxShadow: 'none', // Removes elevation (shadow)
      width: '100vw', // Ensures it spans the full viewport width
    }}
  >
    <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Admin Panel
      </Typography>
      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </Toolbar>
  </AppBar>
);

export default AdminHeader;
