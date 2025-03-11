// src/utils/exportUtils.js
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {isUbsTheme} from '../themes/themeUtils';
import {getSkillLevelStyles} from './styles';
import {categories} from '../data/questionLoader';

// Constants
const MAX_ROWS_PER_COLUMN = 2;
const MIN_ITEMS_FOR_SUBCOLUMNS = 3;
const CONTAINER_WIDTH = '1200px';
const POINT_HEIGHT = '28px';
const CATEGORY_WIDTH = '33.33%';
const EMPTY_OPACITY = '0.4'; // Opacity for no-selected-content sections

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
 * Get the category name from the category ID using the imported categories
 * @param {string} categoryId - The category ID
 * @returns {string} - The category name
 */
const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
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
 * Check if a question has any actual content
 * @param {string} questionId - The question ID
 * @param {Object} notesMap - Map of questionId to notes
 * @param {Object} gradesMap - Map of questionId to grades
 * @param {Object} selectedAnswerPointsMap - Map of questionId to selected points
 * @returns {boolean} - Whether the question has any content
 */
const hasContent = (
    questionId, notesMap, gradesMap, selectedAnswerPointsMap) => {
  // Check if it has a non-empty note
  const hasNotes = notesMap && notesMap[questionId] &&
      notesMap[questionId].trim() !== '';

  // Check if it has a rating above 0
  const hasRating = gradesMap && gradesMap[questionId] &&
      gradesMap[questionId] > 0;

  // Check if it has at least one selected answer point
  const selectedPoints = selectedAnswerPointsMap &&
      selectedAnswerPointsMap[questionId];
  const hasSelectedPoints = selectedPoints &&
      Object.values(selectedPoints).some(Boolean);

  return hasNotes || hasRating || hasSelectedPoints;
};

/**
 * Transforms interview state into human-readable format for export
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 * @returns {Object} - Transformed data ready for export
 */
const prepareInterviewDataForExport = (interviewState, allQuestions) => {
  // Create lookup maps for transforming IDs to readable names
  const questionTitleMap = {};
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
  });

  // Transform maps to use descriptive keys instead of IDs
  const transformedNotesMap = {};
  const transformedGradesMap = {};

  // Transform notesMap
  Object.entries(interviewState.notesMap || {}).
      forEach(([questionId, notes]) => {
        if (notes && notes.trim() !== '') { // Only include non-empty notes
          transformedNotesMap[questionId] = notes;
        }
      });

  // Transform gradesMap
  Object.entries(interviewState.gradesMap || {}).
      forEach(([questionId, grade]) => {
        if (grade !== undefined && grade !== 0 && grade !== null) { // Only include non-zero grades
          transformedGradesMap[questionId] = grade;
        }
      });

  return {
    timestamp: new Date().toISOString(),
    data: {
      notesMap: transformedNotesMap,
      gradesMap: transformedGradesMap,
      questionDetails: questionDetailsMap,
      allQuestions: allQuestions, // Include full question data for answer insights
      selectedAnswerPointsMap: selectedAnswerPointsMap, // Pass the original selected points map
    },
  };
};

/**
 * Check if a category has any selected points
 * @param {number} categoryIndex - The index of the category
 * @param {Object} selectedPoints - Object mapping categoryIndex-pointIndex to boolean
 * @returns {boolean} - Whether the category has any selected points
 */
const hasCategorySelectedPoints = (categoryIndex, selectedPoints) => {
  return Object.keys(selectedPoints || {}).some(key => {
    const [catIdx, _] = key.split('-');
    return parseInt(catIdx) === categoryIndex && selectedPoints[key];
  });
};

/**
 * Creates HTML for answer insights with a horizontal layout matching the app's UI
 * @param {Array} answerInsights - Array of answer insights
 * @param {Object} selectedPoints - Object mapping categoryIndex-pointIndex to boolean
 * @returns {string} - HTML for answer insights
 */
