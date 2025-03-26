import React from 'react';
import { Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const navItems = ["Home", "Upload", "Dashboard", "Job Roles","Visualization"];

const Header = () => {
  return (
    <Box
      position="fixed"
      sx={{
        backgroundColor: 'radial-gradient(circle,#003366,#000)',
        boxShadow: '0px 0px 15px cyan',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: '2px solid cyan',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* Futuristic Glowing Title */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.1, textShadow: '0px 0px 20px cyan' }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Orbitron',
              fontWeight: 'bold',
              color: 'cyan',
              textShadow: '0px 0px 10px cyan',
              cursor: 'pointer',
            }}
          >
            PARSUME
          </Typography>
        </motion.div>

        {/* Navigation Buttons with Futuristic Carousel Effect */}
        <Box sx={{ display: 'flex', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            whileHover={{ x: '-2%', transition: { duration: 1 } }}
            style={{ display: 'flex', gap: '1rem' }}
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.1,
                  textShadow: '0px 0px 15px cyan',
                  transition: { duration: 0.3 },
                }}
              >
                <Button
                  sx={{
                    color: 'white',
                    fontSize: { xs: '0.8rem', sm: '1rem' },
                    fontFamily: 'Rajdhani',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      color: 'cyan',
                      textShadow: '0px 0px 10px cyan',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      width: '100%',
                      height: '3px',
                      background: 'cyan',
                      bottom: 0,
                      left: '-100%',
                      transition: 'left 0.3s ease-in-out',
                    },
                    '&:hover::before': {
                      left: 0,
                    },
                  }}
                  component={Link}
                  to={`/${item.toLowerCase().replace(' ', '-')}`}
                >
                  {item}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Toolbar>
      </Box>
  );
};

export default Header;
