import React, { useState, useEffect } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const images = ['/4.jpg', '/2.jpg', '/3.jpg']; // List of images

const HomePage = () => {
  const [currentImage, setCurrentImage] = useState(images[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        return images[(currentIndex + 1) % images.length]; // Cycle through images
      });
    }, 10000); // Switch every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '64px', // Space for header
        paddingBottom: '56px', // Space for footer
      }}
    >
      {/* Original Animated Background Effects */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'radial-gradient(circle,#003366,#000)',
        }}
      >
        {/* Glowing Grid Effect */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage:
              'linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '50px 50px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Particle Effects */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(circle, cyan 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />

        {/* Glow Effect */}
        <motion.div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.1) 0%, transparent 70%)',
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.div>

      {/* Main Content: Image & Text Section */}
      <Box
        sx={{
          zIndex: 2,
          maxWidth: '80vw',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Image Section (Switches Every 10s) */}
        <motion.img
          key={currentImage} // Triggers animation on change
          src={currentImage}
          alt="Resume Illustration"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{
            width: '40%',
            maxHeight: '400px',
            objectFit: 'contain',
            borderRadius: '10px',
            boxShadow: '0px 0px 15px cyan',
          }}
        />

        {/* Text & Button Section */}
        <Box sx={{ textAlign: 'center', maxWidth: { xs: '100%', md: '50%' } }}>
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
            Welcome to <span style={{ color: 'white' }}>ParSume</span>
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Rajdhani',
              color: 'white',
              marginBottom: '30px',
              fontSize: { xs: '1rem', sm: '1.5rem' },
            }}
          >
            "Great teams start with great hires—upload resumes and build success!"
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: 'transparent',
              color: 'cyan',
              fontWeight: 'bold',
              fontSize: '1.2rem',
              padding: '12px 30px',
              border: '2px solid cyan',
              borderRadius: '8px',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease-in-out',
              boxShadow: '0px 0px 15px cyan',
              '&:hover': {
                backgroundColor: 'cyan',
                color: '#000',
                boxShadow: '0px 0px 25px cyan',
              },
            }}
            component={Link}
            to="/upload"
          >
            Upload Resume
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
