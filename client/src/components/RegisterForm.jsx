import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const RegisterForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Handle registration logic with validation
  const handleSubmit = () => {
    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Validate Password Length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    // Validate Password Match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // If no errors, proceed with registration
    setError('');
    console.log('Registration successful');

    // Call the onClose function to close the modal after a successful registration
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Sign up for BiteCheck
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: 3 }}>
        Connect with great local businesses
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        startIcon={
          <GoogleIcon 
            sx={{ 
              color: '#4285F4', 
              marginRight: 1,
              width: '20px', 
              height: '20px' 
            }} 
          />
        }
        sx={{
          marginBottom: 2,
          padding: '8px',
          borderColor: '#dcdcdc', // Light gray border color to match
          borderRadius: '50px', // Rounded corners to match the screenshots
          color: '#000', // Text color similar to Google button
          textTransform: 'none',
          fontSize: '16px', // Slightly larger font
          ':hover': {
            backgroundColor: '#f7f7f7', // Hover effect similar to the screenshot
            borderColor: '#dcdcdc',
          },
        }}
      >
        Continue with Google
      </Button>

      <Divider>or</Divider>

      {error && (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginTop: 3, marginBottom: 2 }}
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <TextField
        label="Confirm Password"
        type="password"
        variant="outlined"
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#d32323', // Red color to match the login button
          color: '#fff', // Text color should be white
          marginBottom: 2,
          ':hover': {
            backgroundColor: '#b51e1e', // Darker shade on hover
          },
        }}
      >
        Sign up
      </Button>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        Already on BiteCheck?{' '}
        <Typography
          component="span"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Log in
        </Typography>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
