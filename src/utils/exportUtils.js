// src/utils/exportUtils.js
import {APP_CONSTANTS} from './constants';

/**
 * Transforms interview state into human-readable format for export
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 * @returns {Object} - Transformed data ready for export
 */
export const prepareInterviewDataForExport = (interviewState, allQuestions) => {
  // Create lookup maps for transforming IDs to readable names
  const questionTitleMap = {};
  const insightPointMap = {};

  // Process all questions to build lookup maps
  allQuestions.forEach(question => {
    // For question title lookup
    questionTitleMap[question.id] = question.shortTitle ||
        question.question.substring(0, 40);

    // For answer point lookup - create map of categoryIndex-pointIndex to point title
    insightPointMap[question.id] = {};
    if (question.answerInsights && Array.isArray(question.answerInsights)) {
      question.answerInsights.forEach((category, categoryIndex) => {
        if (category && category.points && Array.isArray(category.points)) {
          category.points.forEach((point, pointIndex) => {
            if (point && point.title) {
              const key = `${categoryIndex}-${pointIndex}`;
              insightPointMap[question.id][key] = point.title;
            }
          });
        }
      });
    }
  });

  // Transform maps to use descriptive keys instead of IDs
  const transformedNotesMap = {};
  const transformedGradesMap = {};
  const transformedPointsMap = {};

  // Transform notesMap
  Object.entries(interviewState.notesMap).forEach(([questionId, notes]) => {
    if (notes && notes.trim() !== '') { // Only include non-empty notes
      const title = questionTitleMap[questionId] || questionId;
      transformedNotesMap[title] = notes;
    }
  });

  // Transform gradesMap
  Object.entries(interviewState.gradesMap).forEach(([questionId, grade]) => {
    if (grade !== undefined && grade !== 0) { // Only include non-zero grades
      const title = questionTitleMap[questionId] || questionId;
      transformedGradesMap[title] = grade;
    }
  });

  // Transform selectedAnswerPointsMap to arrays of point titles
  Object.entries(interviewState.selectedAnswerPointsMap).
      forEach(([questionId, pointData]) => {
        const questionTitle = questionTitleMap[questionId] || questionId;
        const pointMap = insightPointMap[questionId] || {};

        // Only include questions with selected points
        if (Object.keys(pointData).length > 0) {
          // Create an array of selected point titles
          const selectedPointTitles = [];

          // Find selected points and add their titles to the array
          Object.entries(pointData).forEach(([pointKey, isSelected]) => {
            if (isSelected) {
              const pointTitle = pointMap[pointKey] || pointKey;
              selectedPointTitles.push(pointTitle);
            }
          });

          // Only add if there are selected points
          if (selectedPointTitles.length > 0) {
            transformedPointsMap[questionTitle] = selectedPointTitles;
          }
        }
      });

  return {
    timestamp: new Date().toISOString(),
    version: APP_CONSTANTS.VERSION,
    data: {
      notesMap: transformedNotesMap,
      gradesMap: transformedGradesMap,
      selectedAnswerPoints: transformedPointsMap,
    },
  };
};

/**
 * Export interview data as a JSON file
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 */
export const exportInterviewData = (interviewState, allQuestions) => {
  // Prepare the data for export
  const dataToExport = prepareInterviewDataForExport(interviewState,
      allQuestions);

  // Create a blob and download link
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([dataStr], {type: 'application/json'});
  const url = URL.createObjectURL(blob);

  // Create and trigger download
  const a = document.createElement('a');
  a.download = `interview-data-${new Date().toISOString().split('T')[0]}.json`;
  a.href = url;
  a.click();

  // Clean up
  URL.revokeObjectURL(url);
};

export default {
  prepareInterviewDataForExport,
  exportInterviewData,
};