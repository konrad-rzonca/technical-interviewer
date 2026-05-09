// src/utils/constants.js
// Navigation-related constants
export const NAVIGATION = {
  TABS: {
    INTERVIEW: 'interview',
    PREPARATION: 'preparation',
    CODING: 'coding',
    BEST_PRACTICES: 'best-practices',
  },
  ROUTES: {
    INTERVIEW: '/',
    PREPARATION: '/prepare',
    CODING: '/coding',
    BEST_PRACTICES: '/best-practices',
    HEALTH: '/healtz',
  },
  TAB_LABELS: {
    INTERVIEW: 'Questions',
    PREPARATION: 'Prepare',
    CODING: 'Coding',
    BEST_PRACTICES: 'Best Practices',
  },
};

// Storage-related constants
export const STORAGE = {
  PREFIX: 'tech-interview-app',
  KEYS: {
    INTERVIEW_STATE: 'tech-interview-app:interview-state',
    PREPARATION_STATE: 'tech-interview-app:preparation-state',
    TEST: 'tech-interview-app:test-storage',
  },
  DEBOUNCE_TIME: 500, // ms to wait before saving state
};

// Other app constants can be added here
export const APP_CONSTANTS = {
  APP_NAME: 'Technical Interview Platform',
  VERSION: '1.0.0',
};

export default {
  NAVIGATION,
  APP_CONSTANTS,
  STORAGE,
};
