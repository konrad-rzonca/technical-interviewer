// src/utils/exportUtils.js
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {isUbsTheme} from '../themes/themeUtils';
import {getSkillLevelStyles} from './styles';

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
  const questionDetailsMap = {};

  // Store the selectedAnswerPointsMap for use in HTML generation
  const selectedAnswerPointsMap = interviewState.selectedAnswerPointsMap || {};

  // Process all questions to build lookup maps
  allQuestions.forEach(question => {
    // For question title lookup
    questionTitleMap[question.id] = question.shortTitle ||
        question.question.substring(0, 40);

    // Store full question details
    questionDetailsMap[question.id] = {
      title: question.shortTitle || question.question,
      fullQuestion: question.question,
      skillLevel: question.skillLevel,
      categoryId: question.categoryId,
      subcategoryName: question.subcategoryName,
    };

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
      transformedNotesMap[questionId] = notes;
    }
  });

  // Transform gradesMap
  Object.entries(interviewState.gradesMap).forEach(([questionId, grade]) => {
    if (grade !== undefined && grade !== 0 && grade !== null) { // Only include non-zero grades
      transformedGradesMap[questionId] = grade;
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
            transformedPointsMap[questionId] = selectedPointTitles;
          }
        }
      });

  return {
    timestamp: new Date().toISOString(),
    data: {
      notesMap: transformedNotesMap,
      gradesMap: transformedGradesMap,
      selectedAnswerPoints: transformedPointsMap,
      questionDetails: questionDetailsMap,
      allQuestions: allQuestions, // Include full question data for answer insights
      selectedAnswerPointsMap: selectedAnswerPointsMap, // Pass the original selected points map
    },
  };
};

/**
 * Get the color for a skill level
 * @param {string} skillLevel - The skill level (basic, intermediate, advanced)
 * @returns {string} - The color
 */
const getSkillLevelColor = (skillLevel) => {
  const styles = getSkillLevelStyles(skillLevel);
  return styles.main || COLORS.primary.main;
};

/**
 * Get the category name from the category ID
 * @param {string} categoryId - The category ID
 * @returns {string} - The category name
 */
const getCategoryName = (categoryId) => {
  // Map of category IDs to readable names
  const categoryMap = {
    'core-java': 'Core Java',
    'concurrency-multithreading': 'Concurrency and Multithreading',
    'software-design': 'Software Design',
    'databases': 'Databases',
    'frameworks': 'Frameworks',
    'dsa': 'Data Structures & Algorithms',
    'engineering-practices': 'Engineering Practices',
  };

  return categoryMap[categoryId] || categoryId;
};

/**
 * Creates a star rating HTML with all 5 stars (empty if no rating)
 * @param {number} rating - Rating from 1-5 (or undefined/0 for empty rating)
 * @returns {string} - HTML with star rating
 */
const createStarRating = (rating = 0) => {
  let html = '';
  const fullStar = '★';
  const emptyStar = '☆';

  // Always show 5 stars, filled based on rating
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      html += `<span class="star full">${fullStar}</span>`;
    } else {
      html += `<span class="star empty">${emptyStar}</span>`;
    }
  }

  return html;
};

/**
 * Creates HTML for answer insights, highlighting selected points
 * @param {Array} answerInsights - Array of answer insights
 * @param {Object} selectedPoints - Object mapping categoryIndex-pointIndex to boolean
 * @returns {string} - HTML for answer insights
 */
