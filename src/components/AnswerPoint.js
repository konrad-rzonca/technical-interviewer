// src/components/AnswerPoint.js - Simplified precomputation approach
import React, {useEffect, useRef} from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import {useItemTextStyles} from '../utils/styles';
import {COLORS, SPACING} from '../themes/baseTheme';
import {
  formatTooltipContent,
  precomputeTooltip,
} from '../utils/formatTooltipContent';

const AnswerPoint = React.memo(({
  point,
  isSelected,
  isSmallScreen,
  learningMode,
  answerStyles,
  categoryIndex,
  pointIndex,
  onPointClick,
  tooltipProps,
}) => {
  // Use hooks unconditionally at the top level
  const textStyles = useItemTextStyles(isSelected, isSmallScreen);
  const tooltipPrecomputedRef = useRef(false);

  // Only render if we have valid point data
  if (!point || !point.title) {
    return null;
  }

  // Precompute tooltip content as soon as component is visible
  // This happens only once per point via the ref flag
  useEffect(() => {
    if (point?.description && !tooltipPrecomputedRef.current) {
      tooltipPrecomputedRef.current = true;
      // Queue this tooltip for precomputation
      precomputeTooltip(point.description);
    }
  }, [point?.description]);

  return (
      <Tooltip
          {...tooltipProps}
          title={point?.description
              ? formatTooltipContent(point.description)
              : ''}
      >
        <Box
            onClick={() => onPointClick(categoryIndex, pointIndex)}
            sx={{
              p: SPACING.toUnits(SPACING.md),
              borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
              cursor: 'pointer',
              backgroundColor: !isSelected
                  ? '#ffffff' + '80'
                  : `${answerStyles.hoverBg}`,
              border: `1px solid ${answerStyles.color}50`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '2.5rem',
              height: '100%',
              // Chrome acceleration optimizations
              transform: 'translateZ(0)',
              willChange: isSelected ? 'auto' : 'background-color, box-shadow',
              '&:hover': {
                backgroundColor: answerStyles.hoverBg,
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              },
            }}
        >
          {/* Learning mode: show placeholder only when not selected */}
          {learningMode && !isSelected ? (
              <Box
                  sx={{
                    width: '100%',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: COLORS.grey[100],
                  }}
              />
          ) : (
              <Typography
                  variant="body2"
                  sx={{
                    ...textStyles,
                    color: COLORS.text.primary,
                    textAlign: 'center',
                    width: '100%',
                  }}
              >
                {point.title}
              </Typography>
          )}
        </Box>
      </Tooltip>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for increased performance
  return (
      prevProps.point?.title === nextProps.point?.title &&
      prevProps.point?.description === nextProps.point?.description &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.isSmallScreen === nextProps.isSmallScreen &&
      prevProps.learningMode === nextProps.learningMode &&
      prevProps.categoryIndex === nextProps.categoryIndex &&
      prevProps.pointIndex === nextProps.pointIndex
  );
});

export default AnswerPoint;