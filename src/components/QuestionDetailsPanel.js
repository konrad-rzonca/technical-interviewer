// src/components/QuestionDetailsPanel.js
import React, {useMemo} from 'react';
import {
  Box,
  IconButton,
  Paper,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AnswerLevelHorizontal from './AnswerLevelHorizontal';
import {usePanelStyles, useTitleStyles} from '../utils/styles';
import {SPACING, TYPOGRAPHY} from '../themes/baseTheme';

// Constants for styling
const QUESTION_PANEL_STYLES = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: SPACING.toUnits(SPACING.md),
  p: SPACING.toUnits(SPACING.lg), // Increased padding
  border: '1px solid rgba(0, 0, 0, 0.04)',
  borderRadius: SPACING.toUnits(SPACING.borderRadius),
  backgroundColor: 'rgba(0, 0, 0, 0.01)', // Slightly darker for better contrast
};

const QUESTION_TEXT_STYLES = {
  textAlign: 'center',
  flexGrow: 1,
  fontWeight: TYPOGRAPHY.fontWeight.medium,
  fontSize: '1.25rem', // Significantly larger question font
  lineHeight: 0.6,
  py: SPACING.toUnits(SPACING.md), // More vertical padding
  px: SPACING.toUnits(SPACING.md), // Horizontal padding
};

const QuestionDetailsPanel = ({
  currentQuestion,
  notesMap,
  gradesMap,
  selectedAnswerPointsMap,
  onAnswerPointSelect, // New prop for handling answer point selection
  learningMode,
  onNotesChange,
  onGradeChange,
  onNavigateQuestion,
}) => {
  // Get styles from style hooks
  const titleStyles = useTitleStyles();
  const contentBoxStyles = usePanelStyles(false, false,
      {overflow: 'visible', flexShrink: 0});

  // Memoize the empty state to avoid unnecessary re-renders
  const emptyStateContent = useMemo(() => (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300,
      }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{
          fontSize: TYPOGRAPHY.fontSize.regularText,
        }}>
          Select a question to begin
        </Typography>
      </Box>
  ), []);

  if (!currentQuestion) {
    return emptyStateContent;
  }

  // Get the selected points for the current question
  const selectedPoints = selectedAnswerPointsMap[currentQuestion.id] || {};

  // Handle point selection
  const handlePointSelect = (categoryIndex, pointIndex) => {
    const key = `${categoryIndex}-${pointIndex}`;
    if (typeof onAnswerPointSelect === 'function') {
      onAnswerPointSelect(currentQuestion.id, key);
    } else {
      console.error('onAnswerPointSelect is not a function',
          onAnswerPointSelect);
    }
  };

  // Handle notes change
  const handleNotesChange = (event) => {
    onNotesChange(currentQuestion.id, event.target.value);
  };

  // Handle grade change
  const handleGradeChange = (event, newValue) => {
    onGradeChange(currentQuestion.id, newValue);
  };

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        overflow: 'visible',
      }}>
        {/* Question Details Section */}
        <Box sx={contentBoxStyles}>
          <Typography variant="subtitle1" sx={{
            ...titleStyles,
            fontSize: TYPOGRAPHY.fontSize.panelTitle,
            mb: SPACING.toUnits(SPACING.md), // Added more bottom margin
          }}>
            Question Details
          </Typography>

          {/* Question header with navigation and full question */}
          <Paper
              elevation={0}
              sx={QUESTION_PANEL_STYLES}
          >
            <IconButton
                size="medium"
                onClick={() => onNavigateQuestion('prev')}
                sx={{
                  mr: SPACING.toUnits(SPACING.sm),
                  height: 48,
                  width: 48,
                }}
            >
              <KeyboardArrowLeftIcon fontSize="large"/>
            </IconButton>

            <Typography
                variant="h5"
                sx={QUESTION_TEXT_STYLES}
            >
              {currentQuestion.question}
            </Typography>

            <IconButton
                size="medium"
                onClick={() => onNavigateQuestion('next')}
                sx={{
                  ml: SPACING.toUnits(SPACING.sm),
                  height: 48,
                  width: 48,
                }}
            >
              <KeyboardArrowRightIcon fontSize="large"/>
            </IconButton>
          </Paper>

          {/* Answer insights horizontal layout - updated with selection handling */}
          <AnswerLevelHorizontal
              answerInsights={currentQuestion.answerInsights}
              questionId={currentQuestion.id}
              selectedPoints={selectedPoints}
              onPointSelect={handlePointSelect}
              learningMode={learningMode}
          />
        </Box>


        {/* Candidate Evaluation */}
        <Box sx={{
          ...contentBoxStyles,
          mt: SPACING.toUnits(SPACING.md),
        }}>
          <Typography variant="subtitle1" sx={{
            ...titleStyles,
            fontSize: TYPOGRAPHY.fontSize.panelTitle,
          }}>
            Candidate Evaluation
          </Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: SPACING.toUnits(SPACING.md),
          }}>
            <Typography variant="body2" sx={{
              mr: SPACING.toUnits(SPACING.md),
              color: 'text.secondary',
              fontSize: TYPOGRAPHY.fontSize.regularText,
            }}>
              Rating:
            </Typography>
            <Rating
                name={`grade-${currentQuestion.id}`}
                value={gradesMap[currentQuestion.id] || 0}
                onChange={handleGradeChange}
                size="medium"
            />
          </Box>

          <TextField
              placeholder="Add notes about candidate's response..."
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={notesMap[currentQuestion.id] || ''}
              onChange={handleNotesChange}
              sx={{mb: SPACING.toUnits(SPACING.sm)}}
              InputProps={{
                style: {
                  fontSize: TYPOGRAPHY.fontSize.regularText,
                },
              }}
          />
        </Box>
      </Box>
  );
};

export default React.memo(QuestionDetailsPanel);