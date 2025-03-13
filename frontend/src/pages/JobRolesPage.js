import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Fetch all resumes
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button } from "@mui/material";
import axios from "axios";
import { motion } from "framer-motion";
import "@fontsource/orbitron";
import "@fontsource/rajdhani";

const JobRolesPage = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]); // ✅ Store multiple resumes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRoles = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/resumes`);

        if (!response.data || response.data.length === 0) {
          throw new Error("No resumes found.");
        }

        console.log("📌 API Response:", response.data); // ✅ Debugging

        // ✅ Ensure job role extraction is correct
        setCandidates(response.data.map(resume => ({
          name: resume.name || "Unknown",
          jobRole: resume.job_role ?? "Not Assigned",  // ✅ Handle missing job roles
        })));
      } catch (err) {
        console.error("❌ Error fetching job roles:", err);
        setError("Failed to fetch job roles. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobRoles();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "2rem",
        overflow: "hidden",
        backgroundColor: "#0a0a0a",
      }}
    >
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: "radial-gradient(circle, #003366, #000)",
        }}
      />

      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "Orbitron",
            fontWeight: "bold",
            color: "cyan",
            textShadow: "0px 0px 15px cyan",
            mb: 4,
          }}
        >
          Candidate Job Role Dashboard
        </Typography>
      </motion.div>

      {error ? (
        <Typography variant="h6" sx={{ color: "red", fontFamily: "Rajdhani", mb: 4 }}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 800, backgroundColor: "#111111", border: "2px solid cyan", boxShadow: "0px 0px 15px cyan" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "cyan", fontWeight: "bold", textAlign: "center" }}>Candidate Name</TableCell>
                <TableCell sx={{ color: "cyan", fontWeight: "bold", textAlign: "center" }}>Suggested Job Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} sx={{ textAlign: "center", color: "white" }}>
                    <CircularProgress sx={{ color: "cyan" }} />
                  </TableCell>
                </TableRow>
              ) : (
                candidates.map((candidate, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>{candidate.name}</TableCell>
                    <TableCell sx={{ color: "white", textAlign: "center" }}>
                      {candidate.jobRole !== "Not Assigned" ? candidate.jobRole : "Job Role Pending"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Button onClick={() => navigate("/dashboard")} variant="contained" color="primary" sx={{ mt: 3 }}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default JobRolesPage;
