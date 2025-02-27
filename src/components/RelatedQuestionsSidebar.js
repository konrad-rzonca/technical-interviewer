// src/components/RelatedQuestionsSidebar.js
import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Rating
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const RelatedQuestionsSidebar = ({
  relatedQuestionsList,
  gradesMap,
  onQuestionSelect,
  getSkillLevelColor,
  hideAnswered // New prop for hiding answered questions
}) => {
  // Filter related questions based on hideAnswered setting
  const filteredRelatedQuestions = hideAnswered
    ? relatedQuestionsList.filter(q => !gradesMap[q.id])
    : relatedQuestionsList;

  return (
    <Paper
      elevation={0}
      sx={{
        width: 350,
        minWidth: 350,
        maxWidth: 350,
        ml: 2,
        p: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'auto',
        display: 'block'
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        Related Questions
      </Typography>

      {filteredRelatedQuestions.length > 0 ? (
        filteredRelatedQuestions.map((relatedQ) => {
          // Determine if this question has been answered
          const isAnswered = gradesMap[relatedQ.id] !== undefined;
          // Get category info
          const categoryName = relatedQ.categoryName || '';

          return (
            <Tooltip
              key={relatedQ.id}
              title={
                <Box>
                  <Typography sx={{ fontSize: '1rem', p: 1 }}>
                    {relatedQ.question}
                  </Typography>
                  {isAnswered && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.5 }}>
                      <Rating
                        value={gradesMap[relatedQ.id]}
                        readOnly
                        size="small"
                        sx={{ color: '#66bb6a' }}
                      />
                    </Box>
                  )}
                </Box>
              }
              placement="left"
              arrow
            >
              <Box
                onClick={() => onQuestionSelect(relatedQ)}
                sx={{
                  p: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  cursor: 'pointer',
                  position: 'relative',
                  paddingLeft: '24px',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                  },
                  borderLeft: `3px solid ${getSkillLevelColor(relatedQ.skillLevel)}`,
                  // Add subtle background if answered
                  backgroundColor: isAnswered ? 'rgba(102, 187, 106, 0.05)' : 'transparent'
                }}
              >
                {/* Answered indicator - checkmark */}
                {isAnswered && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      color: '#66bb6a'
                    }}
                  >
                    <CheckCircleIcon fontSize="small" style={{ fontSize: '14px' }} />
                  </Box>
                )}

                <Typography variant="body2" sx={{ textAlign: 'left' }}>
                  {relatedQ.shortTitle || relatedQ.question.split(' ').slice(0, 5).join(' ')}
                </Typography>

                {/* Category indicator */}
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'text.secondary',
                    fontSize: '0.7rem',
                    mt: 0.5,
                    opacity: 0.7
                  }}
                >
                  {categoryName} • {relatedQ.subcategoryName}
                </Typography>
              </Box>
            </Tooltip>
          );
        })
      ) : (
        <Typography variant="body2" color="text.secondary">
          No related questions for this topic
          {hideAnswered && relatedQuestionsList.length > 0 && " (answered questions are hidden)"}
        </Typography>
      )}
    </Paper>
  );
};

export default RelatedQuestionsSidebar;