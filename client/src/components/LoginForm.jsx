import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import API_ENDPOINTS from '../apiConfig'; // Import the centralized API URLs
import { fetchWithRequestId } from '../utils/api'; // Adjust the import path based on your project structure

const LoginForm = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetchWithRequestId('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }
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
    </Box>
  );
};

export default LoginForm;
