import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle login logic with validation
  const handleLogin = () => {
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

    // If no errors, proceed with login and close modal
    setError('');
    if (onClose) {
      onClose();
    }
    console.log('Login successful');
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
        Sign in to BiteCheck
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

      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        sx={{
          backgroundColor: '#d32323', // Set button color to red
          '&:hover': {
            backgroundColor: '#b71c1c', // Darker red on hover
          },
          marginBottom: 2,
        }}
      >
        Log in
      </Button>

      <Typography variant="body2" sx={{ marginTop: 2 }}>
        New to BiteCheck?{' '}
        <Typography
          component="span"
          sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Sign up
        </Typography>
      </Typography>
    </Box>
  );
};

export default LoginForm;
