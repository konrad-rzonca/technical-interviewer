// src/data/questionLoader.js - Optimized with indexed data structures
import {ANSWER_LEVELS, LEVEL_ORDER} from '../utils/answerConstants';

// Import question files
import fundamentalsQuestions
  from './questions/java/core-java/fundamentals-1.json';
import fundamentals2Questions
  from './questions/java/core-java/fundamentals-2.json';
import memoryManagementQuestions
  from './questions/java/core-java/memory-management.json';
import concurrentCollectionsQuestions
  from './questions/java/concurrency-multithreading/concurrent-collections.json';
import executorsQuestions
  from './questions/java/concurrency-multithreading/executors.json';
import synchronizationQuestions
  from './questions/java/concurrency-multithreading/synchronization.json';
import threadFundamentalsQuestions
  from './questions/java/concurrency-multithreading/thread-fundamentals.json';

import collectionsQuestions from './questions/java/core-java/collections.json';
import exceptionsQuestions from './questions/java/core-java/exceptions.json';
import dataStructuresQuestions
  from './questions/java/data-structures-and-algorithms/data-structures.json';
import springQuestions from './questions/java/framework/spring.json';
import hibernateQuestions from './questions/java/framework/hibernate.json';
import algorithmsQuestions1
  from './questions/java/data-structures-and-algorithms/algorithms-1.json';
import algorithmsQuestions2
  from './questions/java/data-structures-and-algorithms/algorithms-2.json';
import sqlQuestions from './questions/java/databases/SQL.json';
import noSqlQuestions from './questions/java/databases/NoSQL.json';
import transactionsQuestions
  from './questions/java/databases/transactions.json';

import designPatternsQuestions
  from './questions/java/software-design/design-patterns.json';
import microservicesQuestions
  from './questions/java/software-design/microservices.json';
import RESTQuestions from './questions/java/software-design/REST.json';

import gitQuestions from './questions/java/engineering/git.json';
import CICDQuestions from './questions/java/engineering/CICD.json';
import testingQuestions from './questions/java/engineering/testing.json';
import cloudQuestions from './questions/java/engineering/cloud-azure.json';
import securityQuestions from './questions/java/engineering/security.json';
import openQuestions from './questions/java/engineering/open.json';

