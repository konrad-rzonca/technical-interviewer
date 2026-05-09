import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CategorySidebar from '../CategorySidebar';
import AnswerLevelHorizontal from '../AnswerLevelHorizontal';
import {
  categories,
  getAllQuestions,
  getCategoryById,
} from '../../data/questionLoader';
import useQuestionFilters from '../../hooks/useQuestionFilters';
import {
  buildPreparationQueue,
  findNextQueueQuestion,
  getPreparationStats,
  getQuestionPreparationStatus,
  PREPARATION_OUTCOMES,
  PREPARATION_STATUS,
  recordPreparationOutcome,
} from '../../utils/preparationProgress';
import {
  getSkillLevelStyles,
  scrollbarStyles,
  usePanelStyles,
  useTitleStyles,
} from '../../utils/styles';
import {COLORS, LAYOUT, SPACING, TYPOGRAPHY} from '../../themes/baseTheme';

const STATUS_LABELS = {
  [PREPARATION_STATUS.COMPLETED]: 'Completed',
  [PREPARATION_STATUS.FAILED]: 'Failed',
  [PREPARATION_STATUS.DUE]: 'Due',
  [PREPARATION_STATUS.IN_PROGRESS]: 'Learning',
  [PREPARATION_STATUS.UNSEEN]: 'New',
};

const STATUS_COLORS = {
  [PREPARATION_STATUS.COMPLETED]: 'success',
  [PREPARATION_STATUS.FAILED]: 'error',
  [PREPARATION_STATUS.DUE]: 'warning',
  [PREPARATION_STATUS.IN_PROGRESS]: 'primary',
  [PREPARATION_STATUS.UNSEEN]: 'default',
};

const StatBlock = ({label, value}) => (
    <Box sx={{
      minWidth: 88,
      px: SPACING.toUnits(SPACING.md),
      py: SPACING.toUnits(SPACING.sm),
      border: `1px solid ${COLORS.grey[200]}`,
      borderRadius: 1,
      bgcolor: COLORS.background.paper,
    }}
         aria-label={`${label} ${value}`}>
      <Typography variant="caption" sx={{
        color: COLORS.text.secondary,
        fontSize: TYPOGRAPHY.fontSize.caption,
      }}>
        {label}
      </Typography>
      <Typography variant="subtitle1" sx={{
        fontWeight: TYPOGRAPHY.fontWeight.semiBold,
        lineHeight: 1.2,
      }}>
        {value}
      </Typography>
    </Box>
);

const PreparationCategoryProgress = ({allQuestions, progressMap}) => {
  const titleStyles = useTitleStyles({
    fontSize: TYPOGRAPHY.fontSize.h5,
    mb: SPACING.toUnits(SPACING.sm),
  });

  return (
      <Box sx={{
        px: SPACING.toUnits(SPACING.md),
        pt: SPACING.toUnits(SPACING.md),
        pb: SPACING.toUnits(SPACING.sm),
        borderBottom: `1px solid ${COLORS.grey[200]}`,
      }}>
        <Typography variant="subtitle2" sx={titleStyles}>
          Preparation Progress
        </Typography>

        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.toUnits(SPACING.sm),
        }}>
          {categories.map(category => {
            const categoryQuestions = allQuestions.filter(question =>
                question.categoryId === category.id);
            const stats = getPreparationStats(categoryQuestions, progressMap);
            const value = stats.total > 0
                ? Math.round((stats.completed / stats.total) * 100)
                : 0;

            return (
                <Box key={category.id}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: SPACING.toUnits(SPACING.sm),
                    mb: SPACING.toUnits(SPACING.xxs),
                  }}>
                    <Typography variant="caption" sx={{
                      color: COLORS.text.primary,
                      fontSize: TYPOGRAPHY.fontSize.caption,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {category.name}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: COLORS.text.secondary,
                      fontSize: TYPOGRAPHY.fontSize.caption,
                      flexShrink: 0,
                    }}>
                      {stats.completed}/{stats.total}
                    </Typography>
                  </Box>
                  <LinearProgress
                      variant="determinate"
                      value={value}
                      sx={{
                        height: 5,
                        borderRadius: 1,
                        bgcolor: COLORS.grey[100],
                      }}
                  />
                </Box>
            );
          })}
        </Box>
      </Box>
  );
};

