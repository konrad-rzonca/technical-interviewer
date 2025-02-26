// src/data/questionLoader.js

// Import question files
import javaCoreConceptsFile from './questions/java/core-concepts/core-concepts-konrad-1.json';
import javaOOPFile from './questions/java//oop/oop-konrad-1.json';
import javaConcurrencyFile from './questions/java/concurrency/concurrency-konrad-1.json';

// List of all question files by category
export const questionFiles = {
  java: {
    'core-concepts': javaCoreConceptsFile,
    'oop': javaOOPFile,
    'concurrency': javaConcurrencyFile
  },
  python: {
    // Placeholder for Python files
  },
  javascript: {
    // Placeholder for JavaScript files
  }
};

// Extract all questions from files
const extractQuestionsFromFiles = () => {
  const allQuestions = [];

  // Process Java files
  Object.values(questionFiles.java).forEach(file => {
    if (file.questions && Array.isArray(file.questions)) {
      allQuestions.push(...file.questions);
    }
  });

  return allQuestions;
};

// All questions array
const questions = extractQuestionsFromFiles();

// Language options (with disabled status)
export const languages = [
  { id: 'java', name: 'Java', enabled: true },
  { id: 'python', name: 'Python', enabled: false },
  { id: 'javascript', name: 'JavaScript', enabled: false },
];

// Skill levels
export const skillLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Categories by language
export const categories = {
  java: [
    { id: 'core-concepts', name: 'Core Concepts', subcategoryMatch: 'Core Concepts' },
    { id: 'oop', name: 'Object-Oriented Programming', subcategoryMatch: 'Object-Oriented Programming' },
    { id: 'concurrency', name: 'Concurrency', subcategoryMatch: 'Concurrency' },
  ],
  python: [
    // Placeholders for future implementation
    { id: 'basics', name: 'Python Basics' },
    { id: 'data-structures', name: 'Data Structures' },
  ],
  javascript: [
    // Placeholders for future implementation
    { id: 'fundamentals', name: 'JavaScript Fundamentals' },
    { id: 'dom', name: 'DOM Manipulation' },
  ]
};

// Get all questions
export const getAllQuestions = () => {
  return [...questions]; // Return a copy to avoid mutations
};

// Get questions by language
export const getQuestionsByLanguage = (language) => {
  return questions.filter(question => question.category.toLowerCase() === language.toLowerCase());
};

// Get filtered questions with exact category matching
export const getFilteredQuestions = (language, categoryId = null, selectedFiles = null) => {
  // First filter by language
  let filtered = getQuestionsByLanguage(language);

  // Then filter by category if specified
  if (categoryId) {
    // Find the category object
    const categoryObj = categories[language]?.find(cat => cat.id === categoryId);

    if (categoryObj && categoryObj.subcategoryMatch) {
      // Use the exact subcategory match from the category definition
      filtered = filtered.filter(q => q.subcategory === categoryObj.subcategoryMatch);
    }
  }

  // Filter by selected files if specified
  if (selectedFiles && selectedFiles.length > 0) {
    // Convert file paths to question IDs - this would depend on your file structure
    // For now, we'll assume selectedFiles contains question IDs directly
    filtered = filtered.filter(q => selectedFiles.includes(q.id));
  }

  // Create a new array to ensure we're not returning references to the original questions
  return [...filtered];
};

// Get question by ID
export const getQuestionById = (id) => {
  return questions.find(question => question.id === id);
};

// Get related questions
export const getRelatedQuestions = (questionId) => {
  const question = getQuestionById(questionId);
  if (!question || !question.relatedQuestions) return [];

  return question.relatedQuestions
    .map(id => getQuestionById(id))
    .filter(Boolean) // Filter out any undefined results
    .filter(q => q.id !== questionId); // Filter out self-references
};

// Get all categories for a language
export const getCategoriesForLanguage = (language) => {
  return categories[language] || [];
};

// Find which category a question belongs to
export const getCategoryForQuestion = (question, language) => {
  if (!question) return null;

  const categoryList = categories[language] || [];
  return categoryList.find(cat => cat.subcategoryMatch === question.subcategory);
};

// Get files for a category
export const getFilesForCategory = (language, categoryId) => {
  if (!language || !categoryId) return [];

  const categoryFiles = questionFiles[language]?.[categoryId];
  if (!categoryFiles) return [];

  // If the file has questions, return their IDs
  if (categoryFiles.questions && Array.isArray(categoryFiles.questions)) {
    return categoryFiles.questions.map(q => q.id);
  }

  return [];
};

// Get file names for a category
export const getFileNamesForCategory = (language, categoryId) => {
  if (!language || !categoryId) return [];

  // In a real application, you would have access to the file names
  // For this example, we'll return some hardcoded values
  const fileNameMap = {
    'java': {
      'core-concepts': ['java-core-concepts.json'],
      'oop': ['java-oop.json'],
      'concurrency': ['java-concurrency.json']
    }
  };

  return fileNameMap[language]?.[categoryId] || [];
};

// Get questions from a specific file
export const getQuestionsFromFile = (language, categoryId, fileName) => {
  if (!language || !categoryId || !fileName) return [];

  const fileData = questionFiles[language]?.[categoryId];
  if (!fileData || !fileData.questions) return [];

  return [...fileData.questions];
};