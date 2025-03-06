// src/components/QuestionNavigation.js
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import SkillLevelSection from './SkillLevelSection';
import {scrollbarStyles, usePanelStyles, useTitleStyles} from '../utils/styles';
import {LAYOUT, SPACING, TYPOGRAPHY} from '../themes/baseTheme';

const QuestionNavigation = ({
  filteredQuestions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
}) => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  // Use the column threshold from theme
  const isVeryWideScreen = useMediaQuery(
      `(min-width:${LAYOUT.COLUMN_THRESHOLD}px)`);

  // Container ref to measure available width
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Default to 1 column unless on very wide screens
  const [columnCount, setColumnCount] = useState(isVeryWideScreen ? 2 : 1);

  // Get styles from style hooks for consistency with other panels
  const titleStyles = useTitleStyles({
    fontSize: TYPOGRAPHY.fontSize.panelTitle,
  });

  // Get panel styles to match QuestionDetailsPanel and Candidate Evaluation
  const contentBoxStyles = usePanelStyles(false, false, {
    overflow: 'visible',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  });

  // Function to update width based on container size
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

  // Set up ResizeObserver with proper cleanup
  useEffect(() => {
    updateWidth(); // Initial measurement

    // Create ResizeObserver
    resizeObserverRef.current = new ResizeObserver(entries => {
      // Use requestAnimationFrame to throttle updates
      window.requestAnimationFrame(() => {
        updateWidth();
      });
    });

    // Start observing when the component mounts
    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Cleanup observer when component unmounts
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Update column count when screen size changes
  useEffect(() => {
    setColumnCount(isVeryWideScreen ? 2 : 1);
  }, [isVeryWideScreen]);

  // Group questions by skill level - memoized for performance
  const skillLevelGroups = useMemo(() => {
    if (!filteredQuestions || filteredQuestions.length === 0) {
      return {basic: [], intermediate: [], advanced: []};
    }

    const groups = {
      basic: [],
      intermediate: [],
      advanced: [],
    };

    // Fill the groups with questions
    filteredQuestions.forEach(question => {
      if (groups.hasOwnProperty(question.skillLevel)) {
        groups[question.skillLevel].push(question);
      } else {
        // Default to intermediate if unknown skill level
        groups.intermediate.push(question);
      }
    });

    // Sort questions within each group alphabetically
    Object.keys(groups).forEach(level => {
      groups[level].sort((a, b) => {
        const titleA = a.shortTitle || a.question;
        const titleB = b.shortTitle || b.question;
        return titleA.localeCompare(titleB);
      });
    });

    return groups;
  }, [filteredQuestions]);

  // Early return with memoized empty object
  if (!filteredQuestions || filteredQuestions.length === 0) {
    return null;
  }

  return (
      <Box
          ref={containerRef}
          sx={{
            ...contentBoxStyles,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
      >
        <Typography
            variant="subtitle1"
            sx={{
              ...titleStyles,
              mb: SPACING.toUnits(SPACING.sm),
              flexShrink: 0, // Don't shrink the title
            }}
        >
          Question Navigation
        </Typography>

        {/* Three-column layout for question skill levels - allows internal scrolling */}
        <Grid
            container
            spacing={SPACING.toUnits(SPACING.sm)}
            sx={{
              flexGrow: 1, // Take remaining space
              overflow: 'auto', // Enable scrolling
              pb: SPACING.toUnits(SPACING.md), // Add padding at bottom for better scrolling
              ...scrollbarStyles, // Apply modern scrollbar styles
            }}
        >
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

export default React.memo(QuestionNavigation);