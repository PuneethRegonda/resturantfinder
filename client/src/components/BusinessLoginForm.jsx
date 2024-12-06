import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { loginUser } from '../services/authService';

const BusinessLoginForm = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await loginUser(email, password);
      if (response.data.roles.includes('BUSINESS') || response.data.roles.includes('ADMIN')) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userRoles', JSON.stringify(response.data.roles));
        onLoginSuccess(response.data.roles);
      } else {
        setError('Invalid role for Business/Admin login');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default BusinessLoginForm;