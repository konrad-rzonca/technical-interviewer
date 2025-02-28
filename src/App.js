// src/App.js
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InterviewPanel from './components/InterviewPanel';
import GlobalSearch from './components/GlobalSearch';
import HealthCheck from './components/HealthCheck';
import ErrorBoundary from './components/ErrorBoundary';
import { categories, getAllQuestions } from './data/questionLoader';
import createAppTheme from './utils/theme';
import './styles/main.css'; // Note: We'll gradually phase this out

// Create the application theme
const theme = createAppTheme();

function App() {
  const [interviewState, setInterviewState] = useState({
    selectedLanguage: 'java',
    currentQuestion: null,
    notesMap: {}, // Map of questionId -> notes
    gradesMap: {}, // Map of questionId -> grade (1-5)
  });
  const [allQuestions, setAllQuestions] = useState([]);

  // Load all questions for search capability
  useEffect(() => {
    const questions = getAllQuestions();
    setAllQuestions(questions);
  }, []);

  const updateInterviewState = (updates) => {
    setInterviewState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  // Handle question selection from global search
  const handleQuestionSelect = (question) => {
    updateInterviewState({ currentQuestion: question });
  };

  // Handle category selection from global search
  const handleCategorySelect = (categoryId) => {
    // This will be passed to InterviewPanel
    // We're not setting it here to avoid state duplication
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: theme.palette.background.light,
          overflow: 'auto',
          minHeight: { xs: '600px', sm: '700px', md: '800px' }
        }}>
          {/* Global Search - Only shown on main interview page */}
          <Routes>
            <Route
              path="/"
              element={
                <Box sx={{
                  position: 'fixed',
                  top: 12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: theme.zIndex.appBar,
                  width: '50%',
                  maxWidth: 600,
                  minWidth: 300
                }}>
                  <GlobalSearch
                    questions={allQuestions}
                    categories={categories}
                    onQuestionSelect={handleQuestionSelect}
                    onCategorySelect={handleCategorySelect}
                    gradesMap={interviewState.gradesMap}
                  />
                </Box>
              }
            />
          </Routes>

          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <Box sx={{ pt: 7 }}> {/* Add padding for the fixed search bar */}
                  <InterviewPanel
                    interviewState={interviewState}
                    updateInterviewState={updateInterviewState}
                  />
                </Box>
              </ErrorBoundary>
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