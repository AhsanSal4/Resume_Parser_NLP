import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, CircularProgress, Box , Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const ResumeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false); // For delete confirmation dialog
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/resumes/${id}`);
        setResume(response.data);
      } catch (err) {
        console.error('Error fetching resume details:', err);
        setError(err.response?.data?.error || 'Failed to fetch resume details');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resumes/${id}`);
      alert("Resume deleted successfully!");
      navigate("/dashboard"); // Redirect to dashboard after deletion
    } catch (err) {
      alert("Error deleting resume: " + (err.response?.data?.error || "Unknown error"));
    }
  };

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

  if (error) {
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
        <Alert severity="error" sx={{ backgroundColor: '#ff1744', color: 'white' }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!resume) {
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
        <Alert severity="warning" sx={{ backgroundColor: '#ffa726', color: 'white' }}>
          No resume data found.
        </Alert>
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
            Resume Details
          </Typography>
        </motion.div>

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
            Phone: <span style={{ color: 'white' }}>{resume.phone}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            LinkedIn: <span style={{ color: 'white' }}>{resume.linkedin}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            GitHub: <span style={{ color: 'white' }}>{resume.github}</span>
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: 'Rajdhani', color: 'cyan', mb: 2 }}>
            Skills: <span style={{ color: 'white' }}>{resume.skills.join(", ")}</span>
          </Typography>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2, fontFamily: "Orbitron" }}
            onClick={() => setOpenConfirm(true)}
          >
            Delete Resume
          </Button>
        </Box>
      </Box>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Are you sure you want to delete this resume?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeDetailsPage;