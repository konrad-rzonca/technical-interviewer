// src/App.js
import React, { useState } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InterviewPanel from './components/InterviewPanel';
import HealthCheck from './components/HealthCheck';
import './styles/main.css';

// Create a minimal theme with subtle colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#e3f2fd',
    },
    secondary: {
      main: '#757575',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
    success: {
      main: '#66bb6a',
      light: '#e8f5e9',
    },
    warning: {
      main: '#ffca28',
      light: '#fff8e1',
    }
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.875rem',
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 24,
          fontSize: '0.75rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
  },
});

function App() {
  const [interviewState, setInterviewState] = useState({
    selectedLanguage: 'java',
    currentQuestion: null,
    notesMap: {}, // Map of questionId -> notes
    gradesMap: {}, // Map of questionId -> grade (1-5)
  });

  const updateInterviewState = (updates) => {
    setInterviewState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fafafa' }}>
          <Routes>
            <Route path="/" element={
              <InterviewPanel
                interviewState={interviewState}
                updateInterviewState={updateInterviewState}
              />
            } />
            <Route path="/healtz" element={<HealthCheck />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;