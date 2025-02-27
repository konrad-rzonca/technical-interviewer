// src/components/QuestionNavigation.js
import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Divider,
  Grid,
  Paper,
  Rating,
  useMediaQuery,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const QuestionNavigation = ({
  filteredQuestions,
  currentQuestion,
  gradesMap,
  onQuestionSelect,
  getSkillLevelColor
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up('md'));

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

  // Determine grid columns based on screen size and question count
  // This will divide questions into multiple columns if there's enough space
  const getGridColumns = (level) => {
    const questionCount = skillLevelGroups[level].length;

    if (questionCount <= 3) return 1; // Always single column for 3 or fewer questions

    if (isLargeScreen) {
      // On very large screens
      if (questionCount > 15) return 3; // 3 columns for many questions
      if (questionCount > 6) return 2; // 2 columns for medium number
      return 1; // 1 column for few questions
    } else if (isMediumScreen) {
      return questionCount > 8 ? 2 : 1; // 2 columns if more than 8 questions on medium screens
    }

    return 1; // Default to 1 column on small screens
  };

  // Get border opacity with 10% increased intensity for yellow (Intermediate)
  const getBorderOpacity = (level) => {
    // Increase yellow (Intermediate) border intensity by 10%
    if (level === 'intermediate') {
      return '55'; // 50% → 55%
    }
    return '50'; // Keep others at 50%
  };

  return (
    <Box sx={{
      mt: 0.5,
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto'
    }}>
      <Divider />

      <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, fontWeight: 500 }}>
        Question Navigation
      </Typography>

      {/* Three-column layout for question skill levels */}
      <Grid container spacing={1.5} sx={{ mt: 0.5 }}>
        {Object.keys(skillLevelGroups).map((level) => (
          <Grid item xs={12} md={4} key={level}>
            <Paper
              elevation={0}
              sx={{
                p: 1,
                border: `1px solid ${skillLevelConfig[level].color}${getBorderOpacity(level)}`,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: `${skillLevelConfig[level].color}05`,
                height: 'auto'
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  mb: 0.5,
                  color: skillLevelConfig[level].color,
                  fontWeight: 500,
                  textAlign: 'center',
                  pb: 0.5
                  // Removed borderBottom
                }}
              >
                {skillLevelConfig[level].label} ({skillLevelGroups[level].length})
              </Typography>

              {/* Scrollable container with adaptive multi-column grid */}
              <Box sx={{
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: `${skillLevelConfig[level].color}${getBorderOpacity(level)}`,
                  borderRadius: '3px',
                },
                flexGrow: 1,
                p: 0.5 // Add small padding around the grid
              }}>
                {/* Nested grid for multiple columns */}
                <Grid container spacing={0.5} columns={getGridColumns(level)}>
                  {skillLevelGroups[level].map((question) => {
                    const isAnswered = gradesMap[question.id] !== undefined;
                    const rating = gradesMap[question.id] || 0;

                    return (
                      <Grid item xs={1} key={question.id}>
                        <Tooltip
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
                              p: 1,
                              borderRadius: 1,
                              cursor: 'pointer',
                              backgroundColor: currentQuestion && currentQuestion.id === question.id
                                ? `${skillLevelConfig[level].color}15`
                                : (isAnswered ? 'rgba(102, 187, 106, 0.06)'
                                  : 'white'),
                              border: currentQuestion && currentQuestion.id === question.id
                                ? `1px solid ${skillLevelConfig[level].color}${getBorderOpacity(level)}`
                                : (isAnswered ? '1px solid rgba(102, 187, 106, 0.20)'
                                  : '1px solid #e0e0e0'),
                              position: 'relative',
                              paddingLeft: '24px',
                              paddingRight: isAnswered ? '24px' : '8px',
                              '&:hover': {
                                backgroundColor: `${skillLevelConfig[level].color}10`,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                              },
                              minHeight: '36px', // Ensure minimum height for small content
                              mb: 0.5, // Small margin between items
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {/* Skill level indicator dot */}
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: getSkillLevelColor(question.skillLevel),
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
                                width: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap' // Prevent wrapping in multi-column layout
                              }}
                            >
                              {/* Use short title if available */}
                              {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ')}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Show a message if no questions in this skill level */}
                {skillLevelGroups[level].length === 0 && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', py: 1, textAlign: 'center' }}>
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