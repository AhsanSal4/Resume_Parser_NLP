import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

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
      <Container style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Recommended Job Roles
      </Typography>
      <List>
        {jobRoles.map((job, index) => (
          <ListItem key={index}>
            <ListItemText primary={job.title} secondary={job.description} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default JobRolesPage;