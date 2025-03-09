import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Skeleton } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const DashboardPage = () => {
  const [resumes, setResumes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/resumes`);
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '2rem',
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

      {/* Main Content */}
      <Box
        sx={{
          zIndex: 1,
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          padding: '2rem',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
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
            Dashboard
          </Typography>
        </motion.div>

        {/* Uploaded Resumes Section */}
        <Paper
          sx={{
            backgroundColor: '#111111',
            border: '2px solid cyan',
            boxShadow: '0px 0px 15px cyan',
            padding: '2rem',
            width: '100%', // Make the box full width
            maxHeight: '600px', // Set a max height for the box
            overflow: 'auto', // Add scroll if content overflows
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'Orbitron', color: 'cyan', mb: 2 }}>
            Uploaded Resumes
          </Typography>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: '#222' }} />
          ) : resumes && resumes.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'cyan' }}><b>Filename</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Name</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Email</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Phone</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>GitHub</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>LinkedIn</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Skills</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'white' }}>{resume.filename || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.name || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.email || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.phone || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.github || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.linkedin || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.skills.join(", ") || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography sx={{ color: 'white' }}>No resumes uploaded yet.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;