// src/hooks/useEvaluationState.js
import {useCallback} from 'react';

/**
 * Custom hook to manage evaluation state (notes and grades)
 * Provides optimized handlers for updating evaluation data
 */
export function useEvaluationState(interviewState, updateInterviewState) {
  const {notesMap, gradesMap, selectedAnswerPointsMap} = interviewState;

  // Handle notes change - optimized with useCallback
  const handleNotesChange = useCallback((questionId, value) => {
    // Only update if value changed to avoid unnecessary renders
    if (notesMap[questionId] !== value) {
      updateInterviewState(prevState => ({
        ...prevState,
        notesMap: {
          ...prevState.notesMap,
          [questionId]: value,
        },
      }));
    }
  }, [notesMap, updateInterviewState]);

  // Handle grade change - optimized with useCallback
  const handleGradeChange = useCallback((questionId, value) => {
    // Only update if value changed to avoid unnecessary renders
    if (gradesMap[questionId] !== value) {
      updateInterviewState(prevState => ({
        ...prevState,
        gradesMap: {
          ...prevState.gradesMap,
          [questionId]: value,
        },
      }));
    }
  }, [gradesMap, updateInterviewState]);

  // Handle answer point selection - improved with direct state update
  const handleAnswerPointSelect = useCallback(
      (questionId, categoryPointKey) => {
        updateInterviewState(prevState => {
          const currentPoints = prevState.selectedAnswerPointsMap[questionId] ||
              {};
          // Only update if value changed
          if (currentPoints[categoryPointKey] ===
              !currentPoints[categoryPointKey]) {
            return prevState; // No change needed
          }

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
      }, [updateInterviewState]);

  return {
    handleNotesChange,
    handleGradeChange,
    handleAnswerPointSelect,
  };
}