// src/components/QuestionItem.js
import React from 'react';
import { Box, Typography, Tooltip, Rating } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SKILL_LEVELS } from '../utils/constants';
import { useQuestionItemStyles, useItemTextStyles } from '../utils/useStyles';

// Helper functions for question status
const isQuestionAnswered = (questionId, gradesMap) => {
  return gradesMap && gradesMap[questionId] !== undefined;
};

const getQuestionRating = (questionId, gradesMap) => {
  return gradesMap?.[questionId] || 0;
};

// Memoized component to prevent unnecessary re-renders
const QuestionItem = React.memo(({
  question,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  isSmallScreen = false
}) => {
  const isSelected = currentQuestion && currentQuestion.id === question.id;
  const isAnswered = isQuestionAnswered(question.id, gradesMap);
  const rating = getQuestionRating(question.id, gradesMap);
  const levelColor = SKILL_LEVELS[question.skillLevel]?.color || '#9e9e9e';

  // Use the hooks to generate styles
  const itemStyles = useQuestionItemStyles(isSelected, isAnswered, levelColor);
  const textStyles = useItemTextStyles(isSelected, isSmallScreen);

  return (
    <Tooltip
      title={
        <Box sx={{ p: 1.5 }}>
          <Typography sx={{ fontSize: '1.2rem', mb: 1.5 }}>
            {question.question}
          </Typography>
          {isAnswered && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rating
                value={rating}
                readOnly
                size="large"
                sx={{ color: '#66bb6a' }}
              />
            </Box>
          )}
        </Box>
      }
      placement="top"
      arrow
    >
      <Box
        onClick={() => onQuestionSelect(question)}
        sx={itemStyles}
      >
        {/* Skill level indicator dot */}
        <Box
          sx={{
            width: 14, // Larger indicator dot
            height: 14, // Larger indicator dot
            borderRadius: '50%',
            backgroundColor: question.skillLevel === 'intermediate' ?
              '#ffe082' : levelColor, // Special color for intermediate
            position: 'absolute',
            left: 10,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Answered indicator */}
        {isAnswered && (
          <Box
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#66bb6a'
            }}
          >
            <CheckCircleIcon fontSize="small" style={{ fontSize: '18px' }} />
          </Box>
        )}

        <Typography
          variant="body2"
          sx={textStyles}
        >
          {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ')}
        </Typography>
      </Box>
    </Tooltip>
  );
});

export default QuestionItem;