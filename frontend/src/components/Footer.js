import React from 'react';
import { Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Container maxWidth="lg" style={{ textAlign: 'center', padding: '1rem 0' }}>
      <Typography variant="body1">
        &copy; {new Date().getFullYear()} Resume Parser. All rights reserved.
      </Typography>
    </Container>
  );
};

export default Footer;