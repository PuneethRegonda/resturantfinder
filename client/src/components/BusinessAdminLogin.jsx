import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import LoginForm from './LoginForm'; // Adjust import path as needed

const BusinessAdminLogin = () => {
  const [open, setOpen] = useState(true); // Control dialog visibility
  const [error, setError] = useState(''); // Error handling for login failures
  const [role, setRole] = useState(null); // Store role for navigation
  const navigate = useNavigate(); // Navigation hook

  // Callback for successful login
  const handleLoginSuccess = (role) => {
    console.log('Login successful:', role); // Debug log
    if (role.includes('ADMIN') || role.includes('BUSINESS')) {
      // alert('Login successful'); // Show success alert
      setRole(role); // Save the role for navigation
      setOpen(false); // Close the dialog
    } else {
      setError('Invalid role for Business/Admin login');
    }
  };

  // Navigate based on role after dialog closes
  useEffect(() => {
    if (!open && role) {
      if (role.includes('ADMIN')) {
        navigate('/admin/duplicate-restaurants'); // Navigate to admin page
      } else if (role.includes('BUSINESS')) {
        navigate('/views'); // Navigate to business owner page
      }
    }
  }, [open, role, navigate]);

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
      >
        <DialogTitle>Business/Admin Login</DialogTitle>
        <DialogContent>
          <LoginForm
            onLoginSuccess={handleLoginSuccess} // Pass callback for login success
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
