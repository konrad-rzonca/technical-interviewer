// src/components/QuestionDetail.js
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import AnswerLevels from './AnswerLevels';
import RelatedQuestions from './RelatedQuestions';

const QuestionDetail = ({ question }) => {
  if (!question) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1">
          No question selected. Please choose a question from the list.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Question Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {question.question}
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 2 }}>
          <Chip 
            label={question.category} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={question.subcategory} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)} 
            variant="outlined" 
          />
          {question.tags && question.tags.map((tag) => (
            <Chip key={tag} label={tag} size="small" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Answer Levels */}
      <Typography variant="h6" gutterBottom>
        Answer Guide
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <AnswerLevels 
          answerLevels={question.answerLevels} 
        />
      </Paper>

      {/* Related Questions */}
      {question.relatedQuestions && question.relatedQuestions.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Related Questions
          </Typography>
          <RelatedQuestions 
            relatedQuestionIds={question.relatedQuestions} 
          />
        </>
      )}
    </Box>
  );
};

export default QuestionDetail;