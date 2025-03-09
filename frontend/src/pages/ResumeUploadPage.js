import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import axios from 'axios';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

function ResumeUploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/resumes/`, formData);
      navigate(`/resumes/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload and parse resume');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

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

      {/* Content Section */}
      <Box
        sx={{
          zIndex: 1,
          position: 'relative',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <Typography variant="h3" sx={{ fontFamily: 'Orbitron', fontWeight: 'bold', color: 'cyan', textShadow: '0px 0px 15px cyan', mb: 3 }}>
            Upload Your Resume
          </Typography>
        </motion.div>

        {error && (
          <Alert severity="error" sx={{ mb: 2, backgroundColor: '#ff1744', color: 'white' }}>
            {error}
          </Alert>
        )}

        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Paper
            {...getRootProps()}
            sx={{
              p: 5,
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragActive ? '#112233' : '#111111',
              border: '2px dashed cyan',
              boxShadow: '0px 0px 15px cyan',
              transition: 'all 0.3s ease-in-out',
              '&:hover': { borderColor: 'white', boxShadow: '0px 0px 25px white' },
            }}
          >
            <input {...getInputProps()} />
            {loading ? (
              <Box display="flex" flexDirection="column" alignItems="center">
                <CircularProgress sx={{ mb: 2, color: 'cyan' }} />
                <Typography sx={{ color: 'white' }}>Uploading and parsing resume...</Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ color: 'cyan', fontFamily: 'Orbitron', textShadow: '0px 0px 10px cyan' }}>
                  Drag & Drop Your Resume Here
                </Typography>
                <Typography sx={{ color: 'white', mt: 1, fontFamily: 'Rajdhani' }}>
                  or click to select a file
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                  Supported formats: PDF, DOCX
                </Typography>
              </>
            )}
          </Paper>
        </motion.div>
      </Box>
    </Box>
  );
}

export default ResumeUploadPage;