// src/utils/styles.js - Unified styling system
import {useMemo} from 'react';
import {
  COLORS,
  COMPONENT_STYLES,
  SKILL_LEVEL_COLORS,
  SPACING,
  TYPOGRAPHY,
} from './theme';

/**
 * UTILITY FUNCTIONS
 * Helper functions for styling operations
 */

// Apply opacity to a color
export const withOpacity = (color, opacity) => `${color}${opacity}`;

// Get styling information for a specific skill level
export const getSkillLevelStyles = (level) => {
  return SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;
};

// Get the indicator color for a skill level
export const getIndicatorColor = (level) => {
  if (level === 'intermediate') {
    return SKILL_LEVEL_COLORS.intermediate.light; // Softer yellow for dots
  }
  return SKILL_LEVEL_COLORS[level]?.main || COLORS.grey[500];
};

/**
 * GLOBAL STYLES
 * Reusable style objects that can be applied directly
 */

// Scrollbar styling
export const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: COLORS.grey[300],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: COLORS.grey[400],
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${COLORS.grey[300]} transparent`,
};

// Pre block for code examples
export const preStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  padding: SPACING.toUnits(SPACING.md),
  borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
  overflowX: 'auto',
  margin: `${SPACING.toUnits(SPACING.xs)} 0`,
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  fontSize: TYPOGRAPHY.fontSize.small,
  lineHeight: 1.5,
};

// Basic panel styling
export const panelBaseStyles = {
  padding: SPACING.toUnits(SPACING.md),
  border: `1px solid ${COLORS.grey[200]}`,
  borderRadius: SPACING.toUnits(SPACING.borderRadius),
  backgroundColor: COLORS.background.paper,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  height: '100%',
  overflow: 'auto',
};

/**
 * STYLE HOOKS
 * React hooks that create memoized styles based on props/state
 */

// Hook for panel styling
export function usePanelStyles(
    isCollapsed = false, isMainPanel = false, options = {}) {
  return useMemo(() => ({
    ...panelBaseStyles,
    width: '100%',
    border: isMainPanel ? COMPONENT_STYLES.panel.border : 'none',
    transition: 'width 0.3s ease, min-width 0.3s ease',
    padding: isCollapsed
        ? SPACING.toUnits(COMPONENT_STYLES.panel.paddingCollapsed)
        : SPACING.toUnits(COMPONENT_STYLES.panel.padding),
    ...options,
  }), [isCollapsed, isMainPanel, options]);
}

// Hook for title styling
export function useTitleStyles(options = {}) {
  return useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.2,
    marginBottom: SPACING.toUnits(SPACING.md),
    ...options,
  }), [options]);
}

// Hook for question item styling
export function useQuestionItemStyles(
    isSelected, isAnswered, skillLevel, options = {}) {
  return useMemo(() => {
    const levelColors = getSkillLevelStyles(skillLevel);
    const levelColor = levelColors.main;

    return {
      padding: SPACING.toUnits(COMPONENT_STYLES.questionItem.padding),
      borderRadius: SPACING.toUnits(COMPONENT_STYLES.questionItem.borderRadius),
      cursor: 'pointer',
      backgroundColor: isSelected
          ? withOpacity(levelColor, '15') // Selected background
          : (isAnswered
              ? COMPONENT_STYLES.questionItem.variants.answered.backgroundColor
              : COMPONENT_STYLES.questionItem.variants.normal.backgroundColor),
      border: isSelected
          ? `2px solid ${withOpacity(levelColor, '60')}` // Selected border
          : (isAnswered
              ? COMPONENT_STYLES.questionItem.variants.answered.border
              : COMPONENT_STYLES.questionItem.variants.normal.border),
      position: 'relative',
      paddingLeft: SPACING.toUnits(COMPONENT_STYLES.questionItem.paddingLeft),
      paddingRight: isAnswered ? SPACING.toUnits(
          COMPONENT_STYLES.questionItem.paddingLeft) : SPACING.toUnits(
          COMPONENT_STYLES.questionItem.padding),
      '&:hover': {
        backgroundColor: withOpacity(levelColor, '15'),
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      minHeight: COMPONENT_STYLES.questionItem.minHeight,
      marginBottom: SPACING.toUnits(COMPONENT_STYLES.questionItem.marginBottom),
      display: 'flex',
      alignItems: 'center',
      ...options,
    };
  }, [isSelected, isAnswered, skillLevel, options]);
}

// Hook for text styling in items
export function useItemTextStyles(
    isSelected, isSmallScreen = false, options = {}) {
  return useMemo(() => ({
    fontWeight: isSelected
        ? TYPOGRAPHY.fontWeight.semiBold
        : TYPOGRAPHY.fontWeight.regular,
    textAlign: 'left',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: isSmallScreen
        ? TYPOGRAPHY.fontSize.body2
        : TYPOGRAPHY.fontSize.body1,
    paddingRight: SPACING.toUnits(SPACING.xs),
    lineHeight: 1.5,
    ...options,
  }), [isSelected, isSmallScreen, options]);
}

// Hook for skill level section styling
export function useSkillLevelSectionStyles(level, options = {}) {
  const levelColors = getSkillLevelStyles(level);

  return useMemo(() => ({
    padding: SPACING.toUnits(SPACING.itemPadding),
    border: `1px solid ${levelColors.border}`,
    borderRadius: SPACING.toUnits(SPACING.borderRadius),
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: levelColors.background,
    height: '100%',
    minHeight: SPACING.lg * 5, // 120px
    ...options,
  }), [level, levelColors, options]);
}

// Hook for section header styling
export function useSectionHeaderStyles(level, options = {}) {
  const levelColors = getSkillLevelStyles(level);

  return useMemo(() => ({
    marginBottom: SPACING.toUnits(SPACING.md),
    color: levelColors.main,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
    paddingBottom: SPACING.toUnits(SPACING.sm),
    fontSize: TYPOGRAPHY.fontSize.h5,
    borderBottom: `1px solid ${withOpacity(levelColors.main, '20')}`,
    ...options,
  }), [level, levelColors, options]);
}

// Hook for answer level styling
export function useAnswerLevelStyles(level, options = {}) {
  const index = ['beginner', 'intermediate', 'advanced'].indexOf(level);
  const styles = COMPONENT_STYLES.answerLevel(index);

  return useMemo(() => ({
    border: styles.border,
    backgroundColor: styles.background,
    color: styles.color,
    padding: SPACING.toUnits(SPACING.md),
    borderRadius: SPACING.toUnits(SPACING.borderRadius),
    ...options,
  }), [level, styles, options]);
}

// Collection of all global styles - for direct imports
export const globalStyles = {
  scrollbar: scrollbarStyles,
  pre: preStyles,
  panel: panelBaseStyles,
};

export default {
  // Utility functions
  withOpacity,
  getSkillLevelStyles,
  getIndicatorColor,

  // Global styles
  globalStyles,

  // Style hooks
  usePanelStyles,
  useTitleStyles,
  useQuestionItemStyles,
  useItemTextStyles,
  useSkillLevelSectionStyles,
  useSectionHeaderStyles,
  useAnswerLevelStyles,
};