// Question sets with author information
const questionSets = {
  'core-java': [
    {
      id: 'basic-set-core',
      name: 'Basic Set',
      files: {
        'Fundamentals': {
          category: fundamentalsQuestions.category,
          subcategory: fundamentalsQuestions.subcategory,
          questions: [
            ...fundamentalsQuestions.questions,
            ...fundamentals2Questions.questions],
        },
        'Memory Management': memoryManagementQuestions,
        'Collections': collectionsQuestions,
        'Exceptions': exceptionsQuestions,
      },
    },
  ],
  'dsa': [
    {
      id: 'dsa-basic-set',
      name: 'Basic Set',
      files: {
        'Data Structures': dataStructuresQuestions,
        'Algorithms': {
          category: algorithmsQuestions1.category,
          subcategory: algorithmsQuestions1.subcategory,
          questions: [
            ...algorithmsQuestions1.questions,
            ...algorithmsQuestions2.questions],
        },
      },
    },
  ],
  'databases': [
    {
      id: 'databases-basic-set',
      name: 'Basic Set',
      files: {
        'SQL': sqlQuestions,
        'NoSQL': noSqlQuestions,
        'Transactions': transactionsQuestions,
      },
    },
  ],
  'frameworks': [
    {
      id: 'frameworks-basic-set',
      name: 'Basic Set',
      files: {
        'Spring': springQuestions,
        'Hibernate': hibernateQuestions,
      },
    },
  ],
  'concurrency-multithreading': [
    {
      id: 'basic-set-concurrency',
      name: 'Basic Set',
      files: {
        'Concurrent Collections': concurrentCollectionsQuestions,
        'Executors': executorsQuestions,
        'Synchronization': synchronizationQuestions,
        'Thread Fundamentals': threadFundamentalsQuestions,
      },
    },
  ],
  'software-design': [
    {
      id: 'design-patterns-basic-set',
      name: 'Basic Set',
      files: {
        'Design Patterns': designPatternsQuestions,
        'Microservices': microservicesQuestions,
        'REST API': RESTQuestions,
      },
    },
  ],
  'engineering-practices': [
    {
      id: 'engineering-basic-set',
      name: 'Basic Set',
      files: {
        'Git': gitQuestions,
        'CI/CD': CICDQuestions,
        'Testing': testingQuestions,
        'Cloud': cloudQuestions,
        'Security': securityQuestions,
        'Open Questions': openQuestions,
      },
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

// Function to create a default insight category structure
const createDefaultInsight = (category) => ({
  category,
  points: [],
});

// Initialize data structures
let questionsInitialized = false;
let questions = []; // All questions
let sortedQuestions = []; // Sorted questions (computed once)
let questionsByCategory = {}; // Questions indexed by category
let questionsBySubcategory = {}; // Questions indexed by [category][subcategory]
let questionById = {}; // Questions indexed by ID
let filterCache = new Map(); // Cache for filtered results

// Extract all questions from files with optimized data structures
const extractQuestionsFromFiles = () => {
  if (questionsInitialized) {
    return questions;
  }

  const allQuestions = [];

  // Required answer insight levels in the exact order they should appear
  const requiredLevels = [
    ANSWER_LEVELS.BASIC,
    ANSWER_LEVELS.INTERMEDIATE,
    ANSWER_LEVELS.ADVANCED,
  ];

  // Process question sets
  Object.entries(questionSets).forEach(([categoryId, sets]) => {
    // Initialize category indexes if they don't exist
    if (!questionsByCategory[categoryId]) {
      questionsByCategory[categoryId] = [];
    }

    if (!questionsBySubcategory[categoryId]) {
      questionsBySubcategory[categoryId] = {};
    }

    sets.forEach(set => {
      Object.entries(set.files).forEach(([subcategoryName, file]) => {
        // Initialize subcategory index if it doesn't exist
        if (!questionsBySubcategory[categoryId][subcategoryName]) {
          questionsBySubcategory[categoryId][subcategoryName] = [];
        }

        if (file && file.questions && Array.isArray(file.questions)) {
          // Add category, subcategory, and set info to each question
          const questionsWithMetadata = file.questions.map(question => {
            // Ensure answerInsights exists as an array
            let answerInsights = Array.isArray(question.answerInsights)
                ? question.answerInsights
                : [];

            // Build a map for existing insights based on their category
            const insightsByCategory = {};
            answerInsights.forEach(insight => {
              if (insight && typeof insight === 'object' && insight.category &&
                  requiredLevels.includes(insight.category)) {
                // Ensure points is always an array
                insightsByCategory[insight.category] = {
                  ...insight,
                  points: Array.isArray(insight.points) ? insight.points : [],
                };
              }
            });

            // Ensure that each required level is present in proper order
            const completeAnswerInsights = requiredLevels.map(level =>
                insightsByCategory[level] || createDefaultInsight(level),
            );

            // Create the enhanced question object
            const enhancedQuestion = {
              ...question,
              answerInsights: completeAnswerInsights,
              categoryId,
              subcategoryName,
              setId: set.id,
            };

            // Add to ID lookup map
            questionById[enhancedQuestion.id] = enhancedQuestion;

            return enhancedQuestion;
          });

          // Add questions to all indexes
          allQuestions.push(...questionsWithMetadata);
          questionsByCategory[categoryId].push(...questionsWithMetadata);
          questionsBySubcategory[categoryId][subcategoryName].push(
              ...questionsWithMetadata);
        }
      });
    });
  });

  // Sort questions once
  questions = allQuestions;
  sortedQuestions = sortQuestionsByOrder([...allQuestions]);

  // Sort indexed categories and subcategories
  Object.keys(questionsByCategory).forEach(categoryId => {
    questionsByCategory[categoryId] = sortQuestionsByOrder(
        questionsByCategory[categoryId]);

    if (questionsBySubcategory[categoryId]) {
      Object.keys(questionsBySubcategory[categoryId]).forEach(subcategory => {
        questionsBySubcategory[categoryId][subcategory] =
            sortQuestionsByOrder(
                questionsBySubcategory[categoryId][subcategory]);
      });
    }
  });

  questionsInitialized = true;
  return questions;
};

// Initialize questions
extractQuestionsFromFiles();

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
    id: 'dsa',
    name: 'Data Structures & Algorithms',
    subcategories: ['Data Structures', 'Algorithms'],
  },
  {
    id: 'frameworks',
    name: 'Frameworks',
    subcategories: ['Spring', 'Hibernate'],
  },
  {
    id: 'databases',
    name: 'Databases',
    subcategories: ['SQL', 'NoSQL', 'Transactions'],
  },
  {
    id: 'concurrency-multithreading',
    name: 'Concurrency and Multithreading',
    subcategories: [
      'Thread Fundamentals',
      'Synchronization',
      'Concurrent Collections',
      'Executors',
    ],
  },
  {
    id: 'software-design',
    name: 'Software Design',
    subcategories: ['Design Patterns', 'Microservices', 'REST API'],
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

// Create a cache key for filtered results
const createFilterCacheKey = (categoryId, subcategory, skillLevel) => {
  return `${categoryId || ''}:${subcategory || ''}:${skillLevel || ''}`;
};

// Get all questions - return pre-sorted array
export const getAllQuestions = () => {
  return sortedQuestions;
};

// Get questions by category - now using indexed lookup
export const getQuestionsByCategory = (categoryId) => {
  if (!categoryId || !questionsByCategory[categoryId]) {
    return [];
  }

  return questionsByCategory[categoryId];
};

// Get filtered questions by category and subcategory - optimized with indexes and caching
export const getFilteredQuestions = (
    categoryId = null, subcategory = null, skillLevel = null) => {

  // Create a cache key for this filter combination
  const cacheKey = createFilterCacheKey(categoryId, subcategory, skillLevel);

  // Check if we have a cached result
  if (filterCache.has(cacheKey)) {
    return filterCache.get(cacheKey);
  }

  let filteredQuestions = [];

  // Direct lookup by category and subcategory if possible
  if (categoryId && subcategory &&
      questionsBySubcategory[categoryId]?.[subcategory]) {
    filteredQuestions = [...questionsBySubcategory[categoryId][subcategory]];
  }
  // Lookup by category if only category is specified
  else if (categoryId && !subcategory && questionsByCategory[categoryId]) {
    filteredQuestions = [...questionsByCategory[categoryId]];
  }
  // Fall back to filtering all questions
  else {
    filteredQuestions = [...sortedQuestions];

    // Apply category filter if specified
    if (categoryId) {
      filteredQuestions = filteredQuestions.filter(
          q => q.categoryId === categoryId);
    }

    // Apply subcategory filter if specified
    if (subcategory) {
      filteredQuestions = filteredQuestions.filter(
          q => q.subcategoryName === subcategory);
    }
  }

  // Apply skill level filter if specified
  if (skillLevel) {
    filteredQuestions = filteredQuestions.filter(
        q => q.skillLevel === skillLevel);
  }

  // If we need to sort the results, do so
  const result = skillLevel
      ? sortQuestionsByOrder(filteredQuestions)
      : filteredQuestions;

  // Cache the result
  filterCache.set(cacheKey, result);

  return result;
};

// Get question sets for a category
export const getQuestionSets = (categoryId) => {
  return questionSets[categoryId] || [];
};

// Get question by ID - now using direct lookup
export const getQuestionById = (id) => {
  return questionById[id] || null;
};

// Get related questions - optimized with direct lookups
export const getRelatedQuestions = (questionId) => {
  const question = getQuestionById(questionId);
  if (!question || !question.relatedQuestions) return [];

  const relatedQs = [];

  // Use direct lookups instead of mapping and filtering
  for (const id of question.relatedQuestions) {
    const relatedQuestion = questionById[id];
    if (relatedQuestion && relatedQuestion.id !== questionId) {
      relatedQs.push(relatedQuestion);
    }
  }

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

// Clear filter cache - utility function for testing or forced refreshes
export const clearFilterCache = () => {
  filterCache.clear();
};