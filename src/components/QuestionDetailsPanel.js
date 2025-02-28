// src/components/QuestionDetailsPanel.js
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

const QuestionDetailsPanel = ({
  currentQuestion,
  notesMap,
  gradesMap,
  learningMode,
  onNotesChange,
  onGradeChange,
  onNavigateQuestion
}) => {
  if (!currentQuestion) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 300
      }}>
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.15rem' }}>
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
      <Box sx={{
        mb: 0.5,
        overflow: 'visible',
        flexShrink: 0
      }}>
        <Typography variant="subtitle1" sx={{
          mb: 1,
          fontWeight: 500,
          fontSize: '1.35rem' // Standardized title size
        }}>
          Question Details
        </Typography>

        {/* Question header with navigation and full question - with more subtle box */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            p: 2,
            border: '1px solid rgba(0, 0, 0, 0.04)', // Even more subtle border
            borderRadius: 1.5,
            backgroundColor: 'rgba(0, 0, 0, 0.005)' // Barely visible background
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
              fontWeight: 500,
              fontSize: '1.3rem', // Standardized title size
              lineHeight: 1.4,
              py: 0.5
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
        overflow: 'visible',
        flexShrink: 0,
        height: 'auto',
        mt: 2
      }}>
        <Typography variant="subtitle1" sx={{
          mb: 1,
          fontWeight: 500,
          fontSize: '1.35rem' // Standardized title size
        }}>
          Candidate Evaluation
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{
            mr: 2,
            color: 'text.secondary',
            fontSize: '1.15rem' // Standardized text size
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
          sx={{ mb: 1 }}
          InputProps={{
            style: {
              fontSize: '1.15rem' // Standardized text size
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default QuestionDetailsPanel;