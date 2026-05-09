// src/App.js
import React, {useCallback, useEffect, useState} from 'react';
import {CssBaseline, ThemeProvider} from '@mui/material';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import InterviewPanel from './components/InterviewPanel';
import PreparationPanel from './components/preparation/PreparationPanel';
import CodingPanel from './components/coding/CodingPanel';
import BestPracticesPanel from './components/best-practises/BestPracticesPanel';
import HealthCheck from './components/HealthCheck';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './components/MainLayout';
import {categories, getAllQuestions} from './data/questionLoader';
import {createAppTheme} from './themes';
import {NAVIGATION} from './utils/constants';
import storageService from './services/storageService';
import {createEmptyPreparationState} from './utils/preparationProgress';

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
  const [selectedCategory, setSelectedCategory] = useState(
      categories[0]?.id || '');
  const [preparationSelectedCategory, setPreparationSelectedCategory] =
      useState(categories[0]?.id || '');
  const [preparationState, setPreparationState] = useState(() =>
      createEmptyPreparationState());
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  // Load saved preparation state from localStorage on app initialization
  useEffect(() => {
    if (storageService.isStorageAvailable()) {
      const savedState = storageService.loadPreparationState();
      if (savedState) {
        setPreparationState({
          ...createEmptyPreparationState(),
          progressMap: savedState.progressMap || {},
          practiceSequence: Number(savedState.practiceSequence || 0),
        });
      }
    }
  }, []);

  // Load saved interview state from localStorage on app initialization
  useEffect(() => {
    if (storageService.isStorageAvailable()) {
      const savedState = storageService.loadInterviewState();
      if (savedState) {
        setInterviewState(prevState => ({
          ...prevState,
          notesMap: savedState.notesMap || {},
          gradesMap: savedState.gradesMap || {},
          selectedAnswerPointsMap: savedState.selectedAnswerPointsMap || {},
          // Don't restore currentQuestion to avoid navigation issues
        }));
      }
    }
  }, []);

  const updatePreparationState = useCallback((updates) => {
    setPreparationState(prevState => {
      const newState = {
        ...prevState,
        ...updates,
      };

      if (storageService.isStorageAvailable()) {
        storageService.debouncedSavePreparationState({
          progressMap: newState.progressMap || {},
          practiceSequence: Number(newState.practiceSequence || 0),
        });
      }

      return newState;
    });
  }, []);

  const updateInterviewState = useCallback((updates) => {
    setInterviewState(prevState => {
      const newState = {
        ...prevState,
        ...updates,
      };

      // Save to localStorage after update
      if (storageService.isStorageAvailable()) {
        const stateToSave = {
          notesMap: newState.notesMap,
          gradesMap: newState.gradesMap,
          selectedAnswerPointsMap: newState.selectedAnswerPointsMap,
          // Don't save currentQuestion as it's navigation state
        };
        storageService.debouncedSaveInterviewState(stateToSave);
      }

      return newState;
    });
  }, []);

  // Handle question selection from global search
  const handleQuestionSelect = useCallback((question) => {
    updateInterviewState({currentQuestion: question});
  }, [updateInterviewState]);

  const handlePreparationCategorySelect = useCallback((categoryId) => {
    if (!categoryId) return;
    setPreparationSelectedCategory(categoryId);
  }, []);

  // Handle answer point selection - improved with direct state update
  const handleAnswerPointSelect = (questionId, categoryPointKey) => {
    setInterviewState(prevState => {
      const currentPoints = prevState.selectedAnswerPointsMap[questionId] || {};
      const updatedPoints = {
        ...currentPoints,
        [categoryPointKey]: !currentPoints[categoryPointKey],
      };

      const newState = {
        ...prevState,
        selectedAnswerPointsMap: {
          ...prevState.selectedAnswerPointsMap,
          [questionId]: updatedPoints,
        },
      };

      // Save to localStorage after update
      if (storageService.isStorageAvailable()) {
        const stateToSave = {
          notesMap: newState.notesMap,
          gradesMap: newState.gradesMap,
          selectedAnswerPointsMap: newState.selectedAnswerPointsMap,
        };
        storageService.debouncedSaveInterviewState(stateToSave);
      }

      return newState;
    });
  };

  // Handle category selection from global search and sidebar navigation
  const handleCategorySelect = useCallback((categoryId, options = {}) => {
    if (!categoryId) return;

    setSelectedCategory(categoryId);

    if (!options.preserveCurrentQuestion) {
      updateInterviewState({currentQuestion: null});
    }
  }, [updateInterviewState]);

  // Handle settings changes
  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleClearPreparationState = useCallback(() => {
    setPreparationState(createEmptyPreparationState());
    if (storageService.isStorageAvailable()) {
      storageService.clearPreparationState();
    }
  }, []);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router basename="technical-interviewer">
          <MainLayout
              questions={allQuestions}
              categories={categories}
              gradesMap={interviewState.gradesMap}
              settings={settings}
              onSettingChange={handleSettingChange}
              onQuestionSelect={handleQuestionSelect}
              onCategorySelect={handleCategorySelect}
              onClearData={() => storageService.clearInterviewState()}
              interviewState={interviewState}
              selectedCategory={selectedCategory}
              onMobileDrawerOpen={() => setMobileDrawerOpen(true)}
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
                      selectedCategory={selectedCategory}
                      onCategorySelect={handleCategorySelect}
                      mobileDrawerOpen={mobileDrawerOpen}
                      onMobileDrawerClose={() => setMobileDrawerOpen(false)}
                  />
                </ErrorBoundary>
              }/>
              <Route path={NAVIGATION.ROUTES.PREPARATION} element={
                <ErrorBoundary>
                  <PreparationPanel
                      preparationState={preparationState}
                      updatePreparationState={updatePreparationState}
                      onClearPreparationState={handleClearPreparationState}
                      selectedCategory={preparationSelectedCategory}
                      onCategorySelect={handlePreparationCategorySelect}
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
