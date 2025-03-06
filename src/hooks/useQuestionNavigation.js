// src/hooks/useQuestionNavigation.js
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  getCategoryForQuestion,
  sortQuestionsByOrder,
} from '../data/questionLoader';

/**
 * Custom hook to manage question navigation state
 * Handles current question selection, navigation, and related functionality
 */
export function useQuestionNavigation(
    filteredQuestions,
    currentQuestion,
    updateInterviewState,
) {
  // Navigation state for ordered traversal
  const [navigationState, setNavigationState] = useState({
    orderedQuestions: [],
    currentIndex: -1,
  });

  // Update navigation state when filtered questions or current question changes
  useEffect(() => {
    let orderedQuestions = [];
    let currentIndex = -1;

    if (filteredQuestions.length > 0) {
      // Create ordered list for navigation
      orderedQuestions = sortQuestionsByOrder([...filteredQuestions]);

      currentIndex = currentQuestion
          ? orderedQuestions.findIndex(q => q.id === currentQuestion.id)
          : 0;

      if (currentIndex === -1) {
        currentIndex = 0;
      }
    }

    setNavigationState({
      orderedQuestions,
      currentIndex,
    });
  }, [filteredQuestions, currentQuestion]);

  // Navigate to next/previous question - optimized with useCallback
  const handleNavigateQuestion = useCallback(direction => {
    const {orderedQuestions, currentIndex} = navigationState;
    if (orderedQuestions.length <= 1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % orderedQuestions.length;
    } else {
      newIndex = (currentIndex - 1 + orderedQuestions.length) %
          orderedQuestions.length;
    }

    updateInterviewState({currentQuestion: orderedQuestions[newIndex]});
  }, [navigationState, updateInterviewState]);

  // Handle question selection - optimized with useCallback
  const handleQuestionSelect = useCallback(question => {
    // Find the category for this question
    const category = getCategoryForQuestion(question);

    // The category switching is handled by the caller if needed

    updateInterviewState({currentQuestion: question});
  }, [updateInterviewState]);

  // Return calculated current question position info
  const positionInfo = useMemo(() => {
    if (!navigationState.orderedQuestions.length) {
      return {current: 0, total: 0};
    }

    return {
      current: navigationState.currentIndex + 1,
      total: navigationState.orderedQuestions.length,
    };
  }, [navigationState]);

  return {
    handleNavigateQuestion,
    handleQuestionSelect,
    positionInfo,
  };
}