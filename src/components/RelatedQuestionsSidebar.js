// src/components/RelatedQuestionsSidebar.js
import React, {useMemo} from 'react';
import {
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LinkIcon from '@mui/icons-material/Link';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  getSkillLevelStyles,
  scrollbarStyles,
  useTitleStyles,
} from '../utils/styles';
import {COLORS, TYPOGRAPHY} from '../themes/baseTheme';
import {useTooltip} from '../utils/useTooltip';
import TooltipContent from './common/TooltipContent';

// Related question item component for better code organization
const RelatedQuestionItem = React.memo(({
  question,
  isAnswered,
  gradesMap,
  onQuestionSelect,
}) => {
  const levelStyles = getSkillLevelStyles(question.skillLevel);

  // Get standardized tooltip props
  const tooltipProps = useTooltip('related');

  // Tooltip content for the question - removed category/subcategory info
  const tooltipContent = useMemo(() => (
      <TooltipContent
          title={question.question}
          rating={isAnswered ? gradesMap[question.id] : undefined}
      />
  ), [question.question, isAnswered, gradesMap]);

  return (
      <ListItem
          disablePadding
          sx={{mb: 0.75}} // Reduced margin
      >
        <Tooltip
            {...tooltipProps}
            title={tooltipContent}
        >
          <Box
              onClick={() => onQuestionSelect(question)}
              sx={{
                p: 1.5, // Reduced padding
                borderRadius: 1,
                cursor: 'pointer',
                position: 'relative',
                paddingLeft: 2,
                width: '100%',
                '&:hover': {
                  backgroundColor: `${COLORS.primary.main}04`,
                },
                borderLeft: `3px solid ${levelStyles.main}`,
                backgroundColor: isAnswered
                    ? `${COLORS.basic.main}05`
                    : 'transparent',
              }}
          >
            {isAnswered && (
                <Box
                    sx={{
                      position: 'absolute',
                      right: 0.75, // Reduced spacing
                      top: '50%',
                      transform: 'translateY(-50%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: COLORS.basic.main,
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
              mb: 0.5, // Reduced margin
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
  onToggle, // Added onToggle prop
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get title styles from hooks
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

  // Get standardized tooltip props for navigation items
  const navTooltipProps = useTooltip('navigation');

  return (
      <Box
          sx={{
            height: '100%',
            p: isCollapsed ? 0.75 : 2.5, // Adjusted padding
            overflow: 'auto',
            ...scrollbarStyles, // Apply modern scrollbar styles
          }}
      >
        {!isCollapsed ? (
            // Full sidebar content
            <>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                mt: 0.5,
              }}>
                {/* Toggle button positioned on the left (inner side) */}
                <IconButton
                    onClick={onToggle}
                    aria-label="Collapse sidebar"
                    size="small"
                    sx={{
                      borderRadius: 1,
                      backgroundColor: 'transparent',
                      padding: 0.5,
                      '&:hover': {
                        backgroundColor: COLORS.grey[100],
                      },
                    }}
                >
                  <ChevronRightIcon fontSize="small"/>
                </IconButton>

                {/* Title - right aligned */}
                <Typography variant="subtitle1" sx={{
                  ...titleStyles,
                  mb: 0,
                  textAlign: 'right',
                }}>
                  Related Questions {filteredRelatedQuestions.length > 0 &&
                    `(${filteredRelatedQuestions.length})`}
                </Typography>
              </Box>

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
                        py: 2, // Adjusted padding
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
              pt: 1, // Added top padding
            }}>
              <Tooltip
                  {...navTooltipProps}
                  title="Related Questions"
              >
                <Box
                    sx={{mb: 1.5, textAlign: 'center'}}>
                  <LinkIcon color="primary" sx={{fontSize: '1.6rem'}}/>
                </Box>
              </Tooltip>

              <Tooltip
                  {...navTooltipProps}
                  title={`${sortedQuestions.length} Related Questions`}
              >
                <Badge
                    badgeContent={sortedQuestions.length}
                    color="primary"
                    sx={{mb: 1.5}}
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
      </Box>
  );
};

export default React.memo(RelatedQuestionsSidebar);