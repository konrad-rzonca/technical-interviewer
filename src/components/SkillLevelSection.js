// src/components/SkillLevelSection.js - Refactored with optimized JSS
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import QuestionItem from './QuestionItem';
import {
  useSkillLevelSectionStyles,
  useSectionHeaderStyles,
  getSkillLevelStyles,
  globalStyles,
  withOpacity
} from '../utils/styleHooks';
import { SPACING, TYPOGRAPHY } from '../utils/theme';

const SkillLevelSection = ({
  level,
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  columnCount,
  isSmallScreen
}) => {
  // Use style hooks for consistent styling
  const sectionStyles = useSkillLevelSectionStyles(level);
  const headerStyles = useSectionHeaderStyles(level);
  const levelStyles = getSkillLevelStyles(level);

  // Get label for this level
  const levelLabels = {
    beginner: "Basic",
    intermediate: "Intermediate",
    advanced: "Advanced"
  };
  const levelLabel = levelLabels[level] || level;

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
        // Customized scrollbar styling from style hooks - pure JSS approach
        ...globalStyles.scrollbar,
        // Apply skill level colors to scrollbar thumb
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: levelStyles.border,
          borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
        },
        flexGrow: 1,
        padding: SPACING.toUnits(SPACING.xs),
        minHeight: SPACING.toUnits(SPACING.xl) * 5,
      }}>
        {/* Responsive grid based on container width */}
        <Grid container spacing={SPACING.toUnits(SPACING.xs)} columns={columnCount}>
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
              fontSize: TYPOGRAPHY.fontSize.regularText
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