// src/components/SkillLevelSection.js
import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import QuestionItem from './QuestionItem';
import { SKILL_LEVELS } from '../utils/constants';

// Section header styling
const sectionHeaderStyle = (color) => ({
  mb: 1.5,
  color: color,
  fontWeight: 500,
  textAlign: 'center',
  pb: 1,
  fontSize: '1.3rem', // Larger font for section headers
  borderBottom: `1px solid ${color}20`
});

// Skill level section styling
const skillLevelSectionStyle = (level) => {
  const color = SKILL_LEVELS[level]?.color || '#9e9e9e';
  const borderOpacity = level === 'intermediate' ? '60' : '50';

  return {
    p: 1.5, // Larger padding
    border: `1px solid ${color}${borderOpacity}`,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: `${color}10`,
    height: '100%',
    minHeight: '120px', // Taller minimum height
  };
};

const SkillLevelSection = ({
  level,
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  columnCount,
  isSmallScreen
}) => {
  const levelConfig = SKILL_LEVELS[level];

  // Early return if no config found for this level
  if (!levelConfig) return null;

  return (
    <Paper
      elevation={0}
      sx={skillLevelSectionStyle(level)}
    >
      <Typography
        variant="subtitle2"
        sx={sectionHeaderStyle(levelConfig.color)}
      >
        {levelConfig.label} ({questions.length})
      </Typography>

      <Box sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px', // Wider scrollbar
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${levelConfig.color}60`,
          borderRadius: '4px',
        },
        flexGrow: 1,
        p: 0.75, // More padding
        minHeight: '180px', // Taller minimum height
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
            No {levelConfig.label.toLowerCase()} questions available
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default React.memo(SkillLevelSection);