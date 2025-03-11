// src/components/AnswerLevelHorizontal.js
import React, {useCallback, useMemo} from 'react';
import {Box} from '@mui/material';
import {useTooltip} from '../utils/useTooltip';
import {ANSWER_LEVELS} from '../utils/answerConstants';
import AnswerCategory from './AnswerCategory';
import {SPACING} from '../themes/baseTheme';

// Constants for layout
const MAX_ROWS_PER_COLUMN = 2;
const MIN_ITEMS_FOR_SUBCOLUMNS = 3;

const AnswerLevelHorizontal = ({
  answerInsights,
  questionId,
  selectedPoints = {},
  onPointSelect,
  learningMode = false,
  isSmallScreen = false,
}) => {
  // Get standardized tooltip props - always call this hook
  const detailsTooltipProps = useTooltip('question', {
    placement: 'bottom',
    enterDelay: 100,
  });

  // No need to memoize again or add enterNextDelay which is causing the delay

  // Normalize and memoize answer insights to ensure we always have a valid array
  const normalizedInsights = useMemo(() => {
    if (!Array.isArray(answerInsights) || answerInsights.length === 0) {
      // Create default insights for all required levels
      return [
        {category: ANSWER_LEVELS.BASIC, points: []},
        {category: ANSWER_LEVELS.INTERMEDIATE, points: []},
        {category: ANSWER_LEVELS.ADVANCED, points: []},
      ];
    }

    // Process points to add original index for reference
    return answerInsights.map(category => {
      if (!category || !category.points) {
        return {...category, points: []};
      }

      const processedPoints = Array.isArray(category.points)
          ? category.points.map((point, idx) => ({
            ...point,
            originalIndex: idx,
          }))
          : [];

      return {
        ...category,
        points: processedPoints,
      };
    });
  }, [answerInsights]);

  // Handle bullet point click
  const handlePointClick = useCallback(
      (categoryIndex, pointIndex) => {
        if (typeof onPointSelect === 'function') {
          onPointSelect(categoryIndex, pointIndex);
        } else {
          console.error(
              'onPointSelect is not a function in AnswerLevelHorizontal');
        }
      },
      [onPointSelect],
  );

  return (
      <Box>
        {/* Horizontal layout for all answer categories */}
        <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: SPACING.toUnits(SPACING.sm),
              mb: SPACING.toUnits(SPACING.sm),
            }}
        >
          {normalizedInsights.map((category, categoryIndex) => (
              <AnswerCategory
                  key={categoryIndex}
                  category={category}
                  categoryIndex={categoryIndex}
                  selectedPoints={selectedPoints}
                  onPointSelect={handlePointClick}
                  learningMode={learningMode}
                  isSmallScreen={isSmallScreen}
                  tooltipProps={detailsTooltipProps}
              />
          ))}
        </Box>
      </Box>
  );
};

export default React.memo(AnswerLevelHorizontal);