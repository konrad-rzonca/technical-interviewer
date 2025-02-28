// src/components/QuestionItem.js - Optimized with unified styles
import React, {useMemo} from 'react';
import {Box, Rating, Tooltip, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  getIndicatorColor,
  useItemTextStyles,
  useQuestionItemStyles,
} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../utils/theme';

// Memoized component to prevent unnecessary re-renders
const QuestionItem = ({
  question,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  isSmallScreen = false,
}) => {
  // Memoize derived state
  const isSelected = useMemo(() =>
          currentQuestion && currentQuestion.id === question.id,
      [currentQuestion, question.id],
  );

  const isAnswered = useMemo(() =>
          gradesMap && gradesMap[question.id] !== undefined,
      [gradesMap, question.id],
  );

  const rating = useMemo(() =>
          gradesMap?.[question.id] || 0,
      [gradesMap, question.id],
  );

  // Get styles from optimized style hooks
  const itemStyles = useQuestionItemStyles(isSelected, isAnswered,
      question.skillLevel);
  const textStyles = useItemTextStyles(isSelected, isSmallScreen);

  // Get skill level colors
  const indicatorColor = useMemo(() =>
          getIndicatorColor(question.skillLevel),
      [question.skillLevel],
  );

  // Memoize the tooltip content for better performance
  const tooltipContent = useMemo(() => (
      <Box sx={{p: SPACING.toUnits(SPACING.md)}}>
        <Typography sx={{
          fontSize: TYPOGRAPHY.fontSize.h6,
          mb: SPACING.toUnits(SPACING.md),
        }}>
          {question.question}
        </Typography>
        {isAnswered && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Rating
                  value={rating}
                  readOnly
                  size="large"
                  sx={{color: COLORS.success.main}}
              />
            </Box>
        )}
      </Box>
  ), [question.question, isAnswered, rating]);

  return (
      <Tooltip
          title={tooltipContent}
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
                left: SPACING.toUnits(SPACING.lg),
                top: '50%',
                transform: 'translateY(-50%)',
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
                    color: COLORS.success.main,
                  }}
              >
                <CheckCircleIcon fontSize="small" style={{fontSize: '18px'}}/>
              </Box>
          )}

          <Typography
              variant="body2"
              sx={textStyles}
          >
            {question.shortTitle ||
                question.question.split(' ').slice(0, 5).join(' ') + '...'}
          </Typography>
        </Box>
      </Tooltip>
  );
};

// Use React.memo with custom comparison function for optimal performance
export default React.memo(QuestionItem, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
      prevProps.question.id === nextProps.question.id &&
      (prevProps.currentQuestion?.id === nextProps.currentQuestion?.id) &&
      (prevProps.gradesMap[prevProps.question.id] ===
          nextProps.gradesMap[nextProps.question.id]) &&
      prevProps.isSmallScreen === nextProps.isSmallScreen
  );
});