// src/components/AnswerLevelHorizontal.js
import React, {useCallback, useEffect} from 'react';
import {Box, Grid, Tooltip, Typography} from '@mui/material';
import {
  globalStyles,
  useAnswerLevelStyles,
  useItemTextStyles,
} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../themes/baseTheme';
import {INDEX_TO_LEVEL} from '../utils/answerConstants';
import {useTooltip} from '../utils/useTooltip';

const AnswerLevelHorizontal = ({
  answerInsights,
  questionId,
  selectedPoints = {},
  onPointSelect,
  learningMode = false,
  isSmallScreen = false,
}) => {
  // Get standardized tooltip props
  const detailsTooltipProps = useTooltip('question', {
    placement: 'top',
    enterDelay: 100, // Faster appearance for better UX in this context
  });

  // Cleanup tooltips on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Any cleanup if needed
    };
  }, []);

  // Map category index to skill level
  const getLevelForIndex = (index) => {
    return INDEX_TO_LEVEL[index] || 'beginner';
  };

  // Handle bullet point click
  const handlePointClick = useCallback((categoryIndex, pointIndex) => {
    if (typeof onPointSelect === 'function') {
      onPointSelect(categoryIndex, pointIndex);
    } else {
      console.error('onPointSelect is not a function in AnswerLevelHorizontal');
    }
  }, [onPointSelect]);

  // Check if a point is selected - uses passed selectedPoints
  const isPointSelected = useCallback((categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    return !!selectedPoints[key];
  }, [selectedPoints]);

  // Replace code blocks with properly formatted code
  const formatDescription = useCallback((description) => {
    if (!description) return '';

    // Check if the description contains a code block
    if (description.includes('```')) {
      // Split by code block delimiters
      const parts = description.split(/```([\s\S]*?)```/);

      if (parts.length <= 1) return description;

      // Rebuild with proper code formatting
      return (
          <Box>
            {parts.map((part, index) => {
              // Even indices are regular text, odd indices are code
              if (index % 2 === 0) {
                return part ? <Typography key={index} variant="body1" sx={{
                  mb: 1,
                }}>{part}</Typography> : null;
              } else {
                return (
                    <Box
                        key={index}
                        component="pre"
                        sx={{
                          ...globalStyles.pre,
                          maxHeight: '300px',
                          margin: '8px 0',
                        }}
                    >
                      {part}
                    </Box>
                );
              }
            })}
          </Box>
      );
    }

    return (
        <Typography variant="body1" sx={{
          fontSize: TYPOGRAPHY.fontSize.regularText,
          lineHeight: 1.6,
        }}>
          {description}
        </Typography>
    );
  }, []);

  return (
      <Box>
        {/* Horizontal layout for all answer categories */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: SPACING.toUnits(SPACING.sm),
          mb: SPACING.toUnits(SPACING.sm),
        }}>
          {answerInsights && answerInsights.map((category, categoryIndex) => {
            // Get level styles for this category
            const level = getLevelForIndex(categoryIndex);
            const answerStyles = useAnswerLevelStyles(level);

            return (
                <Box
                    key={categoryIndex}
                    sx={{
                      flex: 1,
                      p: SPACING.toUnits(SPACING.md),
                      ...answerStyles,
                    }}
                >
                  <Typography
                      variant="subtitle1"
                      sx={{
                        mb: SPACING.toUnits(SPACING.md),
                        color: answerStyles.color,
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        textAlign: 'center',
                        pb: SPACING.toUnits(SPACING.sm),
                        // Added more vertical spacing around the title
                        py: SPACING.toUnits(SPACING.sm),
                        // Vertical alignment improvement
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '40px',
                      }}
                  >
                    {category.category}
                  </Typography>

                  <Grid container spacing={SPACING.toUnits(SPACING.sm)}>
                    {category.points &&
                        category.points.map((point, pointIndex) => {
                          const isSelected = isPointSelected(categoryIndex,
                              pointIndex);
                          const textStyles = useItemTextStyles(isSelected,
                              isSmallScreen);

                          return (
                              <Grid item xs={12} key={pointIndex}>
                                <Tooltip
                                    {...detailsTooltipProps}
                                    title={formatDescription(point.description)}
                                >
                                  <Box
                                      onClick={() => handlePointClick(
                                          categoryIndex, pointIndex)}
                                      sx={{
                                        p: SPACING.toUnits(SPACING.md),
                                        borderRadius: SPACING.toUnits(
                                            SPACING.borderRadius / 2),
                                        cursor: 'pointer',
                                        backgroundColor: !isSelected
                                            ? '#ffffff' + '80'
                                            : `${answerStyles.hoverBg}`,
                                        border: `1px solid ${answerStyles.color}50`,
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '2.5rem',
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
                                              // Improved text alignment
                                              textAlign: 'center',
                                              width: '100%',
                                            }}
                                        >
                                          {point.title}
                                        </Typography>
                                    )}
                                  </Box>
                                </Tooltip>
                              </Grid>
                          );
                        })}
                  </Grid>
                </Box>
            );
          })}
        </Box>
      </Box>
  );
};

export default React.memo(AnswerLevelHorizontal);