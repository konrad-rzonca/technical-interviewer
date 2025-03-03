// src/components/QuestionItem.js
import React, {useMemo} from 'react';
import {Box, Rating, Tooltip, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  getIndicatorColor,
  useItemTextStyles,
  useQuestionItemStyles,
} from '../utils/styles';
import {SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// Constants for styling
const DOT_SIZE = 12; // Smaller dot size for better proportions
const DOT_MARGIN = 10; // Equal margin on both sides of the dot

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
      <Box sx={{p: SPACING.toUnits(SPACING.sm)}}>
        <Typography sx={{
          fontSize: TYPOGRAPHY.fontSize.h6,
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
                  sx={{color: indicatorColor}}
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
            sx={{
              ...itemStyles,
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              pl: 0,
              pt: 0,
              pb: 0,
              mb: 0,
            }}
        >
          {/* Container for dot with consistent spacing */}
          <Box sx={{
            width: DOT_MARGIN * 2 + DOT_SIZE,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}>
            {/* Skill level indicator dot - perfectly centered */}
            <Box
                sx={{
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: '50%',
                  backgroundColor: indicatorColor,
                  flexShrink: 0,
                }}
            />
          </Box>

          {/* Text with consistent spacing from dot */}
          <Box sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            pr: isAnswered ? 3 : 1, // Space for answered icon
          }}>
            <Typography
                variant="body2"
                sx={{
                  ...textStyles,
                  // Remove margin that might affect alignment
                  m: 0,
                }}
            >
              {question.shortTitle ||
                  question.question.split(' ').slice(0, 5).join(' ') + '...'}
            </Typography>
          </Box>

          {/* Answered indicator - fixed position */}
          {isAnswered && (
              <Box
                  sx={{
                    position: 'absolute',
                    right: SPACING.toUnits(SPACING.sm),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: indicatorColor,
                  }}
              >
                <CheckCircleIcon fontSize="small" style={{fontSize: '18px'}}/>
              </Box>
          )}
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