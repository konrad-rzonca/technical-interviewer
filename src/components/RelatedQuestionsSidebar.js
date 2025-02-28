// src/components/RelatedQuestionsSidebar.js - Refactored version
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
import {
  usePanelStyles,
  useTitleStyles,
  getSkillLevelStyles
} from '../utils/styleHooks';
import { TYPOGRAPHY, SPACING, COLORS } from '../utils/theme';

const RelatedQuestionsSidebar = ({
  relatedQuestionsList,
  gradesMap,
  onQuestionSelect,
  hideAnswered,
  isCollapsed
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get styles from hooks
  const panelStyles = usePanelStyles(isCollapsed);
  const titleStyles = useTitleStyles();

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
        ...panelStyles,
        p: isCollapsed ? SPACING.toUnits(SPACING.sm) : SPACING.toUnits(SPACING.panelPadding),
      }}
    >
      {!isCollapsed ? (
        // Full sidebar content
        <>
          <Typography variant="subtitle1" sx={{
            ...titleStyles,
            fontSize: TYPOGRAPHY.fontSize.panelTitle
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
                // Get skill level styles
                const levelStyles = getSkillLevelStyles(relatedQ.skillLevel);

                return (
                  <ListItem
                    key={relatedQ.id}
                    disablePadding
                    sx={{ mb: SPACING.toUnits(SPACING.sm) }}
                  >
                    <Tooltip
                      title={
                        <Box>
                          <Typography sx={{ fontSize: TYPOGRAPHY.fontSize.regularText, p: SPACING.toUnits(SPACING.sm) }}>
                            {relatedQ.question}
                          </Typography>
                          {isAnswered && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: SPACING.toUnits(SPACING.sm) }}>
                              <Rating
                                value={gradesMap[relatedQ.id]}
                                readOnly
                                size="medium"
                                sx={{ color: COLORS.success.main }}
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
                          backgroundColor: isAnswered ? `${COLORS.success.main}05` : 'transparent'
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
                              color: COLORS.success.main
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: '18px' }} />
                          </Box>
                        )}

                        <Typography variant="body2" sx={{
                          textAlign: 'left',
                          fontSize: TYPOGRAPHY.fontSize.itemTitle,
                          lineHeight: 1.5,
                          fontWeight: TYPOGRAPHY.fontWeight.regular,
                          mb: SPACING.toUnits(SPACING.xs)
                        }}>
                          {relatedQ.shortTitle || relatedQ.question.split(' ').slice(0, 5).join(' ')}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: 'text.secondary',
                            fontSize: TYPOGRAPHY.fontSize.metadataText,
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
                py: SPACING.toUnits(SPACING.md),
                fontSize: TYPOGRAPHY.fontSize.regularText
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
            <Box sx={{ mb: SPACING.toUnits(SPACING.md), textAlign: 'center' }}>
              <LinkIcon color="primary" sx={{ fontSize: '1.6rem' }} />
            </Box>
          </Tooltip>

          <Tooltip title={`${sortedQuestions.length} Related Questions`} placement="left">
            <Badge
              badgeContent={sortedQuestions.length}
              color="primary"
              sx={{ mb: SPACING.toUnits(SPACING.md) }}
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