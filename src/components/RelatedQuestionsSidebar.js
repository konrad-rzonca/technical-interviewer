// src/components/RelatedQuestionsSidebar.js - Updated with unified styles
import React, {useMemo} from 'react';
import {
  Badge,
  Box,
  List,
  ListItem,
  Paper,
  Rating,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import {
  getSkillLevelStyles,
  usePanelStyles,
  useTitleStyles,
} from '../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../utils/theme';

// Related question item component for better code organization
const RelatedQuestionItem = React.memo(({
  question,
  isAnswered,
  gradesMap,
  onQuestionSelect,
}) => {
  const levelStyles = getSkillLevelStyles(question.skillLevel);

  // Tooltip content for the question
  const tooltipContent = (
      <Box>
        <Typography sx={{
          fontSize: TYPOGRAPHY.fontSize.regularText,
          p: SPACING.toUnits(SPACING.sm),
        }}>
          {question.question}
        </Typography>
        {isAnswered && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: SPACING.toUnits(SPACING.sm),
            }}>
              <Rating
                  value={gradesMap[question.id]}
                  readOnly
                  size="medium"
                  sx={{color: COLORS.success.main}}
              />
            </Box>
        )}
      </Box>
  );

  return (
      <ListItem
          disablePadding
          sx={{mb: SPACING.toUnits(SPACING.sm)}}
      >
        <Tooltip
            title={tooltipContent}
            placement="left"
            arrow
        >
          <Box
              onClick={() => onQuestionSelect(question)}
              sx={{
                p: SPACING.toUnits(SPACING.md),
                borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
                cursor: 'pointer',
                position: 'relative',
                paddingLeft: SPACING.toUnits(SPACING.md * 1.5),
                width: '100%',
                '&:hover': {
                  backgroundColor: `${COLORS.primary.main}04`,
                },
                borderLeft: `3px solid ${levelStyles.main}`,
                backgroundColor: isAnswered
                    ? `${COLORS.success.main}05`
                    : 'transparent',
              }}
          >
            {isAnswered && (
                <Box
                    sx={{
                      position: 'absolute',
                      right: SPACING.toUnits(SPACING.sm),
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.success.main,
                    }}
                >
                  <CheckCircleIcon sx={{fontSize: '18px'}}/>
                </Box>
            )}

            <Typography variant="body2" sx={{
              textAlign: 'left',
              fontSize: TYPOGRAPHY.fontSize.itemTitle,
              lineHeight: 1.5,
              fontWeight: TYPOGRAPHY.fontWeight.regular,
              mb: SPACING.toUnits(SPACING.xs),
            }}>
              {question.shortTitle ||
                  question.question.split(' ').slice(0, 5).join(' ')}
            </Typography>

            <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: 'text.secondary',
                  fontSize: TYPOGRAPHY.fontSize.metadataText,
                  opacity: 0.8,
                }}
            >
              {question.categoryName} • {question.subcategoryName}
            </Typography>
          </Box>
        </Tooltip>
      </ListItem>
  );
});

const RelatedQuestionsSidebar = ({
  relatedQuestionsList,
  gradesMap,
  onQuestionSelect,
  hideAnswered,
  isCollapsed,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get styles from hooks
  const panelStyles = usePanelStyles(isCollapsed, false);
  const titleStyles = useTitleStyles();

  // Filter related questions based on hideAnswered setting - memoized for performance
  const filteredRelatedQuestions = useMemo(() => {
    if (hideAnswered) {
      return relatedQuestionsList.filter(q => !gradesMap[q.id]);
    }
    return relatedQuestionsList;
  }, [relatedQuestionsList, hideAnswered, gradesMap]);

  // Sort questions by category and subcategory - memoized for performance
  const sortedQuestions = useMemo(() => {
    return [...filteredRelatedQuestions].sort((a, b) => {
      // First sort by category
      if (a.categoryName !== b.categoryName) {
        return a.categoryName.localeCompare(b.categoryName);
      }
      // Then by subcategory
      if (a.subcategoryName !== b.subcategoryName) {
        return a.subcategoryName.localeCompare(b.subcategoryName);
      }
      // Finally by question title
      return (a.shortTitle || a.question).localeCompare(
          b.shortTitle || b.question);
    });
  }, [filteredRelatedQuestions]);

  return (
      <Paper
          elevation={0}
          sx={{
            ...panelStyles,
            p: isCollapsed ? SPACING.toUnits(SPACING.sm) : SPACING.toUnits(
                SPACING.panelPadding),
          }}
      >
        {!isCollapsed ? (
            // Full sidebar content
            <>
              <Typography variant="subtitle1" sx={{
                ...titleStyles,
                fontSize: TYPOGRAPHY.fontSize.panelTitle,
              }}>
                Related Questions {filteredRelatedQuestions.length > 0 &&
                  `(${filteredRelatedQuestions.length})`}
              </Typography>

              {sortedQuestions.length > 0 ? (
                  <List dense disablePadding>
                    {sortedQuestions.map((relatedQ) => (
                        <RelatedQuestionItem
                            key={relatedQ.id}
                            question={relatedQ}
                            isAnswered={gradesMap[relatedQ.id] !== undefined}
                            gradesMap={gradesMap}
                            onQuestionSelect={onQuestionSelect}
                        />
                    ))}
                  </List>
              ) : (
                  <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textAlign: 'center',
                        py: SPACING.toUnits(SPACING.md),
                        fontSize: TYPOGRAPHY.fontSize.regularText,
                      }}
                  >
                    No related questions for this topic
                    {hideAnswered && relatedQuestionsList.length > 0 &&
                        ' (answered questions are hidden)'}
                  </Typography>
              )}
            </>
        ) : (
            // Collapsed sidebar with icons only
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Tooltip title="Related Questions" placement="left">
                <Box
                    sx={{mb: SPACING.toUnits(SPACING.md), textAlign: 'center'}}>
                  <LinkIcon color="primary" sx={{fontSize: '1.6rem'}}/>
                </Box>
              </Tooltip>

              <Tooltip title={`${sortedQuestions.length} Related Questions`}
                       placement="left">
                <Badge
                    badgeContent={sortedQuestions.length}
                    color="primary"
                    sx={{mb: SPACING.toUnits(SPACING.md)}}
                >
                  <QuestionAnswerIcon
                      color={sortedQuestions.length === 0
                          ? 'disabled'
                          : 'action'}
                      sx={{fontSize: '1.6rem'}}
                  />
                </Badge>
              </Tooltip>
            </Box>
        )}
      </Paper>
  );
};

export default React.memo(RelatedQuestionsSidebar);