// src/components/SkillLevelSection.js
// Update the Box with scrollable content:

import React, {useMemo} from 'react';
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

const SkillLevelSection = ({
  level,
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  columnCount,
  isSmallScreen,
}) => {
  // Use style hooks for consistent styling
  const sectionStyles = useSkillLevelSectionStyles(level);
  const headerStyles = useSectionHeaderStyles(level);
  const levelStyles = getSkillLevelStyles(level);

  // Get label for this level - using constants
  const levelLabel = useMemo(() =>
          SKILL_LEVEL_LABELS[level] || level
      , [level]);

  // Memoized scrollbar styles with level-specific colors
  const themedScrollbarStyles = useMemo(() =>
          getThemedScrollbarStyles(level)
      , [level]);

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
          {levelLabel} ({questions.length})
        </Typography>

        <Box sx={{
          overflowY: 'auto', // Enable scrolling
          ...themedScrollbarStyles, // Apply themed scrollbar styles
          flexGrow: 1, // Take remaining space
          padding: SPACING.toUnits(SPACING.xs),
        }}>
          {/* Responsive grid based on container width */}
          <Grid container spacing={SPACING.toUnits(SPACING.sm)}
                columns={columnCount}>
            {questions.map((question) => (
                <Grid item xs={1} key={question.id}>
                  <QuestionItem
                      question={question}
                      currentQuestion={currentQuestion}
                      gradesMap={gradesMap}
                      onQuestionSelect={onQuestionSelect}
                      isSmallScreen={isSmallScreen}
                  />
                </Grid>
            ))}
          </Grid>

          {/* Show a message if no questions in this skill level */}
          {questions.length === 0 && (
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
          )}
        </Box>
      </Paper>
  );
};

export default React.memo(SkillLevelSection);