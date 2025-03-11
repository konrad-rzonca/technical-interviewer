// src/utils/useTooltip.js
import {useMemo} from 'react';
import {
  TOOLTIP_PLACEMENT,
  TOOLTIP_STYLING,
  TOOLTIP_TIMING,
  TOOLTIP_TYPES,
} from './tooltipConstants';

/**
 * Custom hook for standardized tooltip configurations
 *
 * @param {string} type - Type of tooltip (question, related, action, navigation)
 * @param {object} overrides - Any tooltip props to override defaults
 * @returns {object} Tooltip props with consistent configuration
 */
export function useTooltip(type = TOOLTIP_TYPES.DEFAULT, overrides = {}) {
  return useMemo(() => {
    // Base configuration for all tooltips
    const baseConfig = {
      arrow: TOOLTIP_STYLING.ARROW,
      enterDelay: TOOLTIP_TIMING.ENTER_DELAY,
      leaveDelay: TOOLTIP_TIMING.LEAVE_DELAY,
      enterTouchDelay: 0, // Ensure mobile device tooltips appear quickly
      // This is the key part - use slotProps to style the tooltip content
      TransitionProps: {
        timeout: TOOLTIP_TIMING.TRANSITION_DURATION,
      },
      slotProps: {
        tooltip: {
          sx: {
            backgroundColor: TOOLTIP_STYLING.BACKGROUND_COLOR,
            color: TOOLTIP_STYLING.TEXT_COLOR,
            boxShadow: TOOLTIP_STYLING.BOX_SHADOW,
            borderRadius: TOOLTIP_STYLING.BORDER_RADIUS,
            padding: TOOLTIP_STYLING.PADDING,
            maxWidth: TOOLTIP_STYLING.MAX_WIDTH,
          },
        },
        arrow: {
          sx: {
            color: TOOLTIP_STYLING.BACKGROUND_COLOR,
          },
        },
      },
      PopperProps: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
        ],
      },
    };

    // Type-specific configurations
    const typeConfigs = {
      [TOOLTIP_TYPES.QUESTION]: {
        placement: TOOLTIP_PLACEMENT.QUESTION_ITEM,
      },
      [TOOLTIP_TYPES.RELATED]: {
        placement: TOOLTIP_PLACEMENT.RELATED_QUESTION,
      },
      [TOOLTIP_TYPES.ACTION]: {
        placement: TOOLTIP_PLACEMENT.ACTION_BUTTON,
      },
      [TOOLTIP_TYPES.NAVIGATION]: {
        placement: TOOLTIP_PLACEMENT.NAVIGATION,
      },
    };

    // Merge base config with type-specific config
    const typeConfig = typeConfigs[type] || {};
    const mergedConfig = {...baseConfig, ...typeConfig};

    // Apply any overrides
    return {...mergedConfig, ...overrides};
  }, [type, overrides]);
}