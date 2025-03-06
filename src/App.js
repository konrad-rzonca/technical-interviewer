// src/App.js
import React, {useEffect, useState} from 'react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import InterviewPanel from './components/InterviewPanel';
import CodingPanel from './components/coding/CodingPanel';
import BestPracticesPanel from './components/best-practises/BestPracticesPanel';
import HealthCheck from './components/HealthCheck';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/MainLayout';
import {categories, getAllQuestions} from './data/questionLoader';
import {createAppTheme} from './themes';
import {NAVIGATION} from './utils/constants';

// Create the application theme using the theme system
const theme = createAppTheme();

function App() {
  const [interviewState, setInterviewState] = useState({
    selectedLanguage: 'java',
    currentQuestion: null,
    notesMap: {}, // Map of questionId -> notes
    gradesMap: {}, // Map of questionId -> grade (1-5)
    selectedAnswerPointsMap: {}, // Map of questionId -> {categoryIndex-pointIndex: boolean}
  });
  const [allQuestions, setAllQuestions] = useState([]);

  // App-wide settings
  const [settings, setSettings] = useState({
    learningMode: false,
    hideAnsweredQuestions: false,
    hideAnsweredInRelated: false,
  });

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

  // Handle answer point selection - improved with direct state update
  const handleAnswerPointSelect = (questionId, categoryPointKey) => {
    setInterviewState(prevState => {
      const currentPoints = prevState.selectedAnswerPointsMap[questionId] || {};
      const updatedPoints = {
        ...currentPoints,
        [categoryPointKey]: !currentPoints[categoryPointKey],
      };

      return {
        ...prevState,
        selectedAnswerPointsMap: {
          ...prevState.selectedAnswerPointsMap,
          [questionId]: updatedPoints,
        },
      };
    });
  };

  // Handle category selection from global search
  const handleCategorySelect = (categoryId) => {
    // This will be passed to InterviewPanel
    // We're not setting it here to avoid state duplication
  };

  // Handle settings changes
  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <MainLayout
              questions={allQuestions}
              categories={categories}
              gradesMap={interviewState.gradesMap}
              settings={settings}
              onSettingChange={handleSettingChange}
              onQuestionSelect={handleQuestionSelect}
              onCategorySelect={handleCategorySelect}
          >
            <Routes>
              <Route path={NAVIGATION.ROUTES.INTERVIEW} element={
                <ErrorBoundary>
                  <InterviewPanel
                      interviewState={interviewState}
                      updateInterviewState={updateInterviewState}
                      onAnswerPointSelect={handleAnswerPointSelect}
                      settings={settings}
                      onSettingChange={handleSettingChange}
                  />
                </ErrorBoundary>
              }/>
              <Route path={NAVIGATION.ROUTES.CODING} element={
                <ErrorBoundary>
                  <CodingPanel/>
                </ErrorBoundary>
              }/>
              <Route path={NAVIGATION.ROUTES.BEST_PRACTICES} element={
                <ErrorBoundary>
                  <BestPracticesPanel/>
                </ErrorBoundary>
              }/>
              <Route path={NAVIGATION.ROUTES.HEALTH} element={<HealthCheck/>}/>
              <Route path="*"
                     element={<Navigate to={NAVIGATION.ROUTES.INTERVIEW}
                                        replace/>}/>
            </Routes>
          </MainLayout>
        </Router>
      </ThemeProvider>
  );
}

export default App;