const QueuePreview = ({
  queueItems,
  currentQuestionId,
  onQuestionSelect,
}) => (
    <Box sx={{
      mt: SPACING.toUnits(SPACING.lg),
      pt: SPACING.toUnits(SPACING.md),
      borderTop: `1px solid ${COLORS.grey[200]}`,
    }}>
      <Typography variant="subtitle2" sx={{
        mb: SPACING.toUnits(SPACING.sm),
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      }}>
        Queue
      </Typography>

      {queueItems.length === 0 ? (
          <Typography variant="body2" sx={{color: COLORS.text.secondary}}>
            No due questions in this filter.
          </Typography>
      ) : (
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {xs: '1fr', lg: '1fr 1fr'},
            gap: SPACING.toUnits(SPACING.sm),
            maxHeight: 220,
            overflow: 'auto',
            ...scrollbarStyles,
          }}>
            {queueItems.slice(0, 12).map(({question, status}) => {
              const levelStyles = getSkillLevelStyles(question.skillLevel);
              const isSelected = currentQuestionId === question.id;

              return (
                  <Box
                      key={question.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => onQuestionSelect(question)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          onQuestionSelect(question);
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        p: SPACING.toUnits(SPACING.sm),
                        borderRadius: 1,
                        border: isSelected
                            ? `2px solid ${levelStyles.main}70`
                            : `1px solid ${COLORS.grey[200]}`,
                        borderLeft: `4px solid ${levelStyles.main}`,
                        bgcolor: isSelected
                            ? `${levelStyles.main}12`
                            : COLORS.background.paper,
                        minHeight: 56,
                        '&:hover': {
                          bgcolor: `${levelStyles.main}10`,
                        },
                      }}
                  >
                    <Typography variant="body2" sx={{
                      fontWeight: isSelected
                          ? TYPOGRAPHY.fontWeight.semiBold
                          : TYPOGRAPHY.fontWeight.regular,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {question.shortTitle || question.question}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: COLORS.text.secondary,
                      fontSize: TYPOGRAPHY.fontSize.caption,
                    }}>
                      {STATUS_LABELS[status]} - {question.subcategoryName}
                    </Typography>
                  </Box>
              );
            })}
          </Box>
      )}
    </Box>
);

