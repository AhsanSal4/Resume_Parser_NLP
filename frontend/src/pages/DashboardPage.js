import React, { useEffect, useState } from 'react';
import { Typography, Container, CircularProgress, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState({
    resumes: [],
    jobMatches: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resumesResponse = await axios.get('/api/resumes');
        const jobMatchesResponse = await axios.get('/api/job-matches');
        setDashboardData({
          resumes: resumesResponse.data,
          jobMatches: jobMatchesResponse.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Uploaded Resumes Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uploaded Resumes
              </Typography>
              {dashboardData.resumes.length > 0 ? (
                dashboardData.resumes.map((resume) => (
                  <div key={resume.id} style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1">
                      <strong>{resume.name}</strong> - {resume.email}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/resumes/${resume.id}`}
                      style={{ marginTop: '0.5rem' }}
                    >
                      View Details
                    </Button>
                  </div>
                ))
              ) : (
                <Typography variant="body1">No resumes uploaded yet.</Typography>
              )}
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to="/upload"
                style={{ marginTop: '1rem' }}
              >
                Upload New Resume
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Job Matches Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Matches
              </Typography>
              {dashboardData.jobMatches.length > 0 ? (
                dashboardData.jobMatches.map((job) => (
                  <div key={job.id} style={{ marginBottom: '1rem' }}>
                    <Typography variant="body1">
                      <strong>{job.title}</strong> - {job.company}
                    </Typography>
                    <Typography variant="body2">{job.description}</Typography>
                  </div>
                ))
              ) : (
                <Typography variant="body1">No job matches found.</Typography>
              )}
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to="/job-roles"
                style={{ marginTop: '1rem' }}
              >
                View All Job Roles
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;