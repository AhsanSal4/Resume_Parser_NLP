import React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container maxWidth="md" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <Typography variant="h2" gutterBottom>
        Welcome to Resume Parser
      </Typography>
      <Typography variant="h5" gutterBottom>
        Upload your resume and find the best job matches!
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        to="/upload"
        style={{ marginTop: '2rem' }}
      >
        Upload Resume
      </Button>
    </Container>
  );
};

export default HomePage;