const PreparationPanel = ({
  preparationState,
  updatePreparationState,
  onClearPreparationState,
  selectedCategory = categories[0]?.id || '',
  onCategorySelect = () => {},
}) => {
  const progressMap = preparationState?.progressMap || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const panelStyles = usePanelStyles(false, true);
  const titleStyles = useTitleStyles();
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  const allQuestions = useMemo(() => getAllQuestions(), []);

  const questionFilters = useQuestionFilters({
    selectedCategory,
    onCategorySelect,
  });
  const {
    activeCategories,
    availableSets,
    expandedCategory,
    questions,
    selectedSets,
    selectedSubcategories,
    subcategoryFilter,
    handleCategorySelect,
    handleDeselectAllSets,
    handleDeselectAllSubcategories,
    handleSelectAllSets,
    handleSelectAllSubcategories,
    handleSetToggle,
    handleSubcategorySelect,
    handleSubcategoryToggle,
  } = questionFilters;

  const queueItems = useMemo(() => buildPreparationQueue(
      questions,
      progressMap,
  ), [progressMap, questions]);

  const stats = useMemo(() => getPreparationStats(
      questions,
      progressMap,
  ), [progressMap, questions]);

  const currentQuestion = useMemo(() => {
    if (!currentQuestionId) return null;
    return questions.find(question => question.id === currentQuestionId) ||
        null;
  }, [currentQuestionId, questions]);

  const currentStatus = currentQuestion
      ? getQuestionPreparationStatus(currentQuestion.id, progressMap)
      : null;

  useEffect(() => {
    if (queueItems.length === 0) {
      setCurrentQuestionId(null);
      setAnswerRevealed(false);
      return;
    }

    const hasCurrentQuestion = currentQuestionId &&
        queueItems.some(item => item.question.id === currentQuestionId);

    if (!hasCurrentQuestion) {
      setCurrentQuestionId(queueItems[0].question.id);
      setAnswerRevealed(false);
    }
  }, [currentQuestionId, queueItems]);

  const handleQuestionSelect = useCallback(question => {
    setCurrentQuestionId(question.id);
    setAnswerRevealed(false);
  }, []);

  const handleOutcome = useCallback(outcome => {
    if (!currentQuestion) return;

    const now = new Date();
    const nextProgressMap = recordPreparationOutcome(
        progressMap,
        currentQuestion.id,
        outcome,
        {now},
    );
    const nextQueue = buildPreparationQueue(
        questions,
        nextProgressMap,
        {now},
    );
    const nextQuestion = findNextQueueQuestion(nextQueue, currentQuestion.id);

    updatePreparationState({progressMap: nextProgressMap});
    setCurrentQuestionId(nextQuestion?.id || null);
    setAnswerRevealed(false);
  }, [currentQuestion, progressMap, questions, updatePreparationState]);

  useEffect(() => {
    const handleKeyDown = event => {
      const tagName = event.target?.tagName?.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea') {
        return;
      }

      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        handleOutcome(PREPARATION_OUTCOMES.FAIL);
      } else if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        setAnswerRevealed(true);
      } else if (answerRevealed && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handleOutcome(PREPARATION_OUTCOMES.SUCCESS);
      } else if (answerRevealed && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        handleOutcome(PREPARATION_OUTCOMES.EASY);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [answerRevealed, handleOutcome]);

  const handleClearProgress = () => {
    if (window.confirm('Clear all preparation progress?')) {
      onClearPreparationState();
      setCurrentQuestionId(null);
      setAnswerRevealed(false);
    }
  };

  const categoryName = currentQuestion
      ? getCategoryById(currentQuestion.categoryId)?.name
      : null;

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: {xs: '600px', sm: '700px', md: '800px'},
      }}>
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: {xs: 'column', md: 'row'},
          gap: SPACING.toUnits(SPACING.md),
          p: 2,
          height: {xs: 'auto', md: 'calc(100vh - 64px)'},
          overflow: {xs: 'auto', md: 'hidden'},
          maxWidth: '100vw',
          boxSizing: 'border-box',
        }}>
          <Paper
              elevation={0}
              sx={{
                ...panelStyles,
                width: {
                  xs: '100%',
                  md: leftSidebarCollapsed
                      ? LAYOUT.COLLAPSED_SIDEBAR_WIDTH
                      : LAYOUT.LEFT_SIDEBAR_WIDTH,
                },
                minWidth: {
                  xs: '100%',
                  md: leftSidebarCollapsed
                      ? LAYOUT.COLLAPSED_SIDEBAR_WIDTH
                      : LAYOUT.LEFT_SIDEBAR_WIDTH,
                },
                p: 0,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'width 0.3s ease, min-width 0.3s ease',
              }}
          >
            {!leftSidebarCollapsed && (
                <PreparationCategoryProgress
                    allQuestions={allQuestions}
                    progressMap={progressMap}
                />
            )}
            <Box sx={{flex: 1, minHeight: 0}}>
              <CategorySidebar
                  categories={activeCategories}
                  selectedCategory={selectedCategory}
                  expandedCategory={expandedCategory}
                  selectedSubcategories={selectedSubcategories}
                  subcategoryFilter={subcategoryFilter}
                  availableSets={availableSets}
                  selectedSets={selectedSets}
                  onCategorySelect={handleCategorySelect}
                  onSubcategorySelect={handleSubcategorySelect}
                  onSubcategoryToggle={handleSubcategoryToggle}
                  onSelectAllSubcategories={handleSelectAllSubcategories}
                  onDeselectAllSubcategories={handleDeselectAllSubcategories}
                  onSetToggle={handleSetToggle}
                  onSelectAllSets={handleSelectAllSets}
                  onDeselectAllSets={handleDeselectAllSets}
                  isCollapsed={leftSidebarCollapsed && !isMobile}
                  onToggle={() => setLeftSidebarCollapsed(prev => !prev)}
              />
            </Box>
          </Paper>

          <Paper
              elevation={0}
              sx={{
                ...panelStyles,
                flexGrow: 1,
                p: 3,
                overflow: 'auto',
                ...scrollbarStyles,
              }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: SPACING.toUnits(SPACING.md),
              mb: SPACING.toUnits(SPACING.lg),
            }}>
              <Box>
                <Typography variant="h5" sx={{
                  ...titleStyles,
                  mb: SPACING.toUnits(SPACING.xs),
                }}>
                  Prepare
                </Typography>
                <Typography variant="body2" sx={{
                  color: COLORS.text.secondary,
                  fontSize: TYPOGRAPHY.fontSize.body1,
                }}>
                  {categories.find(category => category.id ===
                      selectedCategory)?.name || 'All questions'}
                </Typography>
              </Box>

              <Tooltip title="Clear Preparation Progress">
                <IconButton
                    aria-label="Clear preparation progress"
                    color="error"
                    onClick={handleClearProgress}
                    sx={{borderRadius: 1}}
                >
                  <DeleteIcon/>
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: SPACING.toUnits(SPACING.sm),
              mb: SPACING.toUnits(SPACING.lg),
            }}>
              <StatBlock label="Completed" value={stats.completed}/>
              <StatBlock label="Due" value={stats.due}/>
              <StatBlock label="Failed" value={stats.failed}/>
              <StatBlock label="Learning" value={stats.inProgress}/>
              <StatBlock label="New" value={stats.unseen}/>
              <StatBlock label="Total" value={stats.total}/>
            </Box>

            {!currentQuestion ? (
                <Box sx={{
                  minHeight: 360,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${COLORS.grey[200]}`,
                  borderRadius: 1,
                  bgcolor: COLORS.background.paper,
                }}>
                  <Typography variant="body1" sx={{
                    color: COLORS.text.secondary,
                  }}>
                    No due questions in this filter.
                  </Typography>
                </Box>
            ) : (
                <Box>
                  <Box sx={{
                    p: SPACING.toUnits(SPACING.lg),
                    border: `1px solid ${COLORS.grey[200]}`,
                    borderRadius: 1,
                    bgcolor: COLORS.background.paper,
                  }}>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: SPACING.toUnits(SPACING.sm),
                      mb: SPACING.toUnits(SPACING.md),
                      flexWrap: 'wrap',
                    }}>
                      <Box sx={{
                        display: 'flex',
                        gap: SPACING.toUnits(SPACING.sm),
                        flexWrap: 'wrap',
                      }}>
                        <Chip
                            label={STATUS_LABELS[currentStatus]}
                            color={STATUS_COLORS[currentStatus]}
                            size="small"
                        />
                        <Chip
                            label={currentQuestion.skillLevel}
                            size="small"
                            sx={{
                              bgcolor: `${getSkillLevelStyles(
                                  currentQuestion.skillLevel).main}20`,
                            }}
                        />
                        {categoryName && (
                            <Chip
                                label={`${categoryName} - ${currentQuestion.subcategoryName}`}
                                size="small"
                                variant="outlined"
                            />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="h5" sx={{
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      lineHeight: 1.35,
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      my: SPACING.toUnits(SPACING.lg),
                      px: {xs: 0, md: SPACING.toUnits(SPACING.xl)},
                    }}>
                      {currentQuestion.question}
                    </Typography>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: SPACING.toUnits(SPACING.sm),
                      flexWrap: 'wrap',
                      mb: SPACING.toUnits(SPACING.lg),
                    }}>
                      <Button
                          variant="outlined"
                          color="error"
                          startIcon={<CloseIcon/>}
                          onClick={() => handleOutcome(
                              PREPARATION_OUTCOMES.FAIL)}
                      >
                        Fail
                      </Button>
                      <Button
                          variant="contained"
                          startIcon={<VisibilityIcon/>}
                          onClick={() => setAnswerRevealed(true)}
                          disabled={answerRevealed}
                      >
                        Reveal Concepts
                      </Button>
                      <Button
                          variant="outlined"
                          color="success"
                          startIcon={<CheckIcon/>}
                          onClick={() => handleOutcome(
                              PREPARATION_OUTCOMES.SUCCESS)}
                          disabled={!answerRevealed}
                      >
                        Success
                      </Button>
                      <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<DoneAllIcon/>}
                          onClick={() => handleOutcome(
                              PREPARATION_OUTCOMES.EASY)}
                          disabled={!answerRevealed}
                      >
                        Easy
                      </Button>
                    </Box>

                    {answerRevealed && (
                        <AnswerLevelHorizontal
                            answerInsights={currentQuestion.answerInsights}
                            questionId={currentQuestion.id}
                            selectedPoints={{}}
                            learningMode={false}
                            readOnly
                        />
                    )}
                  </Box>

                  <QueuePreview
                      queueItems={queueItems}
                      currentQuestionId={currentQuestion.id}
                      onQuestionSelect={handleQuestionSelect}
                  />
                </Box>
            )}
          </Paper>
        </Box>
      </Box>
  );
};

export default React.memo(PreparationPanel);
