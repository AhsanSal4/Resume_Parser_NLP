import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages
import HomePage from './pages/HomePage';
import ResumeUploadPage from './pages/ResumeUploadPage';
import ResumeDetailsPage from './pages/ResumeDetailsPage';
import JobRolesPage from './pages/JobRolesPage';
import DashboardPage from './pages/DashboardPage'; // Import the new DashboardPage

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <Container maxWidth="lg" style={{ minHeight: 'calc(100vh - 120px)', paddingTop: '2rem', paddingBottom: '2rem' }}>
          <Routes>
            <Route path="/upload" element={<ResumeUploadPage />} />
            <Route path="/resumes/:id" element={<ResumeDetailsPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} /> 
            <Route path="/job-roles" element={<JobRolesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} /> {/* Add DashboardPage route */}
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;