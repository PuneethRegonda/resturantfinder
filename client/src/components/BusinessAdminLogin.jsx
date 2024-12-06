import React, { useState } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import LoginForm from './LoginForm'; // Adjust import path as needed

const BusinessAdminLogin = () => {
  const [open, setOpen] = useState(true); // Control dialog visibility
  const [error, setError] = useState(''); // Error handling for login failures

  // Callback for successful login
  const handleLoginSuccess = (token, role) => {
    if (role === 'BUSINESS' || role === 'ADMIN') {
      localStorage.setItem('authToken', token); // Save token to localStorage
      alert('Login successful'); // Show success alert
      setOpen(false); // Close the dialog
    } else {
      setError('Invalid role for Business/Admin login');
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px', // Rounded corners
          },
        }}
        TransitionProps={{
          onExited: () => console.log('Dialog closed'), // Optional exit handler
        }}
      >
        <DialogTitle>Business/Admin Login</DialogTitle>
        <DialogContent>
          <LoginForm
            onLoginSuccess={handleLoginSuccess} // Pass callback to LoginForm
            error={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessAdminLogin;
