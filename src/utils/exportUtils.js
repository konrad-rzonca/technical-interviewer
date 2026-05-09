// src/utils/exportUtils.js

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
      const {default: exportToPdf} = await import('./pdfExportUtils');
      return exportToPdf(interviewState, allQuestions, metadata);
    }

    // Default to HTML
    const {default: exportToHtml} = await import('./htmlExportUtils');
    return exportToHtml(interviewState, allQuestions, metadata);
  } catch (error) {
    console.error(`Error exporting to ${format}:`, error);
    throw error;
  }
};

export default exportInterviewData;
