// src/components/AnswerLevelHorizontal.js
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Popper,
  Fade,
  ClickAwayListener,
  Grid
} from '@mui/material';
import {
  useAnswerLevelStyles,
  globalStyles
} from '../utils/styleHooks';
import { SPACING } from '../utils/theme';

const AnswerLevelHorizontal = ({ answerInsights, learningMode = false }) => {
  const [selectedPoints, setSelectedPoints] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [hoveredPoints, setHoveredPoints] = useState({});

  // Map category index to skill level
  const getLevelForIndex = (index) => {
    const levels = ['beginner', 'intermediate', 'advanced'];
    return levels[index] || 'beginner';
  };

  // Handle bullet point click
  const handlePointClick = (categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    setSelectedPoints(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle bullet point hover start
  const handlePointMouseEnter = (event, description, categoryIndex, pointIndex) => {
    // Set the hovered state for this point
    const key = `${categoryIndex}-${pointIndex}`;
    setHoveredPoints(prev => ({
      ...prev,
      [key]: true
    }));

    // Set tooltip content and anchor
    setTooltipContent(description);
    setAnchorEl(event.currentTarget);
  };

  // Handle bullet point hover end
  const handlePointMouseLeave = (categoryIndex, pointIndex) => {
    // Immediately close the tooltip without delay
    setAnchorEl(null);

    // Reset the hovered state for this point
    const key = `${categoryIndex}-${pointIndex}`;
    setHoveredPoints(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  // Close tooltip immediately
  const handleTooltipClose = () => {
    setAnchorEl(null);
    // Clear all hover states
    setHoveredPoints({});
  };

  const open = Boolean(anchorEl);

  // Check if a point is hovered
  const isPointHovered = (categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    return !!hoveredPoints[key];
  };

  // Replace code blocks with properly formatted code
  const formatDescription = (description) => {
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
              return part ? <Typography key={index} variant="body1" sx={{ mb: 1 }}>{part}</Typography> : null;
            } else {
              return (
                <Box
                  key={index}
                  component="pre"
                  sx={{
                    ...globalStyles.pre,
                    maxHeight: '300px'
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
      <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
        {description}
      </Typography>
    );
  };

  return (
    <Box>
      {/* Horizontal layout for all answer categories */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        mb: 2
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
                p: 1.5,
                ...answerStyles
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1.5,
                  color: answerStyles.color,
                  fontWeight: 500,
                  textAlign: 'center',
                  pb: 1
                }}
              >
                {category.category}
              </Typography>

              <Grid container spacing={1}>
                {category.points && category.points.map((point, pointIndex) => {
                  const key = `${categoryIndex}-${pointIndex}`;
                  const isSelected = selectedPoints[key];
                  const isHovered = isPointHovered(categoryIndex, pointIndex);

                  return (
                    <Grid item xs={12} key={pointIndex}>
                      <Box
                        onClick={() => handlePointClick(categoryIndex, pointIndex)}
                        onMouseEnter={(e) => handlePointMouseEnter(e, point.description, categoryIndex, pointIndex)}
                        onMouseLeave={() => handlePointMouseLeave(categoryIndex, pointIndex)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          backgroundColor: isSelected
                            ? `${answerStyles.color}15`
                            : (learningMode && !isHovered && !isSelected ? 'white' : `${answerStyles.color}05`),
                          border: `1px solid ${isSelected
                            ? `${answerStyles.color}50`
                            : (learningMode && !isHovered && !isSelected
                              ? '#e0e0e080'
                              : `${answerStyles.color}50`)}`,
                          transition: 'all 0.2s',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minHeight: '2.5rem',
                          '&:hover': {
                            backgroundColor: `${answerStyles.color}15`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }
                        }}
                      >
                        {/* Learning mode: show placeholder only when not hovered AND not selected */}
                        {learningMode && !isHovered && !isSelected ? (
                          <Box
                            sx={{
                              width: '70%',
                              height: '8px',
                              borderRadius: '4px',
                              backgroundColor: '#e0e0e080'
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isSelected ? 500 : 400,
                              fontSize: '0.9rem',
                              textAlign: 'center'
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
          minWidth: '300px'
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Fade {...TransitionProps} timeout={100}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
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

export default AnswerLevelHorizontal;