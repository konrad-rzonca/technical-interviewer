// src/components/QuestionItem.js
import React, {useMemo} from 'react';
import {Box, Tooltip, Typography} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  getIndicatorColor,
  useItemTextStyles,
  useQuestionItemStyles,
} from '../utils/styles';
import {SPACING} from '../themes/baseTheme';
import {useTooltip} from '../utils/useTooltip';
import TooltipContent from './common/TooltipContent';

// Constants for styling
const DOT_SIZE = 12; // Smaller dot size for better proportions

const QuestionItem = ({
  question,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  isSmallScreen = false,
}) => {
  // Memoize derived values with clear dependencies
  const isSelected = useMemo(() =>
          currentQuestion && currentQuestion.id === question.id,
      [currentQuestion?.id, question.id],
  );

  const isAnswered = useMemo(() =>
          gradesMap && gradesMap[question.id] !== undefined,
      [gradesMap, question.id],
  );

  const rating = useMemo(() =>
          gradesMap?.[question.id] || 0,
      [gradesMap, question.id],
  );

  // Get styles from style hooks
  const itemStyles = useQuestionItemStyles(isSelected, isAnswered,
      question.skillLevel);
  const textStyles = useItemTextStyles(isSelected, isSmallScreen);

  // Memoize the indicator color
  const indicatorColor = useMemo(() =>
          getIndicatorColor(question.skillLevel),
      [question.skillLevel],
  );

  // Get tooltip props
  const tooltipProps = useTooltip('question');

  // Memoize the displayed text
  const displayText = useMemo(() =>
          question.shortTitle ||
          (question.question.split(' ').slice(0, 5).join(' ') + '...'),
      [question.shortTitle, question.question],
  );

  // Memoize the tooltip content
  const tooltipContent = useMemo(() => (
      <TooltipContent
          title={question.question}
          rating={isAnswered ? rating : undefined}
      />
  ), [question.question, isAnswered, rating]);

  return (
      <Tooltip
          {...tooltipProps}
          title={tooltipContent}
      >
        <Box
            onClick={() => onQuestionSelect(question)}
            sx={{
              ...itemStyles,
              display: 'inline-flex',
              width: '100%',
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
            px: DOT_SIZE / 8,
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
              {displayText}
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

// Custom comparison function that checks the most important props
const areEqual = (prevProps, nextProps) => {
  // Check question ID (most fundamental check)
  if (prevProps.question.id !== nextProps.question.id) {
    return false;
  }

  // Check selection state
  const prevSelected = prevProps.currentQuestion?.id === prevProps.question.id;
  const nextSelected = nextProps.currentQuestion?.id === nextProps.question.id;
  if (prevSelected !== nextSelected) {
    return false;
  }

  // Check answered status
  const prevAnswered = prevProps.gradesMap?.[prevProps.question.id];
  const nextAnswered = nextProps.gradesMap?.[nextProps.question.id];
  if (prevAnswered !== nextAnswered) {
    return false;
  }

  // Check screen size
  if (prevProps.isSmallScreen !== nextProps.isSmallScreen) {
    return false;
  }

  // If all checks pass, consider props equal
  return true;
};

export default React.memo(QuestionItem, areEqual);