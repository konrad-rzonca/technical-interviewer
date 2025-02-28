// src/components/SkillLevelSection.js
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import QuestionItem from './QuestionItem';
import {
  useSkillLevelSectionStyles,
  useSectionHeaderStyles,
  getSkillLevelStyles
} from '../utils/styleHooks';
import { globalStyles } from '../utils/styleHooks';

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
        // Customized scrollbar styling from style hooks
        ...globalStyles.scrollbar,
        // Apply skill level colors to scrollbar thumb
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${levelStyles.border}`,
          borderRadius: '4px',
        },
        flexGrow: 1,
        padding: 0.75,
        minHeight: '180px',
      }}>
        {/* Responsive grid based on container width */}
        <Grid container spacing={1} columns={columnCount}>
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
              py: 2,
              textAlign: 'center',
              fontSize: '1.15rem'
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