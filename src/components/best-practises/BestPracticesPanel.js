// src/components/best-practises/BestPracticesPanel.js
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import {
  AccessTime as TimeIcon,
  Assignment as EvaluationIcon,
  FilterNone as StructureIcon,
  FormatListBulleted as ChecklistIcon,
  LightbulbOutlined as TipIcon,
  PersonSearch as CandidateIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  RecordVoiceOver as CommunicationIcon,
  School as LearningIcon,
} from '@mui/icons-material';
import {usePanelStyles, useTitleStyles} from '../../utils/styles';
import {COLORS, SPACING, TYPOGRAPHY} from '../../themes/baseTheme';

// Interview timeline data
const interviewTimelineSteps = [
  {
    time: '0-5 min',
    title: 'Introduction',
    content: 'Welcome the candidate, introduce yourself, and set a friendly tone. Explain the interview structure and what to expect.',
    color: COLORS.primary.main,
  },
  {
    time: '5-10 min',
    title: 'Warm-up',
    content: 'Ask about candidate\'s background and experience. This helps ease nervousness and provides context for technical questions.',
    color: COLORS.primary.main,
  },
  {
    time: '10-60 min',
    title: 'Technical Questions',
    content: 'Core part of the interview. Start with basic questions and progressively increase difficulty. Use the platform\'s question navigator to find appropriate questions based on their responses.',
    color: COLORS.primary.dark,
  },
  {
    time: '60-75 min',
    title: 'Coding Exercise',
    content: 'Optional: Give a practical coding problem to solve. Look for problem-solving approach rather than perfect syntax.',
    color: COLORS.primary.dark,
  },
  {
    time: '75-85 min',
    title: 'Candidate Questions',
    content: 'Allow time for the candidate to ask questions about the role, team, or company.',
    color: COLORS.primary.main,
  },
  {
    time: '85-90 min',
    title: 'Closing',
    content: 'Thank the candidate, explain next steps in the process, and provide a timeline for feedback.',
    color: COLORS.primary.light,
  },
];

// Best practices data
const bestPracticesTiles = [
  {
    title: 'Question Selection',
    icon: <QuestionIcon fontSize="large" color="primary"/>,
    content: [
      'Start with basic questions to build confidence',
      'Adapt difficulty based on candidate responses',
      'Use a mix of theoretical and practical questions',
      'Focus on fundamentals first, then specialization',
    ],
  },
  {
    title: 'Effective Communication',
    icon: <CommunicationIcon fontSize="large" color="primary"/>,
    content: [
      'Use clear, jargon-free language',
      'Provide context for complex questions',
      'Listen actively without interrupting',
      'Offer guidance if a candidate is stuck, but don\'t lead too much',
    ],
  },
  {
    title: 'Psychological Safety',
    icon: <PsychologyIcon fontSize="large" color="primary"/>,
    content: [
      'Create a relaxed atmosphere to see the candidate\'s best',
      'Acknowledge good answers to build confidence',
      'Be patient with nervousness or initial confusion',
      'Avoid making the candidate feel judged or tested',
    ],
  },
  {
    title: 'Evaluation Techniques',
    icon: <EvaluationIcon fontSize="large" color="primary"/>,
    content: [
      'Use the rating system consistently across candidates',
      'Take notes on specific answers, not just impressions',
      'Look for problem-solving approach, not just correct answers',
      'Consider communication skills alongside technical knowledge',
    ],
  },
  {
    title: 'Application Features',
    icon: <StructureIcon fontSize="large" color="primary"/>,
    content: [
      'Use Learning Mode to practice before interviews',
      'Mark important answer points during the interview',
      'Filter questions by category and skill level',
      'Export interview notes for team sharing',
    ],
  },
  {
    title: 'Bias Prevention',
    icon: <CandidateIcon fontSize="large" color="primary"/>,
    content: [
      'Use the same question set for all candidates in a role',
      'Focus on skills demonstrated, not background',
      'Give equal speaking time to all candidates',
      'Evaluate answers against objective criteria',
    ],
  },
  {
    title: 'Pre-Interview Checklist',
    icon: <ChecklistIcon fontSize="large" color="primary"/>,
    content: [
      'Review the candidate\'s resume and experience',
      'Select question categories relevant to the role',
      'Prepare 3-5 core questions plus follow-ups',
      'Test your audio/video if conducting remote interviews',
    ],
  },
  {
    title: 'Continuous Improvement',
    icon: <LearningIcon fontSize="large" color="primary"/>,
    content: [
      'Review which questions effectively revealed candidate skills',
      'Update your question approach based on results',
      'Collect feedback from hired candidates about the process',
      'Share effective questions with your team',
    ],
  },
];

