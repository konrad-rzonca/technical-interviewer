// src/components/QuestionNavigation.js - Refactored
import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Divider, Grid, useTheme, useMediaQuery } from '@mui/material';
import SkillLevelSection from './SkillLevelSection';
import { useTitleStyles } from '../utils/styleHooks';
import { LAYOUT, TYPOGRAPHY, SPACING } from '../utils/theme';

const QuestionNavigation = ({
  filteredQuestions,
  currentQuestion,
  gradesMap,
  onQuestionSelect
}) => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // Use the column threshold from theme
  const isVeryWideScreen = useMediaQuery(`(min-width:${LAYOUT.COLUMN_THRESHOLD}px)`);

  // Container ref to measure available width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Default to 1 column unless on very wide screens
  const [columnCount, setColumnCount] = useState(isVeryWideScreen ? 2 : 1);

  // Get title styles from hooks
  const titleStyles = useTitleStyles({
    mt: SPACING.toUnits(SPACING.sm),
    mb: SPACING.toUnits(SPACING.md),
    fontSize: TYPOGRAPHY.fontSize.h5
  });

  // ResizeObserver for content-aware layout
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);

        // Base column count on actual container width
        // Only use 2 columns when container is very wide
        if (width >= LAYOUT.COLUMN_THRESHOLD) {
          setColumnCount(2);
        } else {
          setColumnCount(1);
        }
      }
    };

    // Initial measurement
    updateWidth();

    // Create ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      // Debounce resize events to avoid loops
      window.requestAnimationFrame(() => {
        updateWidth();
      });
    });

    // Observe the container
    resizeObserver.observe(containerRef.current);

    return () => {
      // Clean up observer when component unmounts
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Update column count when screen size changes
  useEffect(() => {
    setColumnCount(isVeryWideScreen ? 2 : 1);
  }, [isVeryWideScreen]);

  // Early return with hooks already called
  if (!filteredQuestions || filteredQuestions.length === 0) {
    return null;
  }

  // Group questions by skill level
  const skillLevelGroups = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  // Fill the groups with questions
  filteredQuestions.forEach(question => {
    if (skillLevelGroups.hasOwnProperty(question.skillLevel)) {
      skillLevelGroups[question.skillLevel].push(question);
    } else {
      // Default to intermediate if unknown skill level
      skillLevelGroups.intermediate.push(question);
    }
  });

  // Sort questions within each group alphabetically
  Object.keys(skillLevelGroups).forEach(level => {
    skillLevelGroups[level].sort((a, b) => {
      const titleA = a.shortTitle || a.question;
      const titleB = b.shortTitle || b.question;
      return titleA.localeCompare(titleB);
    });
  });

  return (
    <Box
      ref={containerRef}
      sx={{
        mt: SPACING.toUnits(SPACING.xs),
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      <Divider />

      <Typography
        variant="subtitle1"
        sx={titleStyles}
      >
        Question Navigation
      </Typography>

      {/* Three-column layout for question skill levels */}
      <Grid container spacing={SPACING.toUnits(SPACING.sm)} sx={{ mt: SPACING.toUnits(SPACING.xs) }}>
        {Object.keys(skillLevelGroups).map((level) => (
          <Grid item xs={12} md={4} key={level}>
            <SkillLevelSection
              level={level}
              questions={skillLevelGroups[level]}
              currentQuestion={currentQuestion}
              gradesMap={gradesMap}
              onQuestionSelect={onQuestionSelect}
              columnCount={columnCount}
              isSmallScreen={isExtraSmallScreen}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuestionNavigation;