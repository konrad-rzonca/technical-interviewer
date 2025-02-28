// src/components/RelatedQuestionsSidebar.js
import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Paper,
  Rating,
  Badge,
  useMediaQuery,
  useTheme,
  List,
  ListItem
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { SKILL_LEVELS } from '../utils/constants';

// Helper function to get color from skill level
const getColorForSkillLevel = (level) => {
  return SKILL_LEVELS[level]?.color || '#9e9e9e'; // Gray default
};

const RelatedQuestionsSidebar = ({
  relatedQuestionsList,
  gradesMap,
  onQuestionSelect,
  hideAnswered, // Prop for hiding answered questions
  isCollapsed // New prop for collapsed state
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter related questions based on hideAnswered setting
  const filteredRelatedQuestions = hideAnswered
    ? relatedQuestionsList.filter(q => !gradesMap[q.id])
    : relatedQuestionsList;

  // Sort questions by category and subcategory
  const sortedQuestions = [...filteredRelatedQuestions].sort((a, b) => {
    // First sort by category
    if (a.categoryName !== b.categoryName) {
      return a.categoryName.localeCompare(b.categoryName);
    }
    // Then by subcategory
    if (a.subcategoryName !== b.subcategoryName) {
      return a.subcategoryName.localeCompare(b.subcategoryName);
    }
    // Finally by question title
    return (a.shortTitle || a.question).localeCompare(b.shortTitle || b.question);
  });

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        border: '1px solid #cccccc',
        borderRadius: 2,
        overflow: 'auto',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        p: isCollapsed ? 1 : 3,
      }}
    >
      {!isCollapsed ? (
        // Full sidebar content
        <>
          <Typography variant="subtitle1" sx={{
            mb: 2,
            fontWeight: 500,
            fontSize: '1.35rem' // Standardized title size
          }}>
            Related Questions {filteredRelatedQuestions.length > 0 && `(${filteredRelatedQuestions.length})`}
          </Typography>

          {sortedQuestions.length > 0 ? (
            <List dense disablePadding>
              {sortedQuestions.map((relatedQ) => {
                // Determine if this question has been answered
                const isAnswered = gradesMap[relatedQ.id] !== undefined;
                // Get category info
                const categoryName = relatedQ.categoryName || '';
                // Get the color based on skill level
                const levelColor = getColorForSkillLevel(relatedQ.skillLevel);

                return (
                  <ListItem
                    key={relatedQ.id}
                    disablePadding
                    sx={{ mb: 1 }}
                  >
                    <Tooltip
                      title={
                        <Box>
                          <Typography sx={{ fontSize: '1.15rem', p: 1 }}>
                            {relatedQ.question}
                          </Typography>
                          {isAnswered && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 1 }}>
                              <Rating
                                value={gradesMap[relatedQ.id]}
                                readOnly
                                size="medium"
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
                          p: 2,
                          borderRadius: 1,
                          cursor: 'pointer',
                          position: 'relative',
                          paddingLeft: '24px',
                          width: '100%',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.04)',
                          },
                          borderLeft: `3px solid ${levelColor}`,
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
                              color: '#66bb6a'
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: '18px' }} />
                          </Box>
                        )}

                        <Typography variant="body2" sx={{
                          textAlign: 'left',
                          fontSize: '1.15rem', // Standardized question title size
                          lineHeight: 1.5,
                          fontWeight: 400,
                          mb: 0.5
                        }}>
                          {relatedQ.shortTitle || relatedQ.question.split(' ').slice(0, 5).join(' ')}
                        </Typography>

                        {/* Category indicator */}
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            fontSize: '0.95rem',
                            opacity: 0.8
                          }}
                        >
                          {categoryName} • {relatedQ.subcategoryName}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                py: 2,
                fontSize: '1.15rem' // Standardized message size
              }}
            >
              No related questions for this topic
              {hideAnswered && relatedQuestionsList.length > 0 && " (answered questions are hidden)"}
            </Typography>
          )}
        </>
      ) : (
        // Collapsed sidebar with icons only
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip title="Related Questions" placement="left">
            <Box sx={{ mb: 2, textAlign: 'center' }}>
              <LinkIcon color="primary" sx={{ fontSize: '1.6rem' }} />
            </Box>
          </Tooltip>

          <Tooltip title={`${sortedQuestions.length} Related Questions`} placement="left">
            <Badge
              badgeContent={sortedQuestions.length}
              color="primary"
              sx={{ mb: 2 }}
            >
              <QuestionAnswerIcon
                color={sortedQuestions.length === 0 ? "disabled" : "action"}
                sx={{ fontSize: '1.6rem' }}
              />
            </Badge>
          </Tooltip>
        </Box>
      )}
    </Paper>
  );
};

export default RelatedQuestionsSidebar;