import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

function ResumeUploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Check file type
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

      // Upload the resume
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/resumes/`, formData);
      
      // Parse the resume
      await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/resumes/${response.data.id}/parse/`);
      
      navigate(`/resumes/${response.data.id}`);
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError(err.response?.data?.error || 'Failed to upload and parse resume');
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload Resume
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper
        {...getRootProps()}
        sx={{
          p: 5,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#e3f2fd' : 'background.paper',
          border: '2px dashed #1976d2',
          mb: 3
        }}
      >
        <input {...getInputProps()} />
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress sx={{ mb: 2 }} />
            <Typography>Uploading and parsing resume...</Typography>
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Drag & drop your resume here
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              or click to select a file
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Supported formats: PDF, DOCX
            </Typography>
          </>
        )}
      </Paper>
      
      <Box textAlign="center">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          {...getRootProps()}
        >
          Select File
        </Button>
      </Box>
    </Box>
  );
}

export default ResumeUploadPage;