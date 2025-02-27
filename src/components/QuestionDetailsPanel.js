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
        <Typography variant="subtitle1" color="text.secondary">
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
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Question Details Section - Now at the top */}
      <Box sx={{ 
        mb: 4, 
        overflow: 'auto',
        flexBasis: '60%',
        flexShrink: 0,
        pr: 1
      }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
          Question Details
        </Typography>
        
        {/* Question header with navigation and full question */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <IconButton
            size="small"
            onClick={() => onNavigateQuestion('prev')}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>

          <Typography variant="h6" sx={{ textAlign: 'center', flexGrow: 1 }}>
            {currentQuestion.question}
          </Typography>

          <IconButton
            size="small"
            onClick={() => onNavigateQuestion('next')}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>

        {/* Answer insights horizontal layout */}
        <AnswerLevelHorizontal
          answerInsights={currentQuestion.answerInsights}
          learningMode={learningMode}
        />
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Candidate Evaluation - Now below question details */}
      <Box sx={{ 
        overflow: 'auto',
        flexBasis: '40%',
        flexShrink: 0,
        pr: 1
      }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
          Candidate Evaluation
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
            Rating:
          </Typography>
          <Rating
            name={`grade-${currentQuestion.id}`}
            value={gradesMap[currentQuestion.id] || 0}
            onChange={handleGradeChange}
          />
        </Box>

        <TextField
          placeholder="Add notes about candidate's response..."
          multiline
          rows={3}
          variant="outlined"
          size="small"
          fullWidth
          value={notesMap[currentQuestion.id] || ''}
          onChange={handleNotesChange}
        />
      </Box>
    </Box>
  );
};

export default QuestionDetailsPanel;