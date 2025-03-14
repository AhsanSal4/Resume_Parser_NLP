import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Typography, 
  CircularProgress, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Box, 
  Button, 
  Container 
} from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import "@fontsource/orbitron";
import "@fontsource/rajdhani";

const JobRolesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resumes`);

        if (!response.data || response.data.length === 0) {
          throw new Error("No resumes found.");
        }

        console.log("📌 API Response:", response.data);

        setCandidates(
          response.data.map((resume) => ({
            name: resume.name || "Unknown",
            jobRoles: resume.job_roles?.length ? resume.job_roles.join(", ") : "Job Role Pending",
          }))
        );
      } catch (err) {
        console.error("❌ Error fetching job roles:", err);
        setError("Failed to fetch job roles. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  // Background animation components
  const BackgroundEffects = () => (
    <>
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'radial-gradient(circle, #003366, #000)',
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
    </>
  );

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a0a0a",
        overflow: "hidden",
      }}
    > 
      {/* Background Effects */}
      <BackgroundEffects />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontFamily: 'Orbitron',
              fontWeight: 'bold',
              color: 'cyan',
              textShadow: '0px 0px 15px cyan',
              mb: 4,
            }}
          >
            Candidate Job Role Dashboard
          </Typography>
        </motion.div>

        {error ? (
          <Typography 
            variant="h6" 
            align="center"
            sx={{ 
              color: "red", 
              fontFamily: "Rajdhani", 
              mb: 4 
            }}
          >
            {error}
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mb: 4 }}>
            <TableContainer 
              component={Paper} 
              sx={{ 
                backgroundColor: "#111111", 
                border: "2px solid cyan", 
                boxShadow: "0px 0px 15px cyan"
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "cyan", fontWeight: "bold", textAlign: "center" }}>
                      Candidate Name
                    </TableCell>
                    <TableCell sx={{ color: "cyan", fontWeight: "bold", textAlign: "center" }}>
                      Suggested Job Roles
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ textAlign: "center", py: 4 }}>
                        <CircularProgress sx={{ color: "cyan" }} />
                      </TableCell>
                    </TableRow>
                  ) : (
                    candidates.map((candidate, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ color: "white", textAlign: "center" }}>
                          {candidate.name}
                        </TableCell>
                        <TableCell sx={{ color: "white", textAlign: "center" }}>
                          {candidate.jobRoles}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button 
            onClick={() => navigate("/dashboard")} 
            variant="contained" 
            color="primary"
          >
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default JobRolesPage;