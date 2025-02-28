// src/utils/styleHooks.js - Optimized
import { useMemo } from 'react';
import { COLORS, TYPOGRAPHY, SPACING, COMPONENT_STYLES, SKILL_LEVEL_COLORS } from './theme';
import globalStyles from './globalStyles';

/**
 * STYLE HOOK UTILITIES
 * 
 * These functions help determine styling based on state or props.
 * They ensure consistency across the application.
 */

/**
 * Get styling information for a specific skill level
 * @param {string} level - The skill level ('beginner', 'intermediate', 'advanced')
 * @returns {Object} Style information for the level
 */
export function getSkillLevelStyles(level) {
  return SKILL_LEVEL_COLORS[level] || SKILL_LEVEL_COLORS.beginner;
}

/**
 * Get the indicator color for a skill level
 * @param {string} level - The skill level
 * @returns {string} Color value for the indicator
 */
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

/**
 * Hook for panel styling
 * @param {boolean} isCollapsed - Whether the panel is collapsed
 * @param {boolean} isMainPanel - Whether the panel is a main content panel
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the panel
 */
export function usePanelStyles(isCollapsed = false, isMainPanel = false, options = {}) {
  return useMemo(() => ({
    ...globalStyles.panel,
    width: '100%',
    height: '100%',
    border: isMainPanel ? COMPONENT_STYLES.panel.border : 'none',
    transition: 'width 0.3s ease, min-width 0.3s ease',
    padding: isCollapsed
      ? SPACING.toUnits(COMPONENT_STYLES.panel.paddingCollapsed)
      : SPACING.toUnits(COMPONENT_STYLES.panel.padding),
    ...options
  }), [isCollapsed, isMainPanel, options]);
}

/**
 * Hook for title styling
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the title
 */
export function useTitleStyles(options = {}) {
  return useMemo(() => ({
    ...globalStyles.typography.heading4,
    marginBottom: SPACING.toUnits(SPACING.md),
    ...options
  }), [options]);
}

/**
 * Hook for question item styling
 * @param {boolean} isSelected - Whether the item is selected
 * @param {boolean} isAnswered - Whether the question has been answered
 * @param {string} skillLevel - The skill level of the question
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the question item
 */
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

/**
 * Hook for text styling in items
 * @param {boolean} isSelected - Whether the item is selected
 * @param {boolean} isSmallScreen - Whether the screen is small
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the text
 */
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

/**
 * Hook for skill level section styling
 * @param {string} level - The skill level
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the skill level section
 */
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

/**
 * Hook for section header styling
 * @param {string} level - The skill level
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the section header
 */
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

/**
 * Hook for answer level styling
 * @param {string} level - The skill level
 * @param {Object} options - Additional style overrides
 * @returns {Object} Styles for the answer level
 */
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

/**
 * Hook for responsive width
 * @param {React.MutableRefObject} containerRef - Ref to the container element
 * @returns {number} The current width of the container
 */
export function useResponsiveWidth(containerRef) {
  const [width, setWidth] = React.useState(0);
  const { useEffect } = React;

  useEffect(() => {
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

// Export globalStyles for direct use in components
export { globalStyles };