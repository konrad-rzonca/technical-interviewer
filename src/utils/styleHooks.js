// src/utils/styleHooks.js
// A consolidated file with all style hooks and utilities
import { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  LAYOUT,
  COMPONENT_STYLES,
  SKILL_LEVEL_COLORS
} from './theme';

/**
 * STYLE HOOK UTILITIES
 * 
 * These functions help determine styling based on state or props.
 * They ensure consistency across the application.
 */

// Get skill level color information
export function getSkillLevelStyles(level) {
  return SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;
}

// Get border opacity for level (used for consistency)
export function getBorderOpacity(level) {
  if (level === 'intermediate') {
    return '60'; // Intermediate has higher contrast
  }
  return '50'; // Default opacity
}

// Get indicator dot color for skill level
export function getIndicatorColor(level) {
  if (level === 'intermediate') {
    return SKILL_LEVEL_COLORS.intermediate.light; // Softer yellow for dots
  }
  return SKILL_LEVEL_COLORS[level]?.main || COLORS.grey[500];
}

/**
 * COMPONENT STYLE HOOKS
 * 
 * These hooks create memoized styles for components based on their props and state.
 * Each hook follows a consistent naming pattern: use[Component]Styles
 */

// Panel styles hook - for sidebar panels and main content panels
export function usePanelStyles(isCollapsed = false, isMainPanel = false, options = {}) {
  return useMemo(() => ({
    width: '100%',
    height: '100%',
    border: isMainPanel ? COMPONENT_STYLES.panel.border : 'none',
    borderRadius: COMPONENT_STYLES.panel.borderRadius,
    overflow: 'auto',
    transition: 'width 0.3s ease, min-width 0.3s ease',
    padding: isCollapsed
      ? SPACING.toUnits(COMPONENT_STYLES.panel.paddingCollapsed)
      : SPACING.toUnits(COMPONENT_STYLES.panel.padding),
    ...options
  }), [isCollapsed, options]);
}

// Title styles hook - for section headings and panel titles
export function useTitleStyles(options = {}) {
  return useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.toUnits(SPACING.md),
    ...options
  }), [options]);
}

// Question item styles hook - for question items in lists
export function useQuestionItemStyles(isSelected, isAnswered, skillLevel, options = {}) {
  // Get the color for this skill level
  const levelColors = getSkillLevelStyles(skillLevel);
  const levelColor = levelColors.main;

  return useMemo(() => ({
    padding: SPACING.toUnits(COMPONENT_STYLES.questionItem.padding),
    borderRadius: SPACING.toUnits(COMPONENT_STYLES.questionItem.borderRadius),
    cursor: 'pointer',
    backgroundColor: isSelected
      ? `${levelColor}15` // Selected background
      : (isAnswered
        ? COMPONENT_STYLES.questionItem.variants.answered.backgroundColor
        : COMPONENT_STYLES.questionItem.variants.normal.backgroundColor),
    border: isSelected
      ? `2px solid ${levelColor}60` // Selected border
      : (isAnswered
        ? COMPONENT_STYLES.questionItem.variants.answered.border
        : COMPONENT_STYLES.questionItem.variants.normal.border),
    position: 'relative',
    paddingLeft: SPACING.toUnits(COMPONENT_STYLES.questionItem.paddingLeft),
    paddingRight: isAnswered ? SPACING.toUnits(COMPONENT_STYLES.questionItem.paddingLeft) : SPACING.toUnits(COMPONENT_STYLES.questionItem.padding),
    '&:hover': {
      backgroundColor: `${levelColor}15`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    minHeight: COMPONENT_STYLES.questionItem.minHeight,
    marginBottom: SPACING.toUnits(COMPONENT_STYLES.questionItem.marginBottom),
    display: 'flex',
    alignItems: 'center',
    ...options
  }), [isSelected, isAnswered, levelColor, options]);
}

// Text styles hook - for question text, category names, etc.
export function useItemTextStyles(isSelected, isSmallScreen = false, options = {}) {
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
    ...options
  }), [isSelected, isSmallScreen, options]);
}

// Skill level section styles hook - for sections in question navigation
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
    ...options
  }), [level, levelColors, options]);
}

// Section header styles hook - for skill level section headers
export function useSectionHeaderStyles(level, options = {}) {
  const levelColors = getSkillLevelStyles(level);

  return useMemo(() => ({
    marginBottom: SPACING.toUnits(SPACING.md),
    color: levelColors.main,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    textAlign: 'center',
    paddingBottom: SPACING.toUnits(SPACING.sm),
    fontSize: TYPOGRAPHY.fontSize.h5,
    borderBottom: `1px solid ${levelColors.main}20`,
    ...options
  }), [level, levelColors, options]);
}

// Answer level styles hook - for answer insights sections
export function useAnswerLevelStyles(level, options = {}) {
  const index = ['beginner', 'intermediate', 'advanced'].indexOf(level);
  const styles = COMPONENT_STYLES.answerLevel(index);

  return useMemo(() => ({
    border: styles.border,
    backgroundColor: styles.background,
    color: styles.color,
    padding: SPACING.toUnits(SPACING.md),
    borderRadius: SPACING.toUnits(SPACING.borderRadius),
    ...options
  }), [level, styles, options]);
}

// Responsive width hook - helps components respond to container width
export function useResponsiveWidth(containerRef) {
  const theme = useTheme();
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Create ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      window.requestAnimationFrame(() => {
        updateWidth();
      });
    });

    // Observe container
    resizeObserver.observe(containerRef.current);

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return width;
}

// CSS-in-JS styles for implementing functionality from main.css
export const globalStyles = {
  // Scrollbar styling
  scrollbar: {
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
  },

  // Code block styling
  code: {
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: '0.2em 0.4em',
    borderRadius: '3px',
    fontSize: '85%',
  },

  pre: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: '1em',
    borderRadius: '5px',
    overflowX: 'auto',
    margin: '0.5em 0',
  },
};