// src/App.js - Updated imports
import React, {useEffect, useState} from 'react';
import {Box, CssBaseline, ThemeProvider} from '@mui/material';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import InterviewPanel from './components/InterviewPanel';
import GlobalSearch from './components/GlobalSearch';
import HealthCheck from './components/HealthCheck';
import ErrorBoundary from './components/ErrorBoundary';
import {categories, getAllQuestions} from './data/questionLoader';
import createAppTheme, {COLORS, SPACING} from './utils/theme';

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
      ...updates,
    }));
  };

  // Handle question selection from global search
  const handleQuestionSelect = (question) => {
    updateInterviewState({currentQuestion: question});
  };

  // Handle category selection from global search
  const handleCategorySelect = (categoryId) => {
    // This will be passed to InterviewPanel
    // We're not setting it here to avoid state duplication
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            bgcolor: COLORS.background.light,
            overflow: 'auto',
          }}>
            {/* Global Search - Only shown on main interview page */}
            <Routes>
              <Route
                  path="/"
                  element={
                    <Box sx={{
                      position: 'fixed',
                      top: SPACING.toUnits(SPACING.sm),
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: theme.zIndex.appBar,
                      width: '50%',
                      maxWidth: 600,
                      minWidth: 300,
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
                  <Box sx={{
                    pt: SPACING.toUnits(SPACING.xl),
                  }}> {/* Add padding for the fixed search bar */}
                    <InterviewPanel
                        interviewState={interviewState}
                        updateInterviewState={updateInterviewState}
                    />
                  </Box>
                </ErrorBoundary>
              }/>
              <Route path="/healtz" element={<HealthCheck/>}/>
              <Route path="*" element={<Navigate to="/" replace/>}/>
            </Routes>
          </Box>
        </Router>
      </ThemeProvider>
  );
}

export default App;