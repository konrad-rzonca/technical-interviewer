// src/utils/answerConstants.js
export const ANSWER_LEVELS = {
  BASIC: 'Basic',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const SKILL_LEVEL_LABELS = {
  [SKILL_LEVELS.BEGINNER]: 'Basic',
  [SKILL_LEVELS.INTERMEDIATE]: 'Intermediate',
  [SKILL_LEVELS.ADVANCED]: 'Advanced',
};

// Map index to level for consistent handling
export const INDEX_TO_LEVEL = [
  SKILL_LEVELS.BEGINNER,
  SKILL_LEVELS.INTERMEDIATE,
  SKILL_LEVELS.ADVANCED,
];

// Navigation order for skill levels (for sorting)
export const LEVEL_ORDER = {
  [SKILL_LEVELS.BEGINNER]: 1,
  [SKILL_LEVELS.INTERMEDIATE]: 2,
  [SKILL_LEVELS.ADVANCED]: 3,
};