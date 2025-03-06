// src/utils/answerConstants.js
export const ANSWER_LEVELS = {
  BASIC: 'Basic',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export const SKILL_LEVELS = {
  BASIC: 'basic',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const SKILL_LEVEL_LABELS = {
  [SKILL_LEVELS.BASIC]: 'Basic',
  [SKILL_LEVELS.INTERMEDIATE]: 'Intermediate',
  [SKILL_LEVELS.ADVANCED]: 'Advanced',
};

// Map index to level for consistent handling
export const INDEX_TO_LEVEL = [
  SKILL_LEVELS.BASIC,
  SKILL_LEVELS.INTERMEDIATE,
  SKILL_LEVELS.ADVANCED,
];

// Navigation order for skill levels (for sorting)
export const LEVEL_ORDER = {
  [SKILL_LEVELS.BASIC]: 1,
  [SKILL_LEVELS.INTERMEDIATE]: 2,
  [SKILL_LEVELS.ADVANCED]: 3,
};