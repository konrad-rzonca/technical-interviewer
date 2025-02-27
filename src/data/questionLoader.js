// src/data/questionLoader.js

// Import question files
import fundamentalsQuestions from './questions/java/core-java/fundamentals.json';
import memoryManagementQuestions from './questions/java/core-java/memory-management.json';
import concurrencyQuestions from './questions/java/concurrency-multithreading/concurrency-basics.json';

// Question sets with author information
const questionSets = {
  'core-java': [
    {
      id: 'konrad-basic-set-core',
      name: 'Konrad Basic Set',
      files: {
        'Fundamentals': fundamentalsQuestions,
        'Memory Management': memoryManagementQuestions
      }
    }
  ],
  'concurrency-multithreading': [
    {
      id: 'konrad-basic-set-concurrency',
      name: 'Konrad Basic Set',
      files: {
        'Concurrency and Multithreading': concurrencyQuestions
      }
    }
  ],
  'software-design': [
    {
      id: 'design-patterns-basic-set',
      name: 'Konrad Basic Set',
      files: {}
    }
  ],
  'databases': [
    {
      id: 'databases-basic-set',
      name: 'Konrad Basic Set',
      files: {}
    }
  ],
  'frameworks': [
    {
      id: 'frameworks-basic-set',
      name: 'Konrad Basic Set',
      files: {}
    }
  ],
  'dsa': [
    {
      id: 'dsa-basic-set',
      name: 'Konrad Basic Set',
      files: {}
    }
  ],
  'engineering-practices': [
    {
      id: 'engineering-basic-set',
      name: 'Konrad Basic Set',
      files: {}
    }
  ]
};

// Extract all questions from files
const extractQuestionsFromFiles = () => {
  const allQuestions = [];

  // Process question sets
  Object.entries(questionSets).forEach(([categoryId, sets]) => {
    sets.forEach(set => {
      Object.entries(set.files).forEach(([subcategoryName, file]) => {
        if (file && file.questions && Array.isArray(file.questions)) {
          // Add category, subcategory, and set info to each question
          const questionsWithMetadata = file.questions.map(question => ({
            ...question,
            categoryId,
            subcategoryName,
            setId: set.id
          }));
          allQuestions.push(...questionsWithMetadata);
        }
      });
    });
  });

  return allQuestions;
};

// All questions array
const questions = extractQuestionsFromFiles();

// Skill levels
export const skillLevels = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

// Categories with subcategories
export const categories = [
  {
    id: 'core-java',
    name: 'Core Java',
    subcategories: ['Fundamentals', 'Memory Management', 'Collections', 'Exceptions']
  },
  {
    id: 'concurrency-multithreading',
    name: 'Concurrency and Multithreading',
    subcategories: ['Concurrency and Multithreading']
  },
  {
    id: 'software-design',
    name: 'Software Design',
    subcategories: ['Design Patterns', 'Microservices', 'REST API']
  },
  {
    id: 'databases',
    name: 'Databases',
    subcategories: ['SQL', 'NoSQL', 'Transactions']
  },
  {
    id: 'frameworks',
    name: 'Frameworks',
    subcategories: ['Spring', 'Hibernate']
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    subcategories: ['Data Structures & Algorithms']
  },
  {
    id: 'engineering-practices',
    name: 'Engineering Practices',
    subcategories: ['Git', 'CI/CD', 'Testing']
  }
];

// Get all questions
export const getAllQuestions = () => {
  return [...questions]; // Return a copy to avoid mutations
};

// Get questions by category
export const getQuestionsByCategory = (categoryId) => {
  return questions.filter(question => question.categoryId === categoryId);
};

// Get filtered questions by category and subcategory
export const getFilteredQuestions = (categoryId = null, subcategory = null, skillLevel = null) => {
  let filtered = questions;

  // Filter by category if specified
  if (categoryId) {
    filtered = filtered.filter(q => q.categoryId === categoryId);
  }

  // Filter by subcategory if specified
  if (subcategory) {
    filtered = filtered.filter(q => q.subcategoryName === subcategory);
  }

  // Filter by skill level if specified
  if (skillLevel) {
    filtered = filtered.filter(q => q.skillLevel === skillLevel);
  }

  // Create a new array to ensure we're not returning references to the original questions
  return [...filtered];
};

// Get question sets for a category
export const getQuestionSets = (categoryId) => {
  return questionSets[categoryId] || [];
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

// Get category by ID
export const getCategoryById = (categoryId) => {
  return categories.find(category => category.id === categoryId);
};

// Find which category a question belongs to
export const getCategoryForQuestion = (question) => {
  if (!question) return null;
  return getCategoryById(question.categoryId);
};

// Get questions from a specific set for a subcategory
export const getQuestionsFromSet = (categoryId, setId, subcategory) => {
  const sets = questionSets[categoryId] || [];
  const set = sets.find(s => s.id === setId);

  if (!set || !set.files[subcategory] || !set.files[subcategory].questions) {
    return [];
  }

  // Return questions with metadata
  return set.files[subcategory].questions.map(question => ({
    ...question,
    categoryId,
    subcategoryName: subcategory,
    setId
  }));
};