import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableHead, TableRow, TableCell, TableBody, Paper, Skeleton, Button, Dialog, DialogTitle, DialogActions } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';

const DashboardPage = () => {
  const [resumes, setResumes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/resumes`);
      console.log('Fetched resumes:', response.data);
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    if (!resumeId) {
      console.error("Invalid resume ID:", resumeId);
      return;
    }

    try {
      console.log("Deleting Resume with ID:", resumeId);
      const response = await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/resumes/${resumeId}`);

      if (response.status === 200) {
        console.log("Delete response:", response.data);
        alert("Resume deleted successfully!");
        setResumes((prevResumes) =>
          prevResumes.filter((resume) => getResumeId(resume) !== resumeId)
        );
      } else {
        console.error("Failed to delete resume:", response);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
    }
  };

  const getResumeId = (resume) => {
    return resume.id || resume._id || resume.docId || "";
  };

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
      </motion.div>

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

        <Paper
          sx={{
            backgroundColor: '#111111',
            border: '2px solid cyan',
            boxShadow: '0px 0px 15px cyan',
            padding: '2rem',
            width: '100%',
            maxHeight: '600px',
            overflow: 'auto',
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
                  <TableCell sx={{ color: 'cyan' }}><b>Name</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Email</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Phone</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>GitHub</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>LinkedIn</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Skills</b></TableCell>
                  <TableCell sx={{ color: 'cyan' }}><b>Action</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumes.map((resume, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: 'white' }}>{resume.name || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.email || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.phone || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.github || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.linkedin || "N/A"}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{resume.skills?.join(", ") || "N/A"}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          const resumeId = getResumeId(resume);
                          console.log(`Selected Resume ID for deletion: ${resumeId}`);
                          setSelectedResumeId(resumeId);
                          setOpenDialog(true);
                        }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography sx={{ color: 'white' }}>No resumes uploaded yet.</Typography>
          )}
        </Paper>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontFamily: 'Orbitron', fontWeight: 'bold', textAlign: 'center' }}>
          Confirm Deletion
        </DialogTitle>
        <DialogActions sx={{ justifyContent: 'center', padding: '1rem' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ fontFamily: 'Rajdhani' }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete(selectedResumeId);
              setOpenDialog(false);
            }}
            color="error"
            variant="contained"
            sx={{ fontFamily: 'Rajdhani' }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
