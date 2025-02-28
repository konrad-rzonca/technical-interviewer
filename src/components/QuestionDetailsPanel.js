// src/components/QuestionDetailsPanel.js - Refactored version
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Rating,
  Divider,
  IconButton,
  Paper
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AnswerLevelHorizontal from './AnswerLevelHorizontal';
import { useTitleStyles, usePanelStyles } from '../utils/styleHooks';
import { TYPOGRAPHY, SPACING, COLORS } from '../utils/theme';

const QuestionDetailsPanel = ({
  currentQuestion,
  notesMap,
  gradesMap,
  learningMode,
  onNotesChange,
  onGradeChange,
  onNavigateQuestion
}) => {
  // Get styles from style hooks
  const titleStyles = useTitleStyles();
  const contentBoxStyles = usePanelStyles(false, false, { overflow: 'visible', flexShrink: 0 });

  if (!currentQuestion) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
      }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{
          fontSize: TYPOGRAPHY.fontSize.regularText
        }}>
          Select a question to begin
        </Typography>
      </Box>
    );
  }

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
      overflow: 'visible'
    }}>
      {/* Question Details Section */}
      <Box sx={contentBoxStyles}>
        <Typography variant="subtitle1" sx={{
          ...titleStyles,
          fontSize: TYPOGRAPHY.fontSize.panelTitle,
        }}>
          Question Details
        </Typography>

        {/* Question header with navigation and full question */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: SPACING.toUnits(SPACING.md),
            p: SPACING.toUnits(SPACING.md),
            border: '1px solid rgba(0, 0, 0, 0.04)',
            borderRadius: SPACING.toUnits(SPACING.borderRadius),
            backgroundColor: 'rgba(0, 0, 0, 0.005)'
          }}
        >
          <IconButton
            size="medium"
            onClick={() => onNavigateQuestion('prev')}
          >
            <KeyboardArrowLeftIcon fontSize="medium" />
          </IconButton>

          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              flexGrow: 1,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              fontSize: TYPOGRAPHY.fontSize.questionTitle,
              lineHeight: 1.4,
              py: SPACING.toUnits(SPACING.xs)
            }}
          >
            {currentQuestion.question}
          </Typography>

          <IconButton
            size="medium"
            onClick={() => onNavigateQuestion('next')}
          >
            <KeyboardArrowRightIcon fontSize="medium" />
          </IconButton>
        </Paper>

        {/* Answer insights horizontal layout */}
        <AnswerLevelHorizontal
          answerInsights={currentQuestion.answerInsights}
          learningMode={learningMode}
        />
      </Box>

      <Divider />

      {/* Candidate Evaluation */}
      <Box sx={{
        ...contentBoxStyles,
        mt: SPACING.toUnits(SPACING.md)
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
          mb: SPACING.toUnits(SPACING.md)
        }}>
          <Typography variant="body2" sx={{
            mr: SPACING.toUnits(SPACING.md),
            color: 'text.secondary',
            fontSize: TYPOGRAPHY.fontSize.regularText
          }}>
            Rating:
          </Typography>
          <Rating
            name={`grade-${currentQuestion.id}`}
            value={gradesMap[currentQuestion.id] || 0}
            onChange={handleGradeChange}
            size="large"
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
          sx={{ mb: SPACING.toUnits(SPACING.sm) }}
          InputProps={{
            style: {
              fontSize: TYPOGRAPHY.fontSize.regularText
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default QuestionDetailsPanel;