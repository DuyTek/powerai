import React from 'react';
import { Typography, Box } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        mt: 'auto',
        backgroundColor: '#333',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        © 2025 Test Automation Platform | All rights reserved.
      </Typography>
    </Box>
  );
};
