// src/components/AnswerLevelHorizontal.js
import React, {useCallback, useMemo} from 'react';
import {Box, Grid, Tooltip, Typography} from '@mui/material';
import {useAnswerLevelStyles, useItemTextStyles} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {ANSWER_LEVELS, INDEX_TO_LEVEL} from '../utils/answerConstants';
import {useTooltip} from '../utils/useTooltip';
import {formatTooltipContent} from '../utils/formatTooltipContent';

// Constants for layout
const MAX_ROWS_PER_COLUMN = 2;
const MIN_ITEMS_FOR_SUBCOLUMNS = 3;

// Separated out as a memoized component to ensure consistent hook usage
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

  // Only render if we have valid point data
  if (!point || !point.title) {
    return null;
  }

  // Format description for tooltip using our utility function
  const formattedDescription = formatTooltipContent(point.description);

  return (
      <Tooltip {...tooltipProps}
               title={formattedDescription}>
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
});

// Separated out as a memoized component to ensure consistent hook usage
const AnswerCategory = React.memo(({
  category,
  categoryIndex,
  selectedPoints,
  onPointSelect,
  learningMode,
  isSmallScreen,
  tooltipProps,
}) => {
  // Always call hooks unconditionally at the top level
  const level = INDEX_TO_LEVEL[categoryIndex] || 'basic';
  const answerStyles = useAnswerLevelStyles(level);

  // Check if a point is selected
  const isPointSelected = useCallback(
      (categoryIdx, pointIdx) => {
        const key = `${categoryIdx}-${pointIdx}`;
        return !!selectedPoints[key];
      },
      [selectedPoints],
  );

  // Calculate the layout for points
  const pointsLayout = useMemo(() => {
    const points = category?.points || [];

    // No points case
    if (!Array.isArray(points) || points.length === 0) {
      return {
        needsSubColumns: false,
        pointGroups: [],
        placeholderCount: MAX_ROWS_PER_COLUMN,
      };
    }

    // Determine if we need sub-columns
    const validPoints = points.filter(p => p && p.title);
    const needsSubColumns = validPoints.length >= MIN_ITEMS_FOR_SUBCOLUMNS;

    if (!needsSubColumns) {
      // Simple layout - all points in a single column
      const placeholderCount = Math.max(0,
          MAX_ROWS_PER_COLUMN - validPoints.length);
      return {
        needsSubColumns: false,
        pointGroups: [validPoints],
        placeholderCount,
      };
    } else {
      // Calculate number of columns needed for a balanced layout
      // We want each column to have at most MAX_ROWS_PER_COLUMN items
      const columnCount = Math.ceil(validPoints.length / MAX_ROWS_PER_COLUMN);
      const pointsPerColumn = Math.ceil(validPoints.length / columnCount);

      // Distribute points into columns
      const pointGroups = [];
      for (let i = 0; i < columnCount; i++) {
        const startIdx = i * pointsPerColumn;
        const endIdx = Math.min(startIdx + pointsPerColumn, validPoints.length);
        const columnPoints = validPoints.slice(startIdx, endIdx);

        // Add placeholders if needed to ensure consistent height
        const placeholdersNeeded = pointsPerColumn - columnPoints.length;
        pointGroups.push({
          points: columnPoints,
          placeholderCount: Math.max(0, placeholdersNeeded),
        });
      }

      return {
        needsSubColumns: true,
        pointGroups,
        placeholderCount: 0,
      };
    }
  }, [category]);

  // Don't render if category is invalid
  if (!category || !category.category) {
    return <Box sx={{flex: 1}}/>;
  }

  return (
      <Box
          sx={{
            flex: 1,
            p: SPACING.toUnits(SPACING.md),
            ...answerStyles,
          }}
      >
        {/* Category Title */}
        <Typography
            variant="subtitle1"
            sx={{
              mb: SPACING.toUnits(SPACING.md),
              color: answerStyles.color,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              textAlign: 'center',
              pb: SPACING.toUnits(SPACING.sm),
              py: SPACING.toUnits(SPACING.sm),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40px',
            }}
        >
          {category.category}
        </Typography>

        {/* Points container */}
        <Box>
          {pointsLayout.needsSubColumns ? (
              // Multi-column layout
              <Grid container spacing={SPACING.toUnits(SPACING.sm)}>
                {pointsLayout.pointGroups.map((group, groupIndex) => (
                    <Grid item xs={12 / pointsLayout.pointGroups.length}
                          key={`group-${groupIndex}`}>
                      <Grid container spacing={SPACING.toUnits(SPACING.sm)}>
                        {group.points.map((point, pointIndex) => (
                            <Grid item xs={12}
                                  key={`point-${groupIndex}-${pointIndex}`}>
                              <AnswerPoint
                                  point={point}
                                  isSelected={isPointSelected(categoryIndex,
                                      point.originalIndex)}
                                  isSmallScreen={isSmallScreen}
                                  learningMode={learningMode}
                                  answerStyles={answerStyles}
                                  categoryIndex={categoryIndex}
                                  pointIndex={point.originalIndex}
                                  onPointClick={onPointSelect}
                                  tooltipProps={tooltipProps}
                              />
                            </Grid>
                        ))}
                        {/* Add placeholder items to maintain consistent height */}
                        {Array.from({length: group.placeholderCount}).
                            map((_, idx) => (
                                <Grid item xs={12}
                                      key={`placeholder-${groupIndex}-${idx}`}>
                                  <Box sx={{
                                    height: '2.5rem',
                                    visibility: 'hidden',
                                  }}/>
                                </Grid>
                            ))}
                      </Grid>
                    </Grid>
                ))}
              </Grid>
          ) : (
              // Single column layout
              <Grid container spacing={SPACING.toUnits(SPACING.sm)}>
                {pointsLayout.pointGroups[0]?.map((point, pointIndex) => (
                    <Grid item xs={12} key={pointIndex}>
                      <AnswerPoint
                          point={point}
                          isSelected={isPointSelected(categoryIndex,
                              pointIndex)}
                          isSmallScreen={isSmallScreen}
                          learningMode={learningMode}
                          answerStyles={answerStyles}
                          categoryIndex={categoryIndex}
                          pointIndex={pointIndex}
                          onPointClick={onPointSelect}
                          tooltipProps={tooltipProps}
                      />
                    </Grid>
                ))}
                {/* Add placeholder items to maintain consistent height */}
                {Array.from({length: pointsLayout.placeholderCount}).
                    map((_, idx) => (
                        <Grid item xs={12} key={`placeholder-${idx}`}>
                          <Box sx={{height: '2.5rem', visibility: 'hidden'}}/>
                        </Grid>
                    ))}
              </Grid>
          )}


        </Box>
      </Box>
  );
});

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

  // Normalize answer insights to ensure we always have a valid array
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