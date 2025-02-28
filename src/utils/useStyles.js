// src/utils/useStyles.js
import { useMemo } from 'react';
import { COMPONENT_STYLES, FONT_SIZES, FONT_WEIGHTS } from './theme';
import { SKILL_LEVELS } from './constants';

/**
 * Hook to create panel styles based on collapsed state
 * @param {boolean} isCollapsed - Whether the panel is in a collapsed state
 * @returns {Object} - The panel style object
 */
export function usePanelStyles(isCollapsed) {
  return useMemo(() => ({
    width: '100%',
    height: '100%',
    border: COMPONENT_STYLES.panel.border,
    borderRadius: COMPONENT_STYLES.panel.borderRadius,
    overflow: 'auto',
    transition: 'width 0.3s ease, min-width 0.3s ease',
    p: isCollapsed ? COMPONENT_STYLES.panel.paddingCollapsed : COMPONENT_STYLES.panel.padding,
  }), [isCollapsed]);
}

/**
 * Hook to create panel title styles
 * @param {Object} options - Optional customizations
 * @returns {Object} - The title style object
 */
export function useTitleStyles(options = {}) {
  return useMemo(() => ({
    fontSize: FONT_SIZES.panelTitle,
    fontWeight: FONT_WEIGHTS.medium,
    mb: 2,
    ...options
  }), [options]);
}

/**
 * Hook to create question item styles
 * @param {boolean} isSelected - Whether the item is selected
 * @param {boolean} isAnswered - Whether the question has been answered
 * @param {string} levelColor - The color associated with the question's skill level
 * @returns {Object} - The item style object
 */
export function useQuestionItemStyles(isSelected, isAnswered, levelColor) {
  return useMemo(() => ({
    p: 2,
    borderRadius: COMPONENT_STYLES.questionItem.borderRadius,
    cursor: 'pointer',
    backgroundColor: isSelected
      ? COMPONENT_STYLES.questionItem.selectedBg(levelColor)
      : (isAnswered ? COMPONENT_STYLES.questionItem.answeredBg
        : COMPONENT_STYLES.questionItem.normalBg),
    border: isSelected
      ? COMPONENT_STYLES.questionItem.selectedBorder(levelColor)
      : (isAnswered ? COMPONENT_STYLES.questionItem.answeredBorder
        : COMPONENT_STYLES.questionItem.normalBorder),
    position: 'relative',
    paddingLeft: '28px',
    paddingRight: isAnswered ? '28px' : '10px',
    '&:hover': {
      backgroundColor: COMPONENT_STYLES.questionItem.hoverBg(levelColor),
      boxShadow: COMPONENT_STYLES.questionItem.hoverShadow
    },
    minHeight: COMPONENT_STYLES.questionItem.minHeight,
    mb: 0.75,
    display: 'flex',
    alignItems: 'center'
  }), [isSelected, isAnswered, levelColor]);
}

/**
 * Hook to create skill level section styles
 * @param {string} level - The skill level (beginner, intermediate, advanced)
 * @returns {Object} - The section style object
 */
export function useSkillLevelSectionStyles(level) {
  const levelColor = SKILL_LEVELS[level]?.color || '#9e9e9e';
  const borderOpacity = level === 'intermediate' ? '60' : '50';

  return useMemo(() => ({
    p: 1.5, // Larger padding
    border: `1px solid ${levelColor}${borderOpacity}`,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: `${levelColor}10`,
    height: '100%',
    minHeight: '120px', // Taller minimum height
  }), [level, levelColor, borderOpacity]);
}

/**
 * Hook to create the text styles for items like questions or categories
 * @param {boolean} isSelected - Whether the item is selected
 * @param {boolean} isSmallScreen - Whether we're on a small screen
 * @returns {Object} - The text style object
 */
export function useItemTextStyles(isSelected, isSmallScreen = false) {
  return useMemo(() => ({
    fontWeight: isSelected ? FONT_WEIGHTS.semiBold : FONT_WEIGHTS.regular,
    textAlign: 'left',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: isSmallScreen ? FONT_SIZES.body2 : FONT_SIZES.body1,
    paddingRight: '4px',
    lineHeight: 1.5
  }), [isSelected, isSmallScreen]);
}