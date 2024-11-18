import React from 'react';
import { Box, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f8f8f8',
        padding: '40px 20px',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Grid container spacing={4}>
        {/* About Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            About
          </Typography>
          <Box>
            {['About Bitecheck', 'Careers', 'Press', 'Investor Relations', 'Trust & Safety', 'Content Guidelines', 'Accessibility Statement', 'Terms of Service', 'Privacy Policy', 'Ad Choices', 'Your Privacy Choices'].map((text) => (
              <Link href="#" key={text} underline="hover" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
                {text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Discover Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Discover
          </Typography>
          <Box>
            {['Bitecheck Project Cost Guides', 'Collections', 'Talk', 'Events', 'Bitecheck Blog', 'Support', 'Bitecheck Mobile', 'Developers', 'RSS'].map((text) => (
              <Link href="#" key={text} underline="hover" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
                {text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Bitecheck for Business Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Bitecheck for Business
          </Typography>
          <Box>
            {['Bitecheck for Business', 'Business Owner Login', 'Claim your Business Page', 'Advertise on Bitecheck', 'Bitecheck for Restaurant Owners', 'Table Management', 'Business Success Stories', 'Business Support', 'Bitecheck Blog for Business'].map((text) => (
              <Link href="#" key={text} underline="hover" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
                {text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Languages and Cities Section */}
        <Grid item xs={12} md={3}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Languages
          </Typography>
          <Link href="#" underline="hover" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
            English
          </Link>
          <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 3, marginBottom: 2 }}>
            Cities
          </Typography>
          <Link href="#" underline="hover" color="textSecondary" display="block" sx={{ marginBottom: 1 }}>
            Explore a City
          </Link>
        </Grid>
      </Grid>

      {/* Copyright Section */}
      <Box sx={{ marginTop: 4, borderTop: '1px solid #e0e0e0', paddingTop: 2 }}>
        <Typography variant="body2" color="textSecondary">
          Copyright © 2004–2024 Bitecheck Inc. Bitecheck, <span style={{ color: 'red' }}>★</span>, and related marks are registered trademarks of Bitecheck.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Some Data By Acxiom
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
