// src/hooks/useRelatedQuestions.js
import {useEffect, useMemo, useState} from 'react';
import {categories, getRelatedQuestions} from '../data/questionLoader';

/**
 * Custom hook to manage related questions
 * Handles loading, filtering, and interaction with related questions
 */
export function useRelatedQuestions(currentQuestion, gradesMap, hideAnswered) {
  const [relatedQuestionsList, setRelatedQuestionsList] = useState([]);

  // Load related questions when current question changes
  useEffect(() => {
    let related = [];

    if (currentQuestion) {
      related = getRelatedQuestions(currentQuestion.id);

      // Filter out any questions that point to themselves
      related = related.filter(q => q.id !== currentQuestion.id);

      // Enhance related questions with category name information
      related = related.map(q => {
        const categoryObj = categories.find(c => c.id === q.categoryId) || {};
        return {
          ...q,
          categoryName: categoryObj.name || '',
        };
      });
    }

    setRelatedQuestionsList(related);
  }, [currentQuestion]);

  // Filter related questions based on hideAnswered setting - memoized for performance
  const filteredRelatedQuestions = useMemo(() => {
    if (hideAnswered) {
      return relatedQuestionsList.filter(q => !gradesMap[q.id]);
    }
    return relatedQuestionsList;
  }, [relatedQuestionsList, hideAnswered, gradesMap]);

  // Sort questions by category and subcategory - memoized for performance
  const sortedQuestions = useMemo(() => {
    return [...filteredRelatedQuestions].sort((a, b) => {
      // First sort by category
      if (a.categoryName !== b.categoryName) {
        return a.categoryName.localeCompare(b.categoryName);
      }
      // Then by subcategory
      if (a.subcategoryName !== b.subcategoryName) {
        return a.subcategoryName.localeCompare(b.subcategoryName);
      }
      // Finally by question title
      return (a.shortTitle || a.question).localeCompare(
          b.shortTitle || b.question,
      );
    });
  }, [filteredRelatedQuestions]);

  return {
    relatedQuestionsList,
    filteredRelatedQuestions: sortedQuestions,
  };
}