const createAnswerInsightsHTML = (answerInsights = [], selectedPoints = {}) => {
  if (!answerInsights || !Array.isArray(answerInsights) ||
      answerInsights.length === 0) {
    return '';
  }

  let html = '<div class="answer-insights">';

  // Process each category (Basic, Intermediate, Advanced)
  answerInsights.forEach((category, categoryIndex) => {
    if (!category || !category.points || !Array.isArray(category.points) ||
        category.points.length === 0) {
      return;
    }

    const categoryName = category.category || 'Unknown';
    const levelClass = categoryName.toLowerCase();

    html += `
      <div class="insight-category">
        <div class="insight-header">
          <span class="insight-level insight-level-${levelClass}">${categoryName}</span>
        </div>
        <div class="points-container">
    `;

    // Process each point in this category
    category.points.forEach((point, pointIndex) => {
      if (!point || !point.title) {
        return;
      }

      const key = `${categoryIndex}-${pointIndex}`;
      const isSelected = !!selectedPoints[key];
      const levelColor = getSkillLevelColor(levelClass);

      html += `
        <div class="point-item ${isSelected ? 'selected' : 'unselected'}">
          <div class="point-indicator" style="background-color: ${levelColor};"></div>
          ${point.title}
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    // Add divider if not the last category
    if (categoryIndex < answerInsights.length - 1) {
      html += '<div class="insights-divider"></div>';
    }
  });

  html += '</div>';
  return html;
};

/**
 * Creates the HTML content for the export
 * @param {Object} exportData - The prepared export data
 * @returns {string} - HTML content for the report
 */
const createReportHTML = (exportData) => {
  const {timestamp, data} = exportData;
  const {
    notesMap,
    gradesMap,
    selectedAnswerPoints,
    questionDetails,
    allQuestions,
    selectedAnswerPointsMap,
  } = data;

  // Get all question IDs that have some data
  const allQuestionIds = new Set([
    ...Object.keys(notesMap || {}),
    ...Object.keys(gradesMap || {}),
    ...Object.keys(selectedAnswerPoints || {}),
  ]);

  // Filter out questions with no data
  const questionIds = Array.from(allQuestionIds).filter(id => {
    return (notesMap && notesMap[id]) ||
        (gradesMap && gradesMap[id]) ||
        (selectedAnswerPoints && selectedAnswerPoints[id]);
  });

  // Group questions by category then subcategory
  const questionsByCategoryAndSubcategory = {};

  questionIds.forEach(id => {
    const details = questionDetails[id] || {};
    const category = details.categoryId || 'other';
    const subcategory = details.subcategoryName || 'Other';

    if (!questionsByCategoryAndSubcategory[category]) {
      questionsByCategoryAndSubcategory[category] = {};
    }

    if (!questionsByCategoryAndSubcategory[category][subcategory]) {
      questionsByCategoryAndSubcategory[category][subcategory] = [];
    }

    questionsByCategoryAndSubcategory[category][subcategory].push(id);
  });

  // Determine active theme
  const useUbsTheme = isUbsTheme();
  const primaryColor = useUbsTheme ? '#EC0016' : COLORS.primary.main;

  // Start building HTML
  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Technical Review Notes</title>
      <style>
        /* Global styles */
        body {
          font-family: ${useUbsTheme
      ? '"UBS Sans", "Helvetica Neue", Arial, sans-serif'
      : TYPOGRAPHY.fontFamily};
          line-height: 1.5;
          color: ${COLORS.text.primary};
          background-color: ${COLORS.background.light};
          margin: 0;
          padding: 20px;
        }
        
        /* Container styles */
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: ${COLORS.background.paper};
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border-radius: ${useUbsTheme ? '4px' : `${SPACING.borderRadius}px`};
          padding: 30px;
        }
        
        /* Header styles */
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid ${COLORS.grey[200]};
        }
        
        .title {
          color: ${primaryColor};
          font-size: 22px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          margin: 0 0 8px 0;
        }
        
        .subtitle {
          color: ${COLORS.text.secondary};
          font-size: 12px;
          margin: 0;
        }
        
        /* Category styles */
        .category {
          margin-bottom: 35px;
        }
        
        .category-title {
          color: ${COLORS.text.primary};
          font-size: 18px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          margin: 0 0 15px 0;
          border-bottom: 1px solid ${COLORS.grey[300]};
          padding-bottom: 8px;
        }
        
        /* Subcategory styles */
        .subcategory {
          background-color: ${COLORS.grey[50]};
          border: 1px solid ${COLORS.grey[200]};
          border-radius: 8px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        
        .subcategory-header {
          background-color: ${COLORS.grey[100]};
          padding: 8px 12px;
          border-bottom: 1px solid ${COLORS.grey[200]};
        }
        
        .subcategory-title {
          margin: 0;
          font-size: 14px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          color: ${COLORS.text.secondary};
        }
        
        .questions-container {
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        /* Question card styles */
        .question-card {
          border: 1px solid ${COLORS.grey[200]};
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          background-color: white;
        }
        
        .question-header {
          display: flex;
          align-items: center;
          padding: 14px 16px;
          background-color: ${COLORS.grey[50]};
          border-bottom: 1px solid ${COLORS.grey[200]};
        }
        
        .skill-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
        }
        
        .question-title {
          font-size: 15px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          color: ${COLORS.text.primary};
          margin: 0;
          flex-grow: 1;
          line-height: 1.4;
        }
        
        .question-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        /* Rating styles */
        .rating-container {
          min-height: 24px;
          display: flex;
          align-items: center;
        }
        
        .rating {
          display: flex;
          align-items: center;
        }
        
        .star {
          font-size: 18px;
          margin-right: 2px;
        }
        
        .star.full {
          color: ${COLORS.intermediate.main};
        }
        
        .star.empty {
          color: ${COLORS.grey[300]};
        }
        
        /* Notes styles */
        .notes-container {
          min-height: 24px;
        }
        
        .notes {
          background-color: ${COLORS.grey[50]};
          padding: 12px 14px;
          border-radius: 4px;
          border: 1px solid ${COLORS.grey[200]};
          white-space: pre-line;
          font-size: 14px;
          margin: 0;
          min-height: 24px;
        }
        
        /* Empty notes placeholder */
        .notes-placeholder {
          background-color: ${COLORS.grey[50]};
          padding: 12px 14px;
          border-radius: 4px;
          border: 1px solid ${COLORS.grey[200]};
          min-height: 24px;
        }
        
        /* Points styles */
        .points-container {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          min-height: 24px;
        }
        
        .point-item {
          display: flex;
          align-items: center;
          background-color: ${COLORS.grey[50]};
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 13px;
          border: 1px solid ${COLORS.grey[200]};
        }
        
        .point-item.selected {
          background-color: ${COLORS.grey[50]};
        }
        
        .point-item.unselected {
          background-color: ${COLORS.grey[50]};
          color: ${COLORS.grey[400]};
          opacity: 0.5;
        }
        
        .point-indicator {
          width: 8px;
          height: 8px;
          border-radius: 2px;
          margin-right: 6px;
          flex-shrink: 0;
        }
        
        /* Answer insights styles */
        .answer-insights {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        
        .insight-category {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .insight-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        
        .insight-level {
          font-size: 13px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          color: ${COLORS.text.secondary};
        }
        
        .insight-level-basic {
          color: ${COLORS.basic.main};
        }
        
        .insight-level-intermediate {
          color: ${COLORS.intermediate.main};
        }
        
        .insight-level-advanced {
          color: ${COLORS.advanced.main};
        }
        
        .insights-divider {
          height: 1px;
          background-color: ${COLORS.grey[200]};
          margin-top: 4px;
          margin-bottom: 8px;
        }
        
        /* Footer styles */
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: ${COLORS.text.secondary};
        }
        
        /* Print styles */
        @media print {
          body {
            background-color: white;
            padding: 0;
          }
          
          .container {
            box-shadow: none;
            max-width: 100%;
            padding: 20px;
          }
          
          .question-card {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          
          .subcategory {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header class="header">
          <h1 class="title">Technical Review Notes</h1>
          <p class="subtitle">Generated on ${new Date(
      timestamp).toLocaleDateString()} at ${new Date(
      timestamp).toLocaleTimeString()}</p>
        </header>
  `;

  // Process all categories and subcategories
  Object.keys(questionsByCategoryAndSubcategory).sort().forEach(categoryId => {
    const subcategories = questionsByCategoryAndSubcategory[categoryId];
    const categoryName = getCategoryName(categoryId);

    html += `
      <div class="category">
        <h2 class="category-title">${categoryName}</h2>
    `;

    // Process subcategories within this category
    Object.keys(subcategories).sort().forEach(subcategory => {
      const questionIds = subcategories[subcategory];

      html += `
        <div class="subcategory">
          <div class="subcategory-header">
            <h3 class="subcategory-title">${subcategory}</h3>
          </div>
          
          <div class="questions-container">
      `;

      // Sort questions within subcategory by skill level
      questionIds.sort((a, b) => {
        const levelA = questionDetails[a]?.skillLevel || 'basic';
        const levelB = questionDetails[b]?.skillLevel || 'basic';
        const levelOrder = {basic: 1, intermediate: 2, advanced: 3};

        return levelOrder[levelA] - levelOrder[levelB];
      });

      // Add each question in this subcategory
      questionIds.forEach(questionId => {
        const details = questionDetails[questionId] || {};
        const hasNotes = notesMap && notesMap[questionId];
        const hasGrade = gradesMap && gradesMap[questionId];
        const hasPoints = selectedAnswerPoints &&
            selectedAnswerPoints[questionId];
        const skillLevelColor = getSkillLevelColor(details.skillLevel);

        // Find the full question with answer insights
        const fullQuestion = allQuestions.find(q => q.id === questionId);

        html += `
          <div class="question-card">
            <div class="question-header">
              <div class="skill-indicator" style="background-color: ${skillLevelColor};"></div>
              <h4 class="question-title">${details.fullQuestion || questionId}</h4>
            </div>
            
            <div class="question-content">
              <!-- Rating section (always show stars) -->
              <div class="rating-container">
                <div class="rating">${createStarRating(
            gradesMap[questionId] || 0)}</div>
              </div>
              
              <!-- Notes section (empty box if no notes) -->
              <div class="notes-container">
                ${hasNotes
            ? `<p class="notes">${notesMap[questionId].trim().
                replace(/\n/g, '<br>')}</p>`
            : `<div class="notes-placeholder"></div>`
        }
              </div>
              
              <!-- Selected Points section -->
              <div class="points-container">
        `;

        // Add selected points if they exist
        if (hasPoints && Array.isArray(selectedAnswerPoints[questionId])) {
          const pointColors = ['basic', 'intermediate', 'advanced'];
          selectedAnswerPoints[questionId].forEach((point, idx) => {
            // Cycle through colors for visual variety
            const levelColor = getSkillLevelColor(
                pointColors[idx % pointColors.length]);
            html += `
              <div class="point-item selected">
                <div class="point-indicator" style="background-color: ${levelColor};"></div>
                ${point}
              </div>
            `;
          });
        }

        html += `
              </div>
              
              <!-- All Answer Insights grouped by level -->
              ${fullQuestion ? createAnswerInsightsHTML(
            fullQuestion.answerInsights || [],
            selectedAnswerPointsMap[questionId] || {},
        ) : ''}
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;
    });

    html += `
      </div>
    `;
  });

  html += `
        <footer class="footer">
          <p>Technical Interview Platform</p>
        </footer>
      </div>
    </body>
    </html>
  `;

  return html;
};

/**
 * Export interview data as an HTML file
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 */
export const exportInterviewData = (interviewState, allQuestions) => {
  // Prepare the data for export
  const dataToExport = prepareInterviewDataForExport(interviewState,
      allQuestions);

  // Generate the HTML content
  const htmlContent = createReportHTML(dataToExport);

  // Create a blob for the HTML file
  const blob = new Blob([htmlContent], {type: 'text/html'});
  const url = URL.createObjectURL(blob);

  // Create and trigger a download link
  const a = document.createElement('a');
  a.href = url;
  a.download = `technical-review-notes-${new Date().toISOString().
      split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export default {
  prepareInterviewDataForExport,
  exportInterviewData,
};