const createAnswerInsightsHTML = (answerInsights = [], selectedPoints = {}) => {
  if (!answerInsights || !Array.isArray(answerInsights) ||
      answerInsights.length === 0) {
    return '';
  }

  // Check if there are any selected points at all
  const hasAnySelectedPoints = Object.values(selectedPoints || {}).
      some(Boolean);
  const containerClass = hasAnySelectedPoints
      ? 'has-selections'
      : 'no-selections';

  let html = `<div class="answer-insights-container ${containerClass}">`;

  // Process each category (Basic, Intermediate, Advanced)
  answerInsights.forEach((category, categoryIndex) => {
    if (!category || !category.points || !Array.isArray(category.points) ||
        category.points.length === 0) {
      return;
    }

    const categoryName = category.category || 'Unknown';
    const levelClass = categoryName.toLowerCase();
    const levelColor = getSkillLevelColor(levelClass);

    // Check if this category has any selected points
    const hasSelectedPoints = hasCategorySelectedPoints(categoryIndex,
        selectedPoints);
    const categoryClass = hasSelectedPoints
        ? 'has-selections'
        : 'no-selections';

    html += `<div class="insight-category insight-level-${levelClass} ${categoryClass}">`;

    // Calculate layout for points - matching AnswerCategory.js logic
    const validPoints = category.points.filter(p => p && p.title);
    const needsSubColumns = validPoints.length >= MIN_ITEMS_FOR_SUBCOLUMNS;

    if (needsSubColumns) {
      // Calculate number of columns needed for a balanced layout
      const columnCount = Math.ceil(validPoints.length / MAX_ROWS_PER_COLUMN);
      const pointsPerColumn = Math.ceil(validPoints.length / columnCount);

      // Create a grid for multiple columns
      html += '<div class="points-grid">';

      // Distribute points into columns
      for (let i = 0; i < columnCount; i++) {
        const startIdx = i * pointsPerColumn;
        const endIdx = Math.min(startIdx + pointsPerColumn, validPoints.length);
        const columnPoints = validPoints.slice(startIdx, endIdx);

        html += '<div class="points-column">';

        // Add points to this column
        columnPoints.forEach((point, pointIndex) => {
          const originalIndex = point.originalIndex !== undefined
              ? point.originalIndex
              : pointIndex;
          const key = `${categoryIndex}-${originalIndex}`;
          const isSelected = !!selectedPoints[key];

          html += `
            <div class="point-item ${isSelected ? 'selected' : 'unselected'}">
              <div class="point-indicator" style="background-color: ${levelColor};"></div>
              ${point.title}
            </div>
          `;
        });

        // Add placeholders if needed to ensure consistent height
        const placeholdersNeeded = pointsPerColumn - columnPoints.length;
        for (let j = 0; j < Math.max(0, placeholdersNeeded); j++) {
          html += '<div class="point-placeholder"></div>';
        }

        html += '</div>'; // Close points-column
      }

      html += '</div>'; // Close points-grid
    } else {
      // Simple single column layout
      html += '<div class="points-container">';

      validPoints.forEach((point, pointIndex) => {
        const originalIndex = point.originalIndex !== undefined
            ? point.originalIndex
            : pointIndex;
        const key = `${categoryIndex}-${originalIndex}`;
        const isSelected = !!selectedPoints[key];

        html += `
          <div class="point-item ${isSelected ? 'selected' : 'unselected'}">
            <div class="point-indicator" style="background-color: ${levelColor};"></div>
            ${point.title}
          </div>
        `;
      });

      // Add placeholders if needed to maintain consistent height
      const placeholderCount = Math.max(0,
          MAX_ROWS_PER_COLUMN - validPoints.length);
      for (let i = 0; i < placeholderCount; i++) {
        html += '<div class="point-placeholder"></div>';
      }

      html += '</div>'; // Close points-container
    }

    html += '</div>'; // Close insight-category
  });

  html += '</div>'; // Close answer-insights-container
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
    questionDetails,
    allQuestions,
    selectedAnswerPointsMap,
  } = data;

  // Get all question IDs that have some data
  const allQuestionIds = new Set([
    ...Object.keys(notesMap || {}),
    ...Object.keys(gradesMap || {}),
    ...Object.keys(selectedAnswerPointsMap || {}),
  ]);

  // Filter out questions with no actual content
  const questionIds = Array.from(allQuestionIds).filter(id =>
      hasContent(id, notesMap, gradesMap, selectedAnswerPointsMap),
  );

  // If no questions have content, display a message
  if (questionIds.length === 0) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Technical Review Notes</title>
        <style>
          body {
            font-family: ${isUbsTheme()
        ? '"UBS Sans", "Helvetica Neue", Arial, sans-serif'
        : TYPOGRAPHY.fontFamily};
            background-color: ${COLORS.background.light};
            color: ${COLORS.text.primary};
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .empty-container {
            text-align: center;
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            max-width: 500px;
          }
          h1 {
            color: ${isUbsTheme() ? '#EC0016' : COLORS.primary.main};
            margin-bottom: 16px;
          }
          p {
            color: ${COLORS.text.secondary};
            margin-bottom: 8px;
          }
        </style>
      </head>
      <body>
        <div class="empty-container">
          <h1>Technical Review Notes</h1>
          <p>Generated on ${new Date(
        timestamp).toLocaleDateString()} at ${new Date(
        timestamp).toLocaleTimeString()}</p>
          <p>No evaluated questions to display. Add ratings, notes, or select answer points to include questions in this report.</p>
        </div>
      </body>
      </html>
    `;
  }

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
        
        /* Container styles - EXTRA WIDE */
        .container {
          max-width: ${CONTAINER_WIDTH};
          margin: 0 auto;
          background-color: ${COLORS.background.paper};
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border-radius: ${useUbsTheme ? '4px' : `${SPACING.borderRadius}px`};
          padding: 20px;
        }
        
        /* Header styles */
        .header {
          text-align: center;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid ${COLORS.grey[200]};
        }
        
        .title {
          color: ${primaryColor};
          font-size: 20px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          margin: 0 0 4px 0;
        }
        
        .subtitle {
          color: ${COLORS.text.secondary};
          font-size: 11px;
          margin: 0;
        }
        
        /* Category styles */
        .category {
          margin-bottom: 24px;
        }
        
        .category-title {
          color: ${COLORS.text.primary};
          font-size: 18px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          margin: 0 0 10px 0;
          border-bottom: 1px solid ${COLORS.grey[300]};
          padding-bottom: 6px;
        }
        
        /* Subcategory styles */
        .subcategory {
          background-color: ${COLORS.grey[50]};
          border: 1px solid ${COLORS.grey[200]};
          border-radius: 8px;
          margin-bottom: 16px;
          overflow: hidden;
        }
        
        .subcategory-header {
          background-color: ${COLORS.grey[100]};
          padding: 6px 10px;
          border-bottom: 1px solid ${COLORS.grey[200]};
        }
        
        .subcategory-title {
          margin: 0;
          font-size: 14px;
          font-weight: ${TYPOGRAPHY.fontWeight.medium};
          color: ${COLORS.text.secondary};
        }
        
        .questions-container {
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
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
          padding: 10px 12px;
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
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        /* Rating styles */
        .rating-container {
          min-height: 22px;
          display: flex;
          align-items: center;
        }
        
        .rating-container.empty {
          opacity: ${EMPTY_OPACITY};
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
          min-height: 22px;
        }
        
        .notes-container.empty {
          opacity: ${EMPTY_OPACITY};
        }
        
        .notes {
          background-color: ${COLORS.grey[50]};
          padding: 8px 10px;
          border-radius: 4px;
          border: 1px solid ${COLORS.grey[200]};
          white-space: pre-line;
          font-size: 13px;
          margin: 0;
          min-height: 22px;
        }
        
        /* Empty notes placeholder */
        .notes-placeholder {
          background-color: ${COLORS.grey[50]};
          padding: 8px 10px;
          border-radius: 4px;
          border: 1px solid ${COLORS.grey[200]};
          min-height: 12px;
        }
        
        /* Answer insights horizontal layout - STREAMLINED */
        .answer-insights-container {
          display: flex;
          flex-direction: row;
          gap: 8px;
          width: 100%;
        }
        
        .answer-insights-container.no-selections {
          opacity: ${EMPTY_OPACITY};
        }
        
        .insight-category {
          flex: 1;
          padding: 6px;
          border-radius: 6px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background-color: rgba(0, 0, 0, 0.01);
          min-width: 0;
          width: ${CATEGORY_WIDTH};
        }
        
        .insight-category.no-selections {
          opacity: 0.7;
        }
        
        .insight-category.insight-level-basic {
          border-color: ${COLORS.basic.main}60;
          background-color: ${COLORS.basic.main}06;
        }
        
        .insight-category.insight-level-intermediate {
          border-color: ${COLORS.intermediate.main}70;
          background-color: ${COLORS.intermediate.main}06;
        }
        
        .insight-category.insight-level-advanced {
          border-color: ${COLORS.advanced.main}60;
          background-color: ${COLORS.advanced.main}06;
        }
        
        /* Points display - STREAMLINED */
        .points-container, .points-column {
          display: flex;
          flex-direction: column;
          gap: 4px;
          height: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        
        .points-grid {
          display: flex;
          flex-direction: row;
          gap: 6px;
          height: 100%;
        }
        
        .points-column {
          flex: 1;
          height: 100%;
        }
        
        .point-item {
          padding: 0 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          height: ${POINT_HEIGHT};
          line-height: ${POINT_HEIGHT};
          font-size: 13px;
          background-color: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: clip;
          color: #000000;
        }
        
        .point-item.selected {
          background-color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }
        
        .point-item.unselected {
          opacity: 0.5;
        }
        
        .point-indicator {
          width: 8px;
          height: 8px;
          min-width: 8px;
          border-radius: 2px;
          margin-right: 6px;
          flex-shrink: 0;
        }
        
        .point-placeholder {
          height: ${POINT_HEIGHT};
          visibility: hidden;
        }
        
        /* Footer styles */
        .footer {
          margin-top: 24px;
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
          <h1 class="title">Technical Interview Notes</h1>
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
        const hasGrade = gradesMap && gradesMap[questionId] &&
            gradesMap[questionId] > 0;
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
              <!-- Answer Insights in horizontal layout -->
              ${fullQuestion ? createAnswerInsightsHTML(
            fullQuestion.answerInsights || [],
            selectedAnswerPointsMap[questionId] || {},
        ) : ''}
              
              <!-- Rating section - Add 'empty' class if no rating -->
              <div class="rating-container ${!hasGrade ? 'empty' : ''}">
                <div class="rating">${createStarRating(
            gradesMap[questionId] || 0)}</div>
              </div>
              
              <!-- Notes section - Add 'empty' class if no notes -->
              <div class="notes-container ${!hasNotes ? 'empty' : ''}">
                ${hasNotes
            ? `<p class="notes">${notesMap[questionId].trim().
                replace(/\n/g, '<br>')}</p>`
            : `<div class="notes-placeholder"></div>`
        }
              </div>
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
          <p>Technical Interviewer Platform</p>
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

// Export both the named and default export
export default {
  exportInterviewData,
  prepareInterviewDataForExport,
};