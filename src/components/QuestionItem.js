// src/components/QuestionItem.js - Refactored
import React from 'react';
import { Box, Typography, Tooltip, Rating } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useQuestionItemStyles,
  useItemTextStyles,
  getSkillLevelStyles,
  getIndicatorColor
} from '../utils/styleHooks';
import { COLORS, TYPOGRAPHY, SPACING } from '../utils/theme';

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

  // Get styles from style hooks
  const itemStyles = useQuestionItemStyles(isSelected, isAnswered, question.skillLevel);
  const textStyles = useItemTextStyles(isSelected, isSmallScreen);

  // Get skill level colors
  const levelStyles = getSkillLevelStyles(question.skillLevel);
  const indicatorColor = getIndicatorColor(question.skillLevel);

  return (
    <Tooltip
      title={
        <Box sx={{ p: SPACING.toUnits(SPACING.md) }}>
          <Typography sx={{ fontSize: TYPOGRAPHY.fontSize.h6, mb: SPACING.toUnits(SPACING.md) }}>
            {question.question}
          </Typography>
          {isAnswered && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Rating
                value={rating}
                readOnly
                size="large"
                sx={{ color: COLORS.success.main }}
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
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: indicatorColor,
            position: 'absolute',
            left: SPACING.toUnits(SPACING.sm),
            top: '50%',
            transform: 'translateY(-50%)'
          }}
        />

        {/* Answered indicator */}
        {isAnswered && (
          <Box
            sx={{
              position: 'absolute',
              right: SPACING.toUnits(SPACING.sm),
              top: '50%',
              transform: 'translateY(-50%)',
              color: COLORS.success.main
            }}
          >
            <CheckCircleIcon fontSize="small" style={{ fontSize: '18px' }} />
          </Box>
        )}

        <Typography
          variant="body2"
          sx={textStyles}
        >
          {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ') + '...'}
        </Typography>
      </Box>
    </Tooltip>
  );
});

export default QuestionItem;