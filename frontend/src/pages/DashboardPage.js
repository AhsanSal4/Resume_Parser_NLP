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


  const getResumeId = (resume) => {
    // Try different possible ID field names used in Firestore
    return resume.id || resume._id || resume.docId;
  };


  const handleDelete = async (resumeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/delete_resume/${resumeId}`);
      setResumes(resumes.filter((resume) => resume.id !== resumeId)); // Remove deleted resume from UI
       alert('Resume deleted successfully!');
    } catch (error) {
      console.error('Failed to delete resume:', error);
    }
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
      />

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
                {resumes.map((resume, index) => {
                  // Log each resume to see its structure
                  console.log(`Resume ${index}:`, resume);
                  return (
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
                            console.log(`Setting selectedResumeId to: ${resumeId}`);
                            setSelectedResumeId(resumeId);
                            setOpenDialog(true);
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}

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
          <Button onClick={handleDelete} color="error" variant="contained" sx={{ fontFamily: 'Rajdhani' }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
