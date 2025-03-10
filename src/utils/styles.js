// src/utils/styles.js - Unified styling system
import {useMemo} from 'react';
import {useTheme} from '@mui/material/styles';
import {
  COLORS,
  COMPONENT_STYLES,
  SCROLLBAR_STYLES,
  SKILL_LEVEL_COLORS,
  SPACING,
  TYPOGRAPHY,
} from '../themes/baseTheme';

/**
 * UTILITY FUNCTIONS
 * Helper functions for styling operations
 */

// Apply opacity to a color
export const withOpacity = (color, opacity) => `${color}${opacity}`;

// Get styling information for a specific skill level
export const getSkillLevelStyles = (level) => {
  return SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.basic;
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
export const scrollbarStyles = SCROLLBAR_STYLES.thin;

// Pre block for code examples
export const preStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  padding: SPACING.toUnits(SPACING.md),
  borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
  overflowX: 'auto',
  margin: `${SPACING.toUnits(SPACING.xxs)} 0`,
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

export const getThemedScrollbarStyles = (level) => {
  const levelColors = getSkillLevelStyles(level);
  return SCROLLBAR_STYLES.themed(levelColors.main);
};

// Hook for panel styling
export function usePanelStyles(
    isCollapsed = false, isMainPanel = false, options = {}) {
  const theme = useTheme();

  return useMemo(() => ({
    ...panelBaseStyles,
    width: '100%',
    border: isMainPanel ? COMPONENT_STYLES.panel.border : 'none',
    borderRadius: theme.shape.borderRadius || SPACING.borderRadius,
    transition: 'width 0.3s ease, min-width 0.3s ease',
    padding: isCollapsed
        ? SPACING.toUnits(COMPONENT_STYLES.panel.paddingCollapsed)
        : SPACING.toUnits(COMPONENT_STYLES.panel.padding),
    ...options,
  }), [isCollapsed, isMainPanel, options, theme.shape.borderRadius]);
}

// Hook for title styling
export function useTitleStyles(options = {}) {
  const theme = useTheme();

  return useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.2,
    marginBottom: SPACING.toUnits(SPACING.md),
    color: theme.palette.text.primary,
    ...options,
  }), [options, theme.palette.text.primary]);
}

// Hook for question item styling
export function useQuestionItemStyles(
    isSelected, isAnswered, skillLevel, options = {}) {
  const theme = useTheme();

  return useMemo(() => {
    const levelColors = getSkillLevelStyles(skillLevel);
    const levelColor = levelColors.main;

    return {
      padding: SPACING.toUnits(COMPONENT_STYLES.questionItem.padding),
      borderRadius: theme.shape.borderRadius / 2 ||
          COMPONENT_STYLES.questionItem.borderRadius,
      cursor: 'pointer',
      backgroundColor: isSelected
          ? withOpacity(levelColor, '15') // Selected background
          : (isAnswered
              ? withOpacity(levelColor, '14')
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
        transform: 'translateZ(0)',
      },
      minHeight: COMPONENT_STYLES.questionItem.minHeight,
      marginBottom: SPACING.toUnits(COMPONENT_STYLES.questionItem.marginBottom),
      display: 'flex',
      alignItems: 'center',
      ...options,
    };
  }, [isSelected, isAnswered, skillLevel, options, theme.shape.borderRadius]);
}

// Hook for text styling in items
export function useItemTextStyles(
    isSelected, isSmallScreen = false, options = {}) {
  const theme = useTheme();

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
    color: theme.palette.text.primary,
    ...options,
  }), [isSelected, isSmallScreen, options, theme.palette.text.primary]);
}

// Hook for skill level section styling
export function useSkillLevelSectionStyles(level, options = {}) {
  const theme = useTheme();
  const levelColors = getSkillLevelStyles(level);

  return useMemo(() => ({
    padding: SPACING.toUnits(SPACING.itemPadding),
    border: `1px solid ${levelColors.border}`,
    borderRadius: theme.shape.borderRadius || SPACING.borderRadius,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: levelColors.background,
    height: '100%',
    minHeight: SPACING.lg * 5, // 120px
    ...options,
  }), [level, levelColors, options, theme.shape.borderRadius]);
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
  const theme = useTheme();
  const index = ['basic', 'intermediate', 'advanced'].indexOf(level);
  const styles = COMPONENT_STYLES.answerLevel(index);

  return useMemo(() => ({
    border: styles.border,
    backgroundColor: styles.backgroundColor,
    hoverBg: styles.hoverBg,
    color: styles.color,
    padding: SPACING.toUnits(SPACING.md),
    borderRadius: theme.shape.borderRadius || SPACING.borderRadius,
    ...options,
  }), [level, styles, options, theme.shape.borderRadius]);
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