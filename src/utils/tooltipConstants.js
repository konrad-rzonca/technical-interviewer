// src/utils/tooltipConstants.js
/**
 * Constants for tooltip configuration
 */

export const TOOLTIP_PLACEMENT = {
  QUESTION_ITEM: 'top',
  RELATED_QUESTION: 'left',
  ACTION_BUTTON: 'bottom',
  NAVIGATION: 'right',
};

export const TOOLTIP_TIMING = {
  ENTER_DELAY: 300,
  LEAVE_DELAY: 0,
};

export const TOOLTIP_STYLING = {
  BACKGROUND_COLOR: 'rgba(60,60,60,1)',
  TEXT_COLOR: '#fff',
  ARROW: true,
  BOX_SHADOW: '0 4px 12px rgba(0, 0, 0, 0.2)',
  BORDER_RADIUS: 4,
  PADDING: '12px 18px', // Standardized padding for all tooltips
  MAX_WIDTH: 500,
};