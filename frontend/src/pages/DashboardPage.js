import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent, Button, Box, Skeleton } from '@mui/material';
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
    resumes: null, // Start with null to indicate data is not yet fetched
    jobMatches: null,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resumesResponse, jobMatchesResponse] = await Promise.all([
          axios.get('/api/resumes'),
          axios.get('/api/job-matches'),
        ]);
        setDashboardData({
          resumes: resumesResponse.data,
          jobMatches: jobMatchesResponse.data,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
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
      {/* Background Effects (Loads Instantly) */}
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
      

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ width: '90%', maxWidth: '1200px', margin: '0 auto', zIndex: 1 }}
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
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: 'Orbitron', color: 'cyan' }}>
                    Uploaded Resumes
                  </Typography>
                  {dashboardData.resumes ? (
                    <Swiper
                      modules={[Autoplay, Pagination, Navigation]}
                      spaceBetween={20}
                      slidesPerView={1}
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      navigation
                    >
                      {dashboardData.resumes.length > 0 ? (
                        dashboardData.resumes.map((resume) => (
                          <SwiperSlide key={resume.id}>
                            <Typography variant="body1">
                              <strong>{resume.name}</strong> - {resume.email}
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              component={Link}
                              to={`/resumes/${resume.id}`}
                              sx={{ color: 'cyan', borderColor: 'cyan' }}
                            >
                              View Details
                            </Button>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <Typography>No resumes uploaded yet.</Typography>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ bgcolor: '#222' }} />
                  )}
                </CardContent>
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
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: 'Orbitron', color: 'cyan' }}>
                    Job Matches
                  </Typography>
                  {dashboardData.jobMatches ? (
                    <Swiper
                      modules={[Autoplay, Pagination, Navigation]}
                      spaceBetween={20}
                      slidesPerView={1}
                      autoplay={{ delay: 3000, disableOnInteraction: false }}
                      pagination={{ clickable: true }}
                      navigation
                    >
                      {dashboardData.jobMatches.length > 0 ? (
                        dashboardData.jobMatches.map((job) => (
                          <SwiperSlide key={job.id}>
                            <Typography>
                              <strong>{job.title}</strong> - {job.company}
                            </Typography>
                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide>
                          <Typography>No job matches found.</Typography>
                        </SwiperSlide>
                      )}
                    </Swiper>
                  ) : (
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ bgcolor: '#222' }} />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default DashboardPage;
