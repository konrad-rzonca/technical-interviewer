// src/components/SkillLevelSection.js
import React, {useCallback, useMemo} from 'react';
import {
  getSkillLevelStyles,
  getThemedScrollbarStyles,
  useSectionHeaderStyles,
  useSkillLevelSectionStyles,
} from '../utils/styles';
import {SKILL_LEVEL_LABELS} from '../utils/answerConstants';
import {Box, Grid, Paper, Typography} from '@mui/material';
import QuestionItem from './QuestionItem';
import {SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// Empty state message as a memoized component
const EmptyMessage = React.memo(({levelLabel}) => (
    <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          py: SPACING.toUnits(SPACING.sm),
          textAlign: 'center',
          fontSize: TYPOGRAPHY.fontSize.regularText,
        }}
    >
      No {levelLabel.toLowerCase()} questions available
    </Typography>
));

const SkillLevelSection = ({
  level,
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  columnCount,
  isSmallScreen,
}) => {
  // Memoize styles to prevent recalculation
  const sectionStyles = useSkillLevelSectionStyles(level);
  const headerStyles = useSectionHeaderStyles(level);

  // Memoize level-specific data
  const levelData = useMemo(() => ({
    levelStyles: getSkillLevelStyles(level),
    levelLabel: SKILL_LEVEL_LABELS[level] || level,
    scrollbarStyles: getThemedScrollbarStyles(level),
  }), [level]);

  // Memoize question count
  const questionCount = useMemo(() => questions.length, [questions.length]);

  // Stabilize the question selection handler
  const handleQuestionSelect = useCallback((question) => {
    onQuestionSelect(question);
  }, [onQuestionSelect]);

  return (
      <Paper
          elevation={0}
          sx={{
            ...sectionStyles,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: '200px', // Ensure visible height
          }}
      >
        <Typography
            variant="subtitle2"
            sx={{
              ...headerStyles,
              flexShrink: 0, // Don't shrink the header
            }}
        >
          {levelData.levelLabel} ({questionCount})
        </Typography>

        <Box sx={{
          overflowY: 'auto', // Enable scrolling
          ...levelData.scrollbarStyles, // Apply themed scrollbar styles
          flexGrow: 1, // Take remaining space
          padding: SPACING.toUnits(SPACING.xs),
        }}>
          {/* Responsive grid based on container width */}
          <Grid
              container
              spacing={SPACING.toUnits(SPACING.sm)}
              columns={columnCount}
          >
            {questions.map((question) => (
                <Grid item xs={1} key={question.id}>
                  <QuestionItem
                      question={question}
                      currentQuestion={currentQuestion}
                      gradesMap={gradesMap}
                      onQuestionSelect={handleQuestionSelect}
                      isSmallScreen={isSmallScreen}
                  />
                </Grid>
            ))}
          </Grid>

          {/* Show a message if no questions in this skill level */}
          {questionCount === 0 && (
              <EmptyMessage levelLabel={levelData.levelLabel}/>
          )}
        </Box>
      </Paper>
  );
};

// Custom comparison function for better performance
const areEqual = (prevProps, nextProps) => {
  // Different length means different questions
  if (prevProps.questions.length !== nextProps.questions.length) {
    return false;
  }

  // Check if level has changed
  if (prevProps.level !== nextProps.level) {
    return false;
  }

  // Check if selected question changed
  if (prevProps.currentQuestion?.id !== nextProps.currentQuestion?.id) {
    return false;
  }

  // Check if any question IDs changed (added/removed questions)
  for (let i = 0; i < prevProps.questions.length; i++) {
    if (prevProps.questions[i].id !== nextProps.questions[i].id) {
      return false;
    }
  }

  // Only check grades that matter for this section's questions
  const prevGrades = prevProps.gradesMap;
  const nextGrades = nextProps.gradesMap;
  for (const question of prevProps.questions) {
    if (prevGrades[question.id] !== nextGrades[question.id]) {
      return false;
    }
  }

  // Check layout props
  if (
      prevProps.columnCount !== nextProps.columnCount ||
      prevProps.isSmallScreen !== nextProps.isSmallScreen
  ) {
    return false;
  }

  // If all checks pass, props are equal
  return true;
};

export default React.memo(SkillLevelSection, areEqual);