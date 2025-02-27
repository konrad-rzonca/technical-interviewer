// src/components/QuestionNavigation.js
import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Divider,
  Grid,
  Paper,
  Rating
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const QuestionNavigation = ({
  filteredQuestions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  getSkillLevelColor
}) => {
  if (!filteredQuestions || filteredQuestions.length === 0) {
    return null;
  }

  // Group questions by skill level
  const skillLevelGroups = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  // Fill the groups with questions
  filteredQuestions.forEach(question => {
    if (skillLevelGroups.hasOwnProperty(question.skillLevel)) {
      skillLevelGroups[question.skillLevel].push(question);
    } else {
      // Default to intermediate if unknown skill level
      skillLevelGroups.intermediate.push(question);
    }
  });

  // Sort questions within each group alphabetically
  Object.keys(skillLevelGroups).forEach(level => {
    skillLevelGroups[level].sort((a, b) => {
      const titleA = a.shortTitle || a.question;
      const titleB = b.shortTitle || b.question;
      return titleA.localeCompare(titleB);
    });
  });

  // Define labels and colors for each skill level
  const skillLevelConfig = {
    beginner: { label: "Basic", color: '#66bb6a' },
    intermediate: { label: "Intermediate", color: '#ffca28' },
    advanced: { label: "Advanced", color: '#fb8c00' }
  };

  // Get category color
  const getCategoryColor = (categoryId) => {
    const categoryColors = {
      'core-java': '#2196f3', // blue
      'concurrency-multithreading': '#9c27b0', // purple
      'software-design': '#00bcd4', // cyan
      'databases': '#ff9800', // orange
      'frameworks': '#4caf50', // green
      'dsa': '#f44336', // red
      'engineering-practices': '#795548' // brown
    };
    return categoryColors[categoryId] || '#9e9e9e';
  };

  return (
    <Box sx={{
      mt: 4,
      overflow: 'auto',
      flexShrink: 0,
      flexGrow: 1
    }}>
      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
        Question Navigation
      </Typography>

      {/* Three-column layout for question skill levels */}
      <Grid container spacing={3}>
        {Object.keys(skillLevelGroups).map((level) => (
          <Grid item xs={12} md={4} key={level}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: `1px solid ${skillLevelConfig[level].color}30`,
                borderRadius: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: `${skillLevelConfig[level].color}05`
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 2,
                  color: skillLevelConfig[level].color,
                  fontWeight: 500,
                  borderBottom: `1px solid ${skillLevelConfig[level].color}20`,
                  pb: 1
                }}
              >
                {skillLevelConfig[level].label} ({skillLevelGroups[level].length})
              </Typography>

              {/* Scrollable container for questions */}
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                overflowY: 'auto',
                maxHeight: '400px',
                pr: 1,
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: `${skillLevelConfig[level].color}30`,
                  borderRadius: '3px',
                },
                flex: 1
              }}>
                {skillLevelGroups[level].map((question) => {
                  const isAnswered = gradesMap[question.id] !== undefined;
                  const rating = gradesMap[question.id] || 0;

                  return (
                    <Tooltip
                      key={question.id}
                      title={
                        <Box sx={{ p: 1 }}>
                          <Typography sx={{ fontSize: '1rem', mb: 1 }}>
                            {question.question}
                          </Typography>
                          {isAnswered && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Rating
                                value={rating}
                                readOnly
                                size="small"
                                sx={{ color: '#66bb6a' }}
                              />
                            </Box>
                          )}
                        </Box>
                      }
                      placement="top"
                      arrow
                    >
                      <Box
                        onClick={() => onQuestionSelect(question)}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          backgroundColor: currentQuestion && currentQuestion.id === question.id
                            ? `${skillLevelConfig[level].color}15`
                            : (isAnswered ? 'rgba(102, 187, 106, 0.05)' : 'white'),
                          border: currentQuestion && currentQuestion.id === question.id
                            ? `1px solid ${skillLevelConfig[level].color}30`
                            : (isAnswered ? '1px solid rgba(102, 187, 106, 0.2)' : '1px solid #e0e0e0'),
                          position: 'relative',
                          paddingLeft: '24px',
                          paddingRight: isAnswered ? '24px' : '8px',
                          '&:hover': {
                            backgroundColor: `${skillLevelConfig[level].color}10`,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                          }
                        }}
                      >
                        {/* Category indicator dot */}
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: getCategoryColor(question.categoryId),
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)'
                          }}
                        />

                        {/* Answered indicator */}
                        {isAnswered && (
                          <Box
                            sx={{
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#66bb6a'
                            }}
                          >
                            <CheckCircleIcon fontSize="small" style={{ fontSize: '14px' }} />
                          </Box>
                        )}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: currentQuestion && currentQuestion.id === question.id ? 500 : 400,
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          {/* Use short title if available */}
                          {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ')}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}

                {/* Show a message if no questions in this skill level */}
                {skillLevelGroups[level].length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', py: 2, textAlign: 'center' }}>
                    No {skillLevelConfig[level].label.toLowerCase()} questions available
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuestionNavigation;