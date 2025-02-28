import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import VirtualizedQuestionList from './VirtualizedQuestionList';

// Memoized component for skill level groups
const SkillLevelGroup = React.memo(({
  level,
  questions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  getSkillLevelColor,
  getBorderOpacity,
  getDotColor,
  columnCount,
  isSmallScreen
}) => {
  // Define labels and colors for each skill level
  const skillLevelConfig = {
    beginner: { label: "Basic", color: '#66bb6a' },
    intermediate: { label: "Intermediate", color: '#ffb300' },
    advanced: { label: "Advanced", color: '#fb8c00' }
  };

  const levelColor = skillLevelConfig[level].color;

  // Virtualization threshold - only use virtualization for lists longer than this
  const VIRTUALIZATION_THRESHOLD = 20;
  const useVirtualization = questions.length > VIRTUALIZATION_THRESHOLD;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        border: `1px solid ${levelColor}${getBorderOpacity(level)}`,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: `${levelColor}05`,
        height: '100%',
        minHeight: '100px',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 0.5,
          color: levelColor,
          fontWeight: 500,
          textAlign: 'center',
          pb: 0.5
        }}
      >
        {skillLevelConfig[level].label} ({questions.length})
      </Typography>

      <Box sx={{
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `${levelColor}${getBorderOpacity(level)}`,
          borderRadius: '3px',
        },
        flexGrow: 1,
        p: 0.5,
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {useVirtualization ? (
          // Use virtualized list for large sets
          <VirtualizedQuestionList
            questions={questions}
            currentQuestion={currentQuestion}
            gradesMap={gradesMap}
            onQuestionSelect={onQuestionSelect}
            levelColor={levelColor}
            level={level}
            getBorderOpacity={getBorderOpacity}
            getDotColor={getDotColor}
            isSmallScreen={isSmallScreen}
          />
        ) : (
          // Use regular grid for smaller sets
          <Grid container spacing={0.5} columns={columnCount}>
            {questions.map((question) => {
              const isAnswered = gradesMap[question.id] !== undefined;
              const rating = gradesMap[question.id] || 0;
              const isSelected = currentQuestion && currentQuestion.id === question.id;

              return (
                <Grid item xs={1} key={question.id}>
                  <QuestionItem
                    question={question}
                    isAnswered={isAnswered}
                    rating={rating}
                    isSelected={isSelected}
                    levelColor={levelColor}
                    getBorderOpacity={getBorderOpacity}
                    getDotColor={getDotColor}
                    onSelect={onQuestionSelect}
                    isSmallScreen={isSmallScreen}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Show a message if no questions in this skill level */}
        {questions.length === 0 && (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 1, textAlign: 'center' }}>
            No {skillLevelConfig[level].label.toLowerCase()} questions available
          </Typography>
        )}
      </Box>
    </Paper>
  );
});

export default SkillLevelGroup;