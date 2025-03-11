﻿// src/components/AnswerCategory.js
import React, {useCallback, useMemo} from 'react';
import {Box, Grid, Typography} from '@mui/material';
import {useAnswerLevelStyles} from '../utils/styles';
import {SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {INDEX_TO_LEVEL} from '../utils/answerConstants';
import AnswerPoint from './AnswerPoint';

// Constants for layout
const MAX_ROWS_PER_COLUMN = 2;
const MIN_ITEMS_FOR_SUBCOLUMNS = 3;

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
  }, [category?.points]);

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
}, (prevProps, nextProps) => {
  // Custom comparison function for optimal performance
  return (
      prevProps.category?.category === nextProps.category?.category &&
      prevProps.categoryIndex === nextProps.categoryIndex &&
      prevProps.learningMode === nextProps.learningMode &&
      prevProps.isSmallScreen === nextProps.isSmallScreen &&
      // Do shallow comparison of points arrays
      (prevProps.category?.points?.length ===
          nextProps.category?.points?.length &&
          (!prevProps.category?.points || !nextProps.category?.points ||
              prevProps.category.points.every((point, i) =>
                  point.title === nextProps.category.points[i].title &&
                  point.description ===
                  nextProps.category.points[i].description))) &&
      // Selected points usually change, so only avoid re-render if they're identical
      JSON.stringify(prevProps.selectedPoints) ===
      JSON.stringify(nextProps.selectedPoints)
  );
});

export default AnswerCategory;