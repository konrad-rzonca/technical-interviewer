// src/components/AnswerLevelHorizontal.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import {
  globalStyles,
  useAnswerLevelStyles,
  useItemTextStyles,
} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../utils/theme';

const AnswerLevelHorizontal = ({
  answerInsights,
  learningMode = false,
  isSmallScreen = false,
}) => {
  const [selectedPoints, setSelectedPoints] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [hoveredPoints, setHoveredPoints] = useState({});

  // Cleanup tooltips on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      setAnchorEl(null);
      setHoveredPoints({});
    };
  }, []);

  // Map category index to skill level
  const getLevelForIndex = (index) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    return levels[index] || 'beginner';
  };

  // Handle bullet point click
  const handlePointClick = useCallback((categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    setSelectedPoints(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Handle bullet point hover start
  const handlePointMouseEnter = useCallback(
      (event, description, categoryIndex, pointIndex) => {
        // Set the hovered state for this point
        const key = `${categoryIndex}-${pointIndex}`;
        setHoveredPoints(prev => ({
          ...prev,
          [key]: true,
        }));

        // Set tooltip content and anchor
        setTooltipContent(description);
        setAnchorEl(event.currentTarget);
      }, []);

  // Handle bullet point hover end
  const handlePointMouseLeave = useCallback((categoryIndex, pointIndex) => {
    // Immediately close the tooltip without delay
    setAnchorEl(null);

    // Reset the hovered state for this point
    const key = `${categoryIndex}-${pointIndex}`;
    setHoveredPoints(prev => {
      const newState = {...prev};
      delete newState[key];
      return newState;
    });
  }, []);

  // Close tooltip immediately
  const handleTooltipClose = useCallback(() => {
    setAnchorEl(null);
    // Clear all hover states
    setHoveredPoints({});
  }, []);

  const open = Boolean(anchorEl);

  // Check if a point is hovered
  const isPointHovered = useCallback((categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    return !!hoveredPoints[key];
  }, [hoveredPoints]);

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
                  mb: SPACING.toUnits(SPACING.sm),
                }}>{part}</Typography> : null;
              } else {
                return (
                    <Box
                        key={index}
                        component="pre"
                        sx={{
                          ...globalStyles.pre,
                          maxHeight: '300px',
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

            console.log(categoryIndex, level, answerStyles);

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
                          const key = `${categoryIndex}-${pointIndex}`;
                          const isSelected = selectedPoints[key];
                          const isHovered = isPointHovered(categoryIndex,
                              pointIndex);
                          const textStyles = useItemTextStyles(isSelected,
                              isSmallScreen);

                          return (
                              <Grid item xs={12} key={pointIndex}>
                                <Box
                                    onClick={() => handlePointClick(
                                        categoryIndex, pointIndex)}
                                    onMouseEnter={(e) => handlePointMouseEnter(
                                        e, point.description, categoryIndex,
                                        pointIndex)}
                                    onMouseLeave={() => handlePointMouseLeave(
                                        categoryIndex, pointIndex)}
                                    sx={{
                                      p: SPACING.toUnits(SPACING.md),
                                      borderRadius: SPACING.toUnits(
                                          SPACING.borderRadius / 2),
                                      cursor: 'pointer',
                                      backgroundColor: !isHovered && !isSelected
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
                                  {/* Learning mode: show placeholder only when not hovered AND not selected */}
                                  {learningMode && !isHovered && !isSelected ? (
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
                              </Grid>
                          );
                        })}
                  </Grid>
                </Box>
            );
          })}
        </Box>

        {/* Large, readable tooltip */}
        <Popper
            open={open}
            anchorEl={anchorEl}
            placement="top"
            transition
            modifiers={[
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ]}
            sx={{
              zIndex: 1200,
              maxWidth: '600px',
              minWidth: '300px',
            }}
        >
          {({TransitionProps}) => (
              <ClickAwayListener onClickAway={handleTooltipClose}>
                <Fade {...TransitionProps} timeout={100}>
                  <Paper
                      elevation={6}
                      sx={{
                        p: SPACING.toUnits(SPACING.lg),
                        borderRadius: SPACING.toUnits(SPACING.sm),
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                      }}
                  >
                    {typeof tooltipContent === 'string'
                        ? formatDescription(tooltipContent)
                        : tooltipContent}
                  </Paper>
                </Fade>
              </ClickAwayListener>
          )}
        </Popper>
      </Box>
  );
};

export default React.memo(AnswerLevelHorizontal);