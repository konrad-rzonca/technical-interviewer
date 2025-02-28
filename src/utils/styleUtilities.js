// src/utils/styleUtilities.js
// This file provides utility functions for styling that don't need to be hooks
// These can be used in loops, conditionals, or anywhere React hooks can't be used

import { COLORS, TYPOGRAPHY, SPACING, SKILL_LEVEL_COLORS } from './theme';

/**
 * UTILITY FUNCTIONS FOR STYLING
 * 
 * These functions help determine styling based on state, props, or component type.
 * They ensure consistency across the application without needing to be hooks.
 */

// Get skill level label
export function getSkillLevelLabel(level) {
  const labels = {
    beginner: 'Basic',
    intermediate: 'Intermediate',
    advanced: 'Advanced'
  };

  return labels[level] || level;
}

// Get skill level chip style
export function getSkillLevelChipStyle(level) {
  const skillLevel = SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;

  return {
    backgroundColor: `${skillLevel.main}10`,
    color: skillLevel.main,
    borderColor: skillLevel.main,
    fontWeight: TYPOGRAPHY.fontWeight.medium
  };
}

// Get text with ellipsis if too long
export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// Get appropriate color for question status
export function getStatusColor(status) {
  switch (status) {
    case 'answered':
      return COLORS.success.main;
    case 'selected':
      return COLORS.primary.main;
    case 'unanswered':
      return 'transparent';
    default:
      return 'transparent';
  }
}

// Get border styles for different component states
export function getBorderStyle(isActive, isSelected, level = 'beginner') {
  const skillLevel = SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;

  if (isSelected) {
    return `2px solid ${skillLevel.main}`;
  } else if (isActive) {
    return `1px solid ${skillLevel.border}`;
  } else {
    return `1px solid ${COLORS.grey[300]}`;
  }
}

// Get background styles for different component states
export function getBackgroundStyle(isActive, isSelected, level = 'beginner') {
  const skillLevel = SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;

  if (isSelected) {
    return `${skillLevel.main}15`; // 15% opacity
  } else if (isActive) {
    return `${skillLevel.main}08`; // 8% opacity
  } else {
    return 'transparent';
  }
}

// Get spacing value in pixels (for use in inline styles)
export function getSpacingPixels(value) {
  return SPACING.unit * value;
}

// Format an object to css-in-js style object with proper themes
export function createStyleObject(styles) {
  const result = {};

  // Process style entries
  Object.entries(styles).forEach(([key, value]) => {
    // Check if value is referencing a theme token
    if (typeof value === 'string' && value.startsWith('theme.')) {
      const path = value.split('.').slice(1);
      let token = path.reduce((obj, key) => obj[key], theme);
      result[key] = token;
    } else {
      result[key] = value;
    }
  });

  return result;
}

// Get variant style based on state
export function getVariantStyle(variant, variants) {
  return variants[variant] || variants.default || {};
}

// Convert legacy color name to theme color
export function getLegacyColor(colorName) {
  const colorMap = {
    // Old color names mapped to new theme colors
    primary: COLORS.primary.main,
    secondary: COLORS.secondary.main,
    success: COLORS.success.main,
    warning: COLORS.warning.main,
    info: COLORS.info.main,
    error: COLORS.error.main,
    grey: COLORS.grey[500],
    green: COLORS.success.main,
    amber: COLORS.warning.main,
    orange: COLORS.info.main,
    red: COLORS.error.main,
    blue: COLORS.primary.main
  };

  return colorMap[colorName] || colorName;
}

// Helper for highlight matching text in search results
export function getHighlightedText(text, highlight) {
  if (!highlight || !text) return text;

  // Split text on the highlight term and return a React component with highlights
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

  return {
    parts,
    style: {
      highlighted: {
        backgroundColor: `${COLORS.warning.light}`,
        fontWeight: 'bold'
      },
      normal: {}
    }
  };
}

// DEPRECATED CONSTANTS - For backwards compatibility during transition
// These will help transition from the old constants.js file
export const DEPRECATED = {
  LAYOUT: {
    LEFT_SIDEBAR_WIDTH: 450,
    RIGHT_SIDEBAR_WIDTH: 525,
    COLLAPSED_SIDEBAR_WIDTH: 80,
    COLUMN_THRESHOLD: 1800,
    TOP_HEADER_HEIGHT: 64,
    BOTTOM_NAV_HEIGHT: 64
  },
  SKILL_LEVELS: {
    beginner: {
      label: "Basic",
      color: COLORS.success.main,
      bgColor: COLORS.success.light
    },
    intermediate: {
      label: "Intermediate",
      color: COLORS.warning.main,
      bgColor: COLORS.warning.light
    },
    advanced: {
      label: "Advanced",
      color: COLORS.info.main,
      bgColor: COLORS.info.light
    }
  },
  getSkillLevelColor: (level) => {
    const levels = {
      beginner: COLORS.success.main,
      intermediate: COLORS.warning.main,
      advanced: COLORS.info.main
    };
    return levels[level] || COLORS.grey[500];
  },
  getSkillLevelBackground: (level) => {
    const levels = {
      beginner: COLORS.success.light,
      intermediate: COLORS.warning.light,
      advanced: COLORS.info.light
    };
    return levels[level] || COLORS.grey[100];
  },
  getBorderOpacity: (level) => {
    if (level === 'intermediate') {
      return '60';
    }
    return '50';
  }
};