import {ANSWER_LEVELS, LEVEL_ORDER} from '../utils/answerConstants';

// Import question files
import fundamentalsQuestions
  from './questions/java/core-java/fundamentals.json';
import memoryManagementQuestions
  from './questions/java/core-java/memory-management.json';
import concurrencyQuestions
  from './questions/java/concurrency-multithreading/concurrency-basics.json';

// Question sets with author information
const questionSets = {
  'core-java': [
    {
      id: 'basic-set-core',
      name: 'Basic Set',
      files: {
        'Fundamentals': fundamentalsQuestions,
        'Memory Management': memoryManagementQuestions,
      },
    },
  ],
  'concurrency-multithreading': [
    {
      id: 'basic-set-concurrency',
      name: 'Basic Set',
      files: {
        'Concurrency and Multithreading': concurrencyQuestions,
      },
    },
  ],
  'software-design': [
    {
      id: 'design-patterns-basic-set',
      name: 'Basic Set',
      files: {},
    },
  ],
  'databases': [
    {
      id: 'databases-basic-set',
      name: 'Basic Set',
      files: {},
    },
  ],
  'frameworks': [
    {
      id: 'frameworks-basic-set',
      name: 'Basic Set',
      files: {},
    },
  ],
  'dsa': [
    {
      id: 'dsa-basic-set',
      name: 'Basic Set',
      files: {},
    },
  ],
  'engineering-practices': [
    {
      id: 'engineering-basic-set',
      name: 'Basic Set',
      files: {},
    },
  ],
};

// Sort questions in a consistent order
export const sortQuestionsByOrder = (questions) => {
  return [...questions].sort((a, b) => {
    // First sort by skill level (beginner → intermediate → advanced)
    const levelDiff = LEVEL_ORDER[a.skillLevel] - LEVEL_ORDER[b.skillLevel];
    if (levelDiff !== 0) return levelDiff;

    // Then sort alphabetically by title
    const titleA = a.shortTitle || a.question;
    const titleB = b.shortTitle || b.question;
    return titleA.localeCompare(titleB);
  });
};

// Extract all questions from files
const extractQuestionsFromFiles = () => {
  const allQuestions = [];

  // Required answer insight levels
  const requiredLevels = [
    ANSWER_LEVELS.BASIC,
    ANSWER_LEVELS.INTERMEDIATE,
    ANSWER_LEVELS.ADVANCED,
  ];

  // Process question sets
  Object.entries(questionSets).forEach(([categoryId, sets]) => {
    sets.forEach(set => {
      Object.entries(set.files).forEach(([subcategoryName, file]) => {
        if (file && file.questions && Array.isArray(file.questions)) {
          // Add category, subcategory, and set info to each question
          const questionsWithMetadata = file.questions.map(question => {
            // Ensure answerInsights exists
            let answerInsights = question.answerInsights || [];

            // Build a map for existing insights based on their category
            const insightsByCategory = {};
            answerInsights.forEach(insight => {
              // If insight is missing a category, ignore it and let the default be added below.
              if (insight.category &&
                  requiredLevels.includes(insight.category)) {
                insightsByCategory[insight.category] = insight;
              }
            });

            // Ensure that each required level is present
            requiredLevels.forEach(level => {
              if (!insightsByCategory[level]) {
                insightsByCategory[level] = {category: level, points: []};
              }
            });

            // Reconstruct the answerInsights array in the required order
            const completeAnswerInsights = requiredLevels.map(
                level => insightsByCategory[level]);

            return {
              ...question,
              answerInsights: completeAnswerInsights,
              categoryId,
              subcategoryName,
              setId: set.id,
            };
          });
          allQuestions.push(...questionsWithMetadata);
        }
      });
    });
  });

  return allQuestions;
};

// All questions array
const questions = extractQuestionsFromFiles();

// Categories with subcategories
export const categories = [
  {
    id: 'core-java',
    name: 'Core Java',
    subcategories: [
      'Fundamentals',
      'Memory Management',
      'Collections',
      'Exceptions',
    ],
  },
  {
    id: 'concurrency-multithreading',
    name: 'Concurrency and Multithreading',
    subcategories: ['Concurrency and Multithreading'],
  },
  {
    id: 'software-design',
    name: 'Software Design',
    subcategories: ['Design Patterns', 'Microservices', 'REST API'],
  },
  {
    id: 'databases',
    name: 'Databases',
    subcategories: ['SQL', 'NoSQL', 'Transactions'],
  },
  {
    id: 'frameworks',
    name: 'Frameworks',
    subcategories: ['Spring', 'Hibernate'],
  },
  {
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    subcategories: ['Data Structures', 'Algorithms'],
  },
  {
    id: 'engineering-practices',
    name: 'Engineering',
    subcategories: [
      'Git',
      'CI/CD',
      'Testing',
      'Cloud',
      'Security',
      'Open Questions',
    ],
  },
];

// Get all questions
export const getAllQuestions = () => {
  return sortQuestionsByOrder([...questions]); // Return a sorted copy
};

// Get questions by category
export const getQuestionsByCategory = (categoryId) => {
  const categoryQuestions = questions.filter(
      question => question.categoryId === categoryId);
  return sortQuestionsByOrder(categoryQuestions);
};

// Get filtered questions by category and subcategory
export const getFilteredQuestions = (
    categoryId = null, subcategory = null, skillLevel = null) => {
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

  // Return a sorted copy to ensure consistent ordering
  return sortQuestionsByOrder([...filtered]);
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

  const relatedQs = question.relatedQuestions.map(id => getQuestionById(id)).
      filter(Boolean) // Filter out any undefined results
      .filter(q => q.id !== questionId); // Filter out self-references

  // Return related questions in sorted order
  return sortQuestionsByOrder(relatedQs);
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
