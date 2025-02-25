import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, List, ListItem, ListItemText, Box } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const JobRolesPage = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get('/api/job-roles');
        setJobRoles(response.data);
      } catch (error) {
        console.error('Error fetching job roles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#0a0a0a',
        }}
      >
        <CircularProgress sx={{ color: 'cyan' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Background Effects */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'radial-gradient(circle, #003366, #000)',
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

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{
          width: '80%',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingTop: '4rem',
          zIndex: 1, // Keeps content above background
          position: 'relative',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: 'Orbitron',
            fontWeight: 'bold',
            color: 'cyan',
            textShadow: '0px 0px 15px cyan',
            mb: 4,
          }}
        >
          Recommended Job Roles
        </Typography>

        <List
          sx={{
            backgroundColor: '#111111',
            border: '2px solid cyan',
            boxShadow: '0px 0px 15px cyan',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          {jobRoles.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  borderBottom: '1px solid cyan',
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'Rajdhani',
                        fontWeight: 'bold',
                        color: 'cyan',
                      }}
                    >
                      {job.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: 'Rajdhani',
                        color: 'white',
                      }}
                    >
                      {job.description}
                    </Typography>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </motion.div>
    </Box>
  );
};

export default JobRolesPage;
