// src/utils/exportUtils.js
import exportToHtml from './htmlExportUtils';
import exportToPdf from './pdfExportUtils';

/**
 * Export interview data in the specified format
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 * @param {Object} metadata - Additional metadata for the report
 * @param {string} format - The format to export to (html or pdf)
 */
export const exportInterviewData = async (
    interviewState, allQuestions, metadata = {}, format = 'html') => {
  try {
    if (format === 'pdf') {
      return await exportToPdf(interviewState, allQuestions, metadata);
    } else {
      // Default to HTML
      return await exportToHtml(interviewState, allQuestions, metadata);
    }
  } catch (error) {
    console.error(`Error exporting to ${format}:`, error);
    throw error;
  }
};

export {exportToHtml, exportToPdf};

export default exportInterviewData;