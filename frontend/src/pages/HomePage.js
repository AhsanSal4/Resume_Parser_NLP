import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const HomePage = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Left AI-themed Design */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '20%',
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <motion.img
          src="https://source.unsplash.com/400x900/?ai,technology,neural"
          alt="AI Design Left"
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            opacity: 0.2,
          }}
          animate={{ opacity: [0, 0.3, 0.5] }}
          transition={{ duration: 2 }}
        />
      </Box>

      {/* Right AI-themed Design */}
      <Box
        sx={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '20%',
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      >
        <motion.img
          src="https://source.unsplash.com/400x900/?resume,futuristic,tech"
          alt="AI Design Right"
          style={{
            width: '100%',
            height: '100vh',
            objectFit: 'cover',
            opacity: 0.2,
          }}
          animate={{ opacity: [0, 0.3, 0.5] }}
          transition={{ duration: 2 }}
        />
      </Box>

      {/* Main Content (Now Fully Centered) */}
      <Box
        sx={{
          zIndex: 2,
          maxWidth: '60vw',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ marginBottom: '20px' }} // Slightly moved up
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Orbitron',
              fontWeight: 'bold',
              color: 'cyan',
              textShadow: '0px 0px 10px cyan',
              fontSize: { xs: '1.5rem', sm: '2.5rem', md: '3.5rem' },
            }}
          >
            Welcome to <span style={{ color: 'white' }}>PARSUME</span>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Rajdhani',
              color: 'white',
              marginBottom: '30px', // Increased spacing between text & button
              fontSize: { xs: '1rem', sm: '1.5rem' },
            }}
          >
            "Great teams start with great hires—upload resumes and build success!"
          </Typography>
        </motion.div>

        {/* Futuristic Animated Button */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'transparent',
              color: 'cyan',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              marginTop: '1rem',
              padding: '12px 30px',
              border: '2px solid cyan',
              borderRadius: '8px',
              textTransform: 'uppercase',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0px 0px 15px cyan',
              '&:hover': {
                backgroundColor: 'cyan',
                color: '#000',
                boxShadow: '0px 0px 25px cyan',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                width: '150%',
                height: '150%',
                background:
                  'linear-gradient(45deg, cyan, transparent, cyan, transparent)',
                top: '-50%',
                left: '-50%',
                opacity: 0.3,
                transform: 'rotate(45deg)',
                animation: 'glowEffect 4s infinite linear',
              },
            }}
            component={Link}
            to="/upload"
          >
            Upload Resume
          </Button>
        </motion.div>
      </Box>
    </Box>
  );
};

export default HomePage;