const BestPracticesPanel = () => {
  // Use the same styling hooks as other panels for consistency
  const titleStyles = useTitleStyles();
  const panelStyles = usePanelStyles(false, true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
      <Box sx={{
        p: 2,
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Paper
            elevation={0}
            sx={{
              ...panelStyles,
              mb: SPACING.toUnits(SPACING.md),
            }}
        >
          <Typography variant="h5" sx={titleStyles}>
            Interview Best Practices
          </Typography>
          <Typography sx={{
            fontSize: TYPOGRAPHY.fontSize.regularText,
            marginBottom: SPACING.toUnits(SPACING.lg),
          }}>
            Conducting effective technical interviews requires both technical
            knowledge and interpersonal skills.
            Use these guidelines to create a productive interview experience
            that accurately evaluates candidates while keeping them engaged.
          </Typography>

          {/* 90-Minute Interview Timeline */}
          <Box sx={{mb: SPACING.toUnits(SPACING.lg)}}>
            <Typography variant="h6" sx={{
              fontSize: TYPOGRAPHY.fontSize.h5,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.text.primary,
              mb: SPACING.toUnits(SPACING.md),
              display: 'flex',
              alignItems: 'center',
            }}>
              <TimeIcon sx={{mr: 1}}/>
              90-Minute Interview Structure
            </Typography>

            <Box sx={{
              bgcolor: COLORS.grey[50],
              border: `1px solid ${COLORS.grey[200]}`,
              borderRadius: SPACING.toUnits(SPACING.borderRadius),
              p: SPACING.toUnits(SPACING.md),
              mb: SPACING.toUnits(SPACING.md),
            }}>
              <Timeline position={isSmallScreen ? 'right' : 'alternate'}
                        sx={{p: 0}}>
                {interviewTimelineSteps.map((step, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent sx={{
                        display: isSmallScreen ? 'none' : 'block',
                        m: 'auto 0',
                        color: COLORS.text.secondary,
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        fontSize: TYPOGRAPHY.fontSize.regularText,
                      }}>
                        {step.time}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot sx={{bgcolor: step.color}}>
                          <TimeIcon fontSize="small"/>
                        </TimelineDot>
                        {index < interviewTimelineSteps.length - 1 &&
                            <TimelineConnector/>}
                      </TimelineSeparator>
                      <TimelineContent sx={{py: '12px', px: 2}}>
                        <Typography
                            variant="h6"
                            component="span"
                            sx={{
                              fontWeight: TYPOGRAPHY.fontWeight.medium,
                              fontSize: TYPOGRAPHY.fontSize.itemTitle,
                              display: 'block',
                            }}
                        >
                          {step.title}
                          {isSmallScreen && <Typography
                              component="span"
                              sx={{
                                ml: 1,
                                color: COLORS.text.secondary,
                                fontWeight: TYPOGRAPHY.fontWeight.regular,
                              }}
                          >
                            ({step.time})
                          </Typography>}
                        </Typography>
                        <Typography sx={{
                          color: COLORS.text.secondary,
                          fontSize: TYPOGRAPHY.fontSize.regularText,
                        }}>
                          {step.content}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                ))}
              </Timeline>
            </Box>
          </Box>

          {/* Best Practices Tiles */}
          <Typography variant="h6" sx={{
            fontSize: TYPOGRAPHY.fontSize.h5,
            fontWeight: TYPOGRAPHY.fontWeight.medium,
            color: COLORS.text.primary,
            mb: SPACING.toUnits(SPACING.md),
            display: 'flex',
            alignItems: 'center',
          }}>
            <TipIcon sx={{mr: 1}}/>
            Interviewer Guidance
          </Typography>

          <Grid container spacing={SPACING.toUnits(SPACING.md)}>
            {bestPracticesTiles.map((tile, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card sx={{
                    height: '100%',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    border: `1px solid ${COLORS.grey[200]}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                    },
                  }}>
                    <CardContent>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: SPACING.toUnits(SPACING.xs),
                      }}>
                        {tile.icon}
                        <Typography variant="h6" sx={{
                          fontWeight: TYPOGRAPHY.fontWeight.medium,
                          fontSize: TYPOGRAPHY.fontSize.itemTitle,
                          ml: SPACING.toUnits(SPACING.xs),
                        }}>
                          {tile.title}
                        </Typography>
                      </Box>
                      <Divider sx={{my: SPACING.toUnits(SPACING.xs)}}/>
                      <Box component="ul" sx={{
                        pl: SPACING.toUnits(SPACING.md),
                        m: 0,
                        '& li': {
                          fontSize: TYPOGRAPHY.fontSize.regularText,
                          mb: SPACING.toUnits(SPACING.xs),
                          color: COLORS.text.secondary,
                        },
                      }}>
                        {tile.content.map((point, i) => (
                            <li key={i}>{point}</li>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
  );
};

export default BestPracticesPanel;