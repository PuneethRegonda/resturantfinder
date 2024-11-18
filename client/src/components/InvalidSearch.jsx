import React from 'react';
import { Box, Typography } from '@mui/material';

const InvalidSearch = () => {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '900px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '4px',
        border: '1px solid #f5c6cb',
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
        Invalid Search Term
      </Typography>
      <Typography variant="body2">
        Please enter a valid search term. It must not contain special characters, long numbers (except valid pincodes), or exceed 20 words.
      </Typography>
    </Box>
  );
};

export default InvalidSearch;
