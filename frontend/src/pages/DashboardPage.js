import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import '@fontsource/orbitron';
import '@fontsource/rajdhani';
import 'swiper/swiper-bundle.css';

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
          width: '15%', // Reduced width
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      />
      
      <motion.img
        src="https://source.unsplash.com/400x900/?ai,technology"
        alt="AI Design Left"
        style={{ position: 'fixed', left: 0, width: '10%', height: '100vh', objectFit: 'cover', opacity: 0.2 }} // Reduced width
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
          width: '15%', // Reduced width
          background: 'radial-gradient(circle, #003366, #000)',
          display: { xs: 'none', md: 'block' },
        }}
      />
      
      <motion.img
        src="https://source.unsplash.com/400x900/?resume,futuristic"
        alt="AI Design Right"
        style={{ position: 'fixed', right: 0, width: '10%', height: '100vh', objectFit: 'cover', opacity: 0.2 }} // Reduced width
        animate={{ opacity: [0, 0.3, 0.5] }}
        transition={{ duration: 2 }}
      />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ width: '90%', maxWidth: '1700px', margin: '0 auto', paddingTop: '4rem' }} // Increased width
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

        <Grid container spacing={4} justifyContent="center">
          {/* Uploaded Resumes Section */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card
                sx={{
                  backgroundColor: '#111111',
                  border: '2px solid cyan',
                  boxShadow: '0px 0px 15px cyan',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Orbitron', color: 'cyan' }}>
                    Uploaded Resumes
                  </Typography>
                  <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    style={{ width: '100%', paddingBottom: '2rem' }}
                  >
                    {dashboardData.resumes.length > 0 ? (
                      dashboardData.resumes.map((resume) => (
                        <SwiperSlide key={resume.id}>
                          <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Typography variant="body1">
                              <strong>{resume.name}</strong> - {resume.email}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              component={Link}
                              to={`/resumes/${resume.id}`}
                              sx={{
                                marginTop: '0.5rem',
                                color: 'cyan',
                                borderColor: 'cyan',
                                '&:hover': { borderColor: 'white', color: 'white' },
                              }}
                            >
                              View Details
                            </Button>
                          </motion.div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide>
                        <Typography variant="body1">No resumes uploaded yet.</Typography>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </CardContent>
                <Box sx={{ padding: '1rem' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/upload"
                    sx={{
                      width: '100%',
                      backgroundColor: 'cyan',
                      color: '#0a0a0a',
                      '&:hover': { backgroundColor: 'white' },
                    }}
                  >
                    Upload New Resume
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>

          {/* Job Matches Section */}
          <Grid item xs={12} md={6}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Card
                sx={{
                  backgroundColor: '#111111',
                  border: '2px solid cyan',
                  boxShadow: '0px 0px 15px cyan',
                  color: 'white',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Orbitron', color: 'cyan' }}>
                    Job Matches
                  </Typography>
                  <Swiper
                    modules={[Autoplay, Pagination, Navigation]}
                    spaceBetween={20}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    navigation
                    style={{ width: '100%', paddingBottom: '2rem' }}
                  >
                    {dashboardData.jobMatches.length > 0 ? (
                      dashboardData.jobMatches.map((job) => (
                        <SwiperSlide key={job.id}>
                          <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Typography variant="body1">
                              <strong>{job.title}</strong> - {job.company}
                            </Typography>
                            <Typography variant="body2">{job.description}</Typography>
                          </motion.div>
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide>
                        <Typography variant="body1">No job matches found.</Typography>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </CardContent>
                <Box sx={{ padding: '1rem' }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/job-roles"
                    sx={{
                      width: '100%',
                      backgroundColor: 'cyan',
                      color: '#0a0a0a',
                      '&:hover': { backgroundColor: 'white' },
                    }}
                  >
                    View All Job Roles
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default DashboardPage;