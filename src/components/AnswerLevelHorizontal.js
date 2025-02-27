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

const AnswerLevelHorizontal = ({ answerInsights, learningMode = false }) => {
  const [selectedPoints, setSelectedPoints] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipContent, setTooltipContent] = useState('');
  const [hoveredPoints, setHoveredPoints] = useState({});

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

  // Get level color - completely redesigned color scheme without red
  const getLevelColor = (index) => {
    switch (index) {
      case 0: return '#66bb6a'; // green for Basic
      case 1: return '#ffca28'; // amber/yellow for Intermediate
      case 2: return '#fb8c00'; // deeper orange for Advanced (no red)
      default: return '#9e9e9e'; // gray default
    }
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
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    p: 2,
                    borderRadius: 2,
                    overflowX: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    mt: 1,
                    mb: 2,
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

  // Check if a point is hovered
  const isPointHovered = (categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    return !!hoveredPoints[key];
  };

  return (
    <Box>
      {/* Horizontal layout for all answer categories */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        mb: 2
      }}>
        {answerInsights && answerInsights.map((category, categoryIndex) => (
          <Box
            key={categoryIndex}
            sx={{
              flex: 1,
              p: 2,
              border: `1px solid ${getLevelColor(categoryIndex)}20`, // More transparent border
              borderRadius: 2,
              backgroundColor: `${getLevelColor(categoryIndex)}03` // Extremely subtle background
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                mb: 2,
                color: getLevelColor(categoryIndex),
                fontWeight: 500,
                textAlign: 'center',
                pb: 1,
                borderBottom: `1px solid ${getLevelColor(categoryIndex)}15` // More transparent border
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
                          ? `${getLevelColor(categoryIndex)}08` // Very light selected background
                          : (learningMode && !isHovered && !isSelected ? 'white' : `${getLevelColor(categoryIndex)}03`), // Extremely light default background
                        border: `1px solid ${isSelected
                          ? `${getLevelColor(categoryIndex)}30` // Semi-transparent border for selected
                          : (learningMode && !isHovered && !isSelected ? '#e0e0e060' : `${getLevelColor(categoryIndex)}15`)}`, // Very light borders
                        transition: 'all 0.2s',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '2.5rem',
                        '&:hover': {
                          backgroundColor: `${getLevelColor(categoryIndex)}08`, // Light hover background
                          boxShadow: '0 1px 2px rgba(0,0,0,0.03)' // Subtle shadow on hover
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
                            backgroundColor: '#e0e0e060' // More transparent placeholder
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
        ))}
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
              offset: [0, 10], // Adds some spacing from the anchor element
            },
          },
        ]}
        sx={{
          zIndex: 1200,
          maxWidth: '600px', // Wider tooltip
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