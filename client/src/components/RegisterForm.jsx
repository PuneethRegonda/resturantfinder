import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import API_ENDPOINTS from '../apiConfig'; // Import the centralized API URLs
import { fetchWithRequestId } from '../utils/api'; // Adjust the import path as needed

const RegisterForm = ({ onClose, onSignupSuccess }) => { // Added onSignupSuccess prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
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

      // Send the signup request
      const response = await fetchWithRequestId(API_ENDPOINTS.AUTH.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error?.message || 'Signup failed');
      }

      const data = await response.json();
      if (data.status === 'success' && data.data.token) {
        const token = data.data.token;

        // Save the token to localStorage
        localStorage.setItem('authToken', token);

        // Notify parent about signup success
        if (onSignupSuccess) {
          onSignupSuccess();
        }

        // Close the signup form
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
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
          borderColor: '#dcdcdc',
          borderRadius: '50px',
          color: '#000',
          textTransform: 'none',
          fontSize: '16px',
          ':hover': {
            backgroundColor: '#f7f7f7',
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
          backgroundColor: '#d32323',
          color: '#fff',
          marginBottom: 2,
          ':hover': {
            backgroundColor: '#b51e1e',
          },
        }}
      >
        Sign up
      </Button>
    </Box>
  );
};

export default RegisterForm;
