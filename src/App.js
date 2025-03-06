// src/App.js
import React, {useCallback, useEffect, useMemo, useReducer} from 'react';
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
import {getAllQuestions} from './data/questionLoader';
import {createAppTheme} from './themes';
import {NAVIGATION} from './utils/constants';

// Create the application theme using the theme system
const theme = createAppTheme();

// Action types for the interview state reducer
const ACTIONS = {
  UPDATE_INTERVIEW_STATE: 'UPDATE_INTERVIEW_STATE',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  UPDATE_GRADE: 'UPDATE_GRADE',
  UPDATE_NOTES: 'UPDATE_NOTES',
  TOGGLE_SETTING: 'TOGGLE_SETTING',
  SELECT_ANSWER_POINT: 'SELECT_ANSWER_POINT',
  SET_ALL_QUESTIONS: 'SET_ALL_QUESTIONS',
};

// Initial state for the interview state
const initialInterviewState = {
  // Interview state
  selectedLanguage: 'java',
  currentQuestion: null,
  notesMap: {}, // Map of questionId -> notes
  gradesMap: {}, // Map of questionId -> grade (1-5)
  selectedAnswerPointsMap: {}, // Map of questionId -> {categoryIndex-pointIndex: boolean}

  // App-wide settings
  settings: {
    learningMode: false,
    hideAnsweredQuestions: false,
    hideAnsweredInRelated: false,
  },

  // All questions for search capability
  allQuestions: [],
};

// Reducer function for the interview state
function interviewReducer(state, action) {
  switch (action.type) {
    case ACTIONS.UPDATE_INTERVIEW_STATE:
      return {
        ...state,
        ...action.payload,
      };

    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    case ACTIONS.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload,
      };

    case ACTIONS.UPDATE_GRADE:
      return {
        ...state,
        gradesMap: {
          ...state.gradesMap,
          [action.payload.questionId]: action.payload.grade,
        },
      };

    case ACTIONS.UPDATE_NOTES:
      return {
        ...state,
        notesMap: {
          ...state.notesMap,
          [action.payload.questionId]: action.payload.notes,
        },
      };

    case ACTIONS.TOGGLE_SETTING:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload]: !state.settings[action.payload],
        },
      };

    case ACTIONS.SELECT_ANSWER_POINT:
      const {questionId, categoryPointKey} = action.payload;
      const currentPoints = state.selectedAnswerPointsMap[questionId] || {};
      const updatedPoints = {
        ...currentPoints,
        [categoryPointKey]: !currentPoints[categoryPointKey],
      };

      return {
        ...state,
        selectedAnswerPointsMap: {
          ...state.selectedAnswerPointsMap,
          [questionId]: updatedPoints,
        },
      };

    case ACTIONS.SET_ALL_QUESTIONS:
      return {
        ...state,
        allQuestions: action.payload,
      };

    default:
      return state;
  }
}

function App() {
  // Use useReducer for better state management
  const [state, dispatch] = useReducer(interviewReducer, initialInterviewState);

  // Destructure state for easier access
  const {
    selectedLanguage,
    currentQuestion,
    notesMap,
    gradesMap,
    selectedAnswerPointsMap,
    settings,
    allQuestions,
  } = state;

  // Load all questions for search capability
  useEffect(() => {
    const questions = getAllQuestions();
    dispatch({type: ACTIONS.SET_ALL_QUESTIONS, payload: questions});
  }, []);

  // Create memoized interview state object for passing to components
  const interviewState = useMemo(() => ({
    selectedLanguage,
    currentQuestion,
    notesMap,
    gradesMap,
    selectedAnswerPointsMap,
  }), [
    selectedLanguage,
    currentQuestion,
    notesMap,
    gradesMap,
    selectedAnswerPointsMap]);

  // Update interview state - memoized for stable reference
  const updateInterviewState = useCallback((updates) => {
    // If updates is a function, execute it to get the actual updates
    if (typeof updates === 'function') {
      dispatch({
        type: ACTIONS.UPDATE_INTERVIEW_STATE,
        payload: updates(interviewState),
      });
    } else {
      dispatch({type: ACTIONS.UPDATE_INTERVIEW_STATE, payload: updates});
    }
  }, [interviewState]);

  // Handle question selection from global search
  const handleQuestionSelect = useCallback((question) => {
    dispatch({type: ACTIONS.SET_CURRENT_QUESTION, payload: question});
  }, []);

  // Handle answer point selection - improved with direct state update
  const handleAnswerPointSelect = useCallback(
      (questionId, categoryPointKey) => {
        dispatch({
          type: ACTIONS.SELECT_ANSWER_POINT,
          payload: {questionId, categoryPointKey},
        });
      }, []);

  // Handle category selection from global search
  const handleCategorySelect = useCallback((categoryId) => {
    // This will be passed to InterviewPanel
    // We're not setting it here to avoid state duplication
  }, []);

  // Handle settings changes
  const handleSettingChange = useCallback((setting) => {
    dispatch({type: ACTIONS.TOGGLE_SETTING, payload: setting});
  }, []);

  return (
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Router>
          <MainLayout
              questions={allQuestions}
              categories={[]} // Will be loaded by components that need them
              gradesMap={gradesMap}
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