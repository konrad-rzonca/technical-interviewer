// src/components/QuestionNavigation.js - with improved column splitting
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Tooltip,
  Divider,
  Grid,
  Paper,
  Rating,
  useTheme,
  useMediaQuery
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
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Container ref to measure available width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  // Default to 2 columns for better UX
  const [columnCount, setColumnCount] = useState(2);

  // IMPORTANT: Move utility functions outside of render to prevent hooks issues
  const getBorderOpacity = (level) => {
    if (level === 'intermediate') {
      return '55'; // 50% → 55%
    }
    return '50'; // Keep others at 50%
  };

  const getDotColor = (level) => {
    if (level === 'intermediate') {
      return '#ffe082'; // Less intense yellow for intermediate dots
    }
    return getSkillLevelColor(level);
  };

  // ResizeObserver for content-aware layout
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);


        if (width >= 1200) {  // Minimum to look well on smaller screens
          setColumnCount(2);
        } else {
          setColumnCount(1);
        }
      }
    };

    // Initial measurement
    updateWidth();

    // Create ResizeObserver
    const resizeObserver = new ResizeObserver(entries => {
      // Debounce resize events to avoid loops
      window.requestAnimationFrame(() => {
        updateWidth();
      });
    });

    // Observe the container
    resizeObserver.observe(containerRef.current);

    return () => {
      // Clean up observer when component unmounts
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Early return with hooks already called
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
    intermediate: { label: "Intermediate", color: '#ffb300' },
    advanced: { label: "Advanced", color: '#fb8c00' }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        mt: 0.5,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
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
                height: '100%',
                minHeight: '100px',
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
                }}
              >
                {skillLevelConfig[level].label} ({skillLevelGroups[level].length})
              </Typography>

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
                p: 0.5,
                minHeight: '150px',
              }}>
                {/* FORCED 2 COLUMNS FOR ALL CATEGORIES */}
                <Grid container spacing={0.5} columns={columnCount}>
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
                              minHeight: '36px',
                              mb: 0.5,
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
                                backgroundColor: getDotColor(question.skillLevel),
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
                                whiteSpace: 'nowrap',
                                fontSize: isExtraSmallScreen ? '0.8rem' : '0.875rem',
                                paddingRight: '2px'
                              }}
                            >
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