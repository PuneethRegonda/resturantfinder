import React from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F89F1B', // LeetCode orange
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#222831', // Dark background
    },
    background: {
      default: '#F5F5F5', // Light gray background
      paper: '#ffffff',  // White cards
    },
    text: {
      primary: '#222831', // Dark text
      secondary: '#868E96', // Subtle gray text
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  shape: {
    borderRadius: 16, // Rounded corners
  },
});

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ThemeProvider>,
);
