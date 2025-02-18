import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Container, CircularProgress } from '@mui/material';
import axios from 'axios';

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
      <Container style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Resume Details
      </Typography>
      <Typography variant="h6">Name: {resume.name}</Typography>
      <Typography variant="h6">Email: {resume.email}</Typography>
      <Typography variant="h6">Skills: {resume.skills.join(', ')}</Typography>
      <Typography variant="h6">Experience: {resume.experience} years</Typography>
    </Container>
  );
};

export default ResumeDetailsPage;