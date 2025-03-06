// src/components/QuestionNavigation.js
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Box, Grid, Typography, useMediaQuery, useTheme} from '@mui/material';
import SkillLevelSection from './SkillLevelSection';
import {scrollbarStyles, usePanelStyles, useTitleStyles} from '../utils/styles';
import {LAYOUT, SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// Constants for skill levels
const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Section title as a memoized component
const SectionTitle = React.memo(({titleStyles}) => (
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
));

// Empty state component
const EmptyState = React.memo(() => null);

const QuestionNavigation = ({
  filteredQuestions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
}) => {
  const theme = useTheme();
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isVeryWideScreen = useMediaQuery(
      `(min-width:${LAYOUT.COLUMN_THRESHOLD}px)`,
  );

  // Container ref for width measurement
  const containerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [columnCount, setColumnCount] = useState(isVeryWideScreen ? 2 : 1);

  // Get styles
  const titleStyles = useTitleStyles({
    fontSize: TYPOGRAPHY.fontSize.panelTitle,
  });

  const contentBoxStyles = usePanelStyles(false, false, {
    overflow: 'visible',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  });

  // Group questions by skill level - memoized to avoid recalculation
  const skillLevelGroups = useMemo(() => {
    if (!filteredQuestions || filteredQuestions.length === 0) {
      return {
        [SKILL_LEVELS.BEGINNER]: [],
        [SKILL_LEVELS.INTERMEDIATE]: [],
        [SKILL_LEVELS.ADVANCED]: [],
      };
    }

    // Use reduce for efficient grouping
    const groups = filteredQuestions.reduce((acc, question) => {
      const level = question.skillLevel || SKILL_LEVELS.INTERMEDIATE;

      if (!acc[level]) {
        acc[level] = [];
      }

      acc[level].push(question);
      return acc;
    }, {
      [SKILL_LEVELS.BEGINNER]: [],
      [SKILL_LEVELS.INTERMEDIATE]: [],
      [SKILL_LEVELS.ADVANCED]: [],
    });

    // Sort questions alphabetically within each group
    Object.keys(groups).forEach(level => {
      if (groups[level].length > 1) {
        groups[level].sort((a, b) => {
          const titleA = a.shortTitle || a.question;
          const titleB = b.shortTitle || b.question;
          return titleA.localeCompare(titleB);
        });
      }
    });

    return groups;
  }, [filteredQuestions]);

  // Measure container width
  const updateWidth = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.offsetWidth;
    setContainerWidth(width);

    // Update column count based on width
    setColumnCount(width >= LAYOUT.COLUMN_THRESHOLD ? 2 : 1);
  }, []);

  // Set up ResizeObserver
  useEffect(() => {
    // Initial measurement
    updateWidth();

    // Create ResizeObserver
    resizeObserverRef.current = new ResizeObserver(() => {
      window.requestAnimationFrame(updateWidth);
    });

    // Start observing
    if (containerRef.current) {
      resizeObserverRef.current.observe(containerRef.current);
    }

    // Cleanup
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [updateWidth]);

  // Update columns when screen size changes
  useEffect(() => {
    setColumnCount(isVeryWideScreen ? 2 : 1);
  }, [isVeryWideScreen]);

  // Stable handler for question selection
  const handleQuestionSelect = useCallback((question) => {
    onQuestionSelect(question);
  }, [onQuestionSelect]);

  // Early return for empty state
  if (!filteredQuestions || filteredQuestions.length === 0) {
    return <EmptyState/>;
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
        <SectionTitle titleStyles={titleStyles}/>

        {/* Three-column layout for question skill levels */}
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
                    onQuestionSelect={handleQuestionSelect}
                    columnCount={columnCount}
                    isSmallScreen={isExtraSmallScreen}
                />
              </Grid>
          ))}
        </Grid>
      </Box>
  );
};

// Equality check function for React.memo
const areEqual = (prevProps, nextProps) => {
  // Check if filtered questions array reference changed
  if (prevProps.filteredQuestions !== nextProps.filteredQuestions) {
    return false;
  }

  // Check if current question changed
  if (prevProps.currentQuestion?.id !== nextProps.currentQuestion?.id) {
    return false;
  }

  // Check grades for filtered questions only
  if (prevProps.filteredQuestions === nextProps.filteredQuestions) {
    // Only check grades that could cause visual changes
    for (const question of prevProps.filteredQuestions) {
      if (prevProps.gradesMap[question.id] !==
          nextProps.gradesMap[question.id]) {
        return false;
      }
    }
  }

  // If we got here, consider props equal
  return true;
};

export default React.memo(QuestionNavigation, areEqual);