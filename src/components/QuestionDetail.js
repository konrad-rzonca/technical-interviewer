// src/components/QuestionDetail.js - Refactored
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
import { SPACING, TYPOGRAPHY, COLORS } from '../utils/theme';
import { getSkillLevelStyles } from '../utils/styleHooks';

const QuestionDetail = ({ question }) => {
  if (!question) {
    return (
      <Box sx={{
        p: SPACING.toUnits(SPACING.sm),
        textAlign: 'center'
      }}>
        <Typography variant="body1" sx={{ fontSize: TYPOGRAPHY.fontSize.regularText }}>
          No question selected. Please choose a question from the list.
        </Typography>
      </Box>
    );
  }

  // Get skill level styles for this question
  const levelStyles = getSkillLevelStyles(question.skillLevel);

  return (
    <Box>
      {/* Question Header */}
      <Box sx={{ mb: SPACING.toUnits(SPACING.lg) }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: TYPOGRAPHY.fontSize.h5,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            mb: SPACING.toUnits(SPACING.xs)
          }}
        >
          {question.question}
        </Typography>

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: SPACING.toUnits(SPACING.xs),
          mt: SPACING.toUnits(SPACING.sm),
          mb: SPACING.toUnits(SPACING.sm)
        }}>
          <Chip
            label={question.category}
            color="primary"
            variant="outlined"
            sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
          />
          <Chip
            label={question.subcategory}
            color="secondary"
            variant="outlined"
            sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
          />
          <Chip
            label={question.skillLevel.charAt(0).toUpperCase() + question.skillLevel.slice(1)}
            variant="outlined"
            sx={{
              fontSize: TYPOGRAPHY.fontSize.caption,
              color: levelStyles.main,
              borderColor: levelStyles.main
            }}
          />
          {question.tags && question.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ fontSize: TYPOGRAPHY.fontSize.caption }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: SPACING.toUnits(SPACING.sm) }} />

      {/* Answer Levels */}
      <Typography
        variant="h6"
        sx={{
          fontSize: TYPOGRAPHY.fontSize.h6,
          fontWeight: TYPOGRAPHY.fontWeight.medium,
          mb: SPACING.toUnits(SPACING.sm)
        }}
      >
        Answer Guide
      </Typography>
      <Paper
        variant="outlined"
        sx={{
          p: SPACING.toUnits(SPACING.sm),
          mb: SPACING.toUnits(SPACING.lg),
          borderColor: COLORS.grey[200],
          borderRadius: SPACING.toUnits(SPACING.borderRadius)
        }}
      >
        <AnswerLevels
          answerLevels={question.answerLevels}
        />
      </Paper>

      {/* Related Questions */}
      {question.relatedQuestions && question.relatedQuestions.length > 0 && (
        <>
          <Divider sx={{ my: SPACING.toUnits(SPACING.sm) }} />
          <Typography
            variant="h6"
            sx={{
              fontSize: TYPOGRAPHY.fontSize.h6,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              mb: SPACING.toUnits(SPACING.sm)
            }}
          >
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