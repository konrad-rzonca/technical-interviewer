// src/components/SkillLevelSection.js - Updated with unified styles
import React, {useMemo} from 'react';
import {Box, Grid, Paper, Typography} from '@mui/material';
import QuestionItem from './QuestionItem';
import {
  getSkillLevelStyles,
  scrollbarStyles,
  useSectionHeaderStyles,
  useSkillLevelSectionStyles,
} from '../utils/styles';
import {SPACING, TYPOGRAPHY} from '../utils/theme';

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

  // Get label for this level - memoized
  const levelLabel = useMemo(() => {
    const levelLabels = {
      beginner: 'Basic',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    };
    return levelLabels[level] || level;
  }, [level]);

  // Memoized scrollbar styles with level-specific colors
  const customScrollbarStyles = useMemo(() => ({
    ...scrollbarStyles,
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: levelStyles.border,
      borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
    },
  }), [levelStyles.border]);

  return (
      <Paper
          elevation={0}
          sx={sectionStyles}
      >
        <Typography
            variant="subtitle2"
            sx={headerStyles}
        >
          {levelLabel} ({questions.length})
        </Typography>

        <Box sx={{
          overflowY: 'auto',
          ...customScrollbarStyles,
          flexGrow: 1,
          padding: SPACING.toUnits(SPACING.xs),
          minHeight: SPACING.toUnits(SPACING.xl) * 5,
        }}>
          {/* Responsive grid based on container width */}
          <Grid container spacing={SPACING.toUnits(SPACING.xs)}
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