import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const ResumeDetailsPage = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumeDetails = async () => {
      try {
        const response = await axios.get(`/api/resumes/${id}`);
        setResume(response.data);
      } catch (error) {
        console.error('Error fetching resume details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeDetails();
  }, [id]);

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
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Left AI-themed Side */}
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '10%',
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      />
      
      <motion.img
        src="https://source.unsplash.com/400x900/?ai,technology"
        alt="AI Design Left"
        style={{ position: 'fixed', left: 0, width: '10%', height: '100vh', objectFit: 'cover', opacity: 0.2 }}
        animate={{ opacity: [0, 0.3, 0.5] }}
        transition={{ duration: 2 }}
      />

      {/* Right AI-themed Side */}
      <Box
        sx={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '10%',
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      />
      
      <motion.img
        src="https://source.unsplash.com/400x900/?resume,futuristic"
        alt="AI Design Right"
        style={{ position: 'fixed', right: 0, width: '10%', height: '100vh', objectFit: 'cover', opacity: 0.2 }}
        animate={{ opacity: [0, 0.3, 0.5] }}
        transition={{ duration: 2 }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ width: '80%', maxWidth: '1200px', margin: '0 auto', paddingTop: '4rem' }}
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
          Resume Details
        </Typography>

        <Box
          sx={{
            backgroundColor: '#111111',
            border: '2px solid cyan',
            boxShadow: '0px 0px 15px cyan',
            borderRadius: '8px',
            padding: '2rem',
            textAlign: 'left',
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            Name: <span style={{ color: 'white' }}>{resume.name}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            Email: <span style={{ color: 'white' }}>{resume.email}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            Skills: <span style={{ color: 'white' }}>{resume.skills.join(', ')}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            Experience: <span style={{ color: 'white' }}>{resume.experience} years</span>
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );
};

export default ResumeDetailsPage;