import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#0a0a0a',
        padding: '1rem 0',
        boxShadow: '0px -2px 10px cyan',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography
          variant="body1"
          sx={{ color: 'white', fontFamily: 'Orbitron', fontSize: '1rem' }}
        >
          &copy; {new Date().getFullYear()} <span style={{ color: 'cyan' }}>PARSUME™</span>. All Rights Reserved.
        </Typography>
      </motion.div>
    </Box>
  );
};

export default Footer;
