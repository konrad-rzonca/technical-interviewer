import React, {useState} from 'react';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {COLORS} from '../../themes/baseTheme';
import {
  AccessTime as TimeIcon,
  Assignment as PrepIcon,
  CheckCircle as EvalIcon,
} from '@mui/icons-material';

// Revised interview phases data with clearer segmentation
const interviewPhases = [
  {
    id: 'prep',
    phase: 'Preparation',
    time: '15 min',
    category: 'pre',
    description: 'Review candidate materials and plan your approach',
    details: 'Thoughtful preparation significantly improves interview quality. Review the candidate\'s resume, portfolio or code samples, focusing on areas relevant to your team\'s needs.',
    tips: [
      'Identify 1-2 projects in their background to dig into technically',
      'Prepare a calibrated coding/system design problem that fits their level',
      'Note potential areas of concern to address in the interview',
    ],
  },
  {
    id: '1',
    phase: 'Introduction',
    time: '5 min',
    category: 'interview',
    duration: 5,
    description: 'Establish rapport and set expectations',
    details: 'The first few minutes dramatically impact interview quality. A relaxed candidate will demonstrate their true capabilities better.',
    tips: [
      'Share something authentic about your role to establish connection',
      'Telegraph the structure: "We\'ll explore your experience, work through some problems, then leave time for your questions"',
      'Start with a low-stakes technical warm-up that lets them experience early success',
    ],
  },
  {
    id: '2',
    phase: 'Experience',
    time: '15 min',
    category: 'interview',
    duration: 15,
    description: 'Assess past work through targeted questioning',
    details: 'Dig deep into one or two recent projects instead of superficially covering many. Ask progressively more detailed questions to distinguish between genuine expertise and surface-level knowledge.',
    tips: [
      'Ask for a specific technical challenge they overcame using the STAR method',
      'Probe decisions they made by asking "Why did you choose X over alternatives?"',
      'Look for ownership signals: "I designed/implemented..." vs. "We used/the team decided..."',
    ],
  },
  {
    id: '3',
    phase: 'Technical',
    time: '60 min',
    category: 'interview',
    duration: 60,
    description: 'Evaluate problem-solving approach and technical implementation',
    details: 'Focus on the candidate\'s problem-solving process rather than whether they reach a perfect solution. This can include collaborative scenarios to evaluate teamwork and optional coding exercises if appropriate for the role.',
    tips: [
      'Choose problems relevant to your actual work - avoid algorithm puzzles unless directly applicable',
      'Normalize thinking out loud: "I\'m more interested in your thought process than a perfect answer"',
      'Include a collaborative scenario: "Let\'s say I\'m a junior teammate asking for help with..."',
      'For implementation tasks, evaluate code quality: organization, naming, error handling',
      'For senior roles, push on scalability, maintainability, and system design considerations',
    ],
  },
  {
    id: '4',
    phase: 'Questions',
    time: '10 min',
    category: 'interview',
    duration: 10,
    description: 'Allow candidate to ask questions and close the interview',
    details: 'The questions candidates ask reveal their priorities, values, and what they\'ve understood about your team. This phase is just as important for evaluation as their answers to your questions.',
    tips: [
      'Note the focus of questions: technical challenges, growth opportunities, team dynamics',
      'Provide honest answers that give real insight into your team culture',
      'Watch for red flags: no questions, only questions about perks, or hostile questions',
      'End with clear next steps and timeline to maintain candidate interest',
    ],
  },
  {
    id: 'eval',
    phase: 'Evaluation',
    time: '15 min',
    category: 'post',
    description: 'Document observations while fresh',
    details: 'Discipline in recording your observations immediately after the interview significantly improves hiring decisions. Focus on specific behavioral examples rather than vague impressions.',
    tips: [
      'Structure feedback in consistent categories: technical skills, problem solving, communication, collaboration',
      'Cite specific examples: "When tackling the database problem, they immediately identified the indexing issue"',
      'Separate objective observations from subjective impressions',
      'Make a clear hire/no-hire recommendation with confidence level',
    ],
  },
];

const InterviewTimeline = () => {
  const theme = useTheme();
  const [selectedPhase, setSelectedPhase] = useState(1); // Default to first interview phase

  const handlePhaseClick = (index) => {
    setSelectedPhase(index);
  };

  // Get the selected phase object
  const selectedPhaseData = interviewPhases[selectedPhase];

  // Determine category colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'pre':
        return theme.palette.info.main;
      case 'post':
        return theme.palette.success.main;
      default:
        return theme.palette.primary.main;
    }
  };

  // Calculate total core interview duration
  const totalCoreDuration = interviewPhases.filter(
      phase => phase.category === 'interview').
      reduce((sum, phase) => sum + phase.duration, 0);

  // Get interview phases only (for proportional spacing)
  const corePhases = interviewPhases.filter(
      phase => phase.category === 'interview');

  return (
      <Box sx={{width: '100%', pt: 2, pb: 2}}>
        {/* Timeline container */}
        <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
              borderRadius: 1,
            }}
        >
          <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
            <TimeIcon sx={{mr: 1, color: theme.palette.text.secondary}}/>
            <Typography variant="subtitle2"
                        sx={{color: theme.palette.text.secondary}}>
              Interview Timeline (90 min core)
            </Typography>
          </Box>

          <Divider sx={{mb: 3}}/>

          {/* Timeline with proportional spacing */}
          <Box sx={{
            display: 'flex',
            px: 2,
            py: 1,
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            {/* Preparation phase (15% width) */}
            <Box sx={{
              width: '15%',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .timeline-node': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                  onClick={() => handlePhaseClick(0)}
              >
                <Box
                    className="timeline-node"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: selectedPhase === 0
                          ? theme.palette.info.main
                          : alpha(theme.palette.info.main, 0.2),
                      color: selectedPhase === 0
                          ? 'white'
                          : theme.palette.info.main,
                      transition: 'all 0.2s',
                      border: `2px solid ${
                          selectedPhase === 0
                              ? theme.palette.info.main
                              : alpha(theme.palette.info.main, 0.4)
                      }`,
                      zIndex: 2,
                    }}
                >
                  <PrepIcon fontSize="small"/>
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      fontWeight: selectedPhase === 0 ? 600 : 400,
                      color: theme.palette.info.main,
                      textAlign: 'center',
                    }}
                >
                  Preparation
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.65rem',
                      color: COLORS.text.secondary,
                      textAlign: 'center',
                    }}
                >
                  {interviewPhases[0].time}
                </Typography>
              </Box>
            </Box>

            {/* Core interview phases (70% width with proportional spacing) */}
            <Box sx={{
              width: '70%',
              display: 'flex',
              position: 'relative',
            }}>
              {corePhases.map((phase, index) => {
                const phaseIndex = interviewPhases.findIndex(
                    p => p.id === phase.id);

                // Calculate position based on phase duration
                // For first item, position from left edge
                // For subsequent items, position based on cumulative duration
                const cumulativeDuration = corePhases.slice(0, index).
                    reduce((sum, p) => sum + p.duration, 0);

                const positionPercentage = index === 0
                    ? 0
                    : (cumulativeDuration / totalCoreDuration) * 100;

                // For the last item, ensure it's at the right edge
                const leftPosition = index === corePhases.length - 1
                    ? `calc(100% - 32px)`
                    : `calc(${positionPercentage}% + 0px)`;

                return (
                    <Box
                        key={phase.id}
                        sx={{
                          position: 'absolute',
                          left: leftPosition,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          cursor: 'pointer',
                          '&:hover': {
                            '& .timeline-node': {
                              transform: 'scale(1.1)',
                            },
                          },
                        }}
                        onClick={() => handlePhaseClick(phaseIndex)}
                    >
                      <Box
                          className="timeline-node"
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: selectedPhase === phaseIndex
                                ? theme.palette.primary.main
                                : alpha(theme.palette.primary.main, 0.15),
                            color: selectedPhase === phaseIndex
                                ? 'white'
                                : theme.palette.primary.main,
                            border: `2px solid ${
                                selectedPhase === phaseIndex
                                    ? theme.palette.primary.main
                                    : alpha(theme.palette.primary.main, 0.4)
                            }`,
                            transition: 'all 0.2s',
                            zIndex: 2,
                          }}
                      >
                        <Typography
                            sx={{
                              fontSize: '0.9rem',
                              fontWeight: 'bold',
                            }}
                        >
                          {phase.id}
                        </Typography>
                      </Box>

                      <Typography
                          variant="caption"
                          sx={{
                            mt: 1,
                            fontWeight: selectedPhase === phaseIndex
                                ? 600
                                : 400,
                            color: theme.palette.primary.main,
                            textAlign: 'center',
                            maxWidth: 80,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                      >
                        {phase.phase}
                      </Typography>

                      <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.65rem',
                            color: COLORS.text.secondary,
                            textAlign: 'center',
                          }}
                      >
                        {phase.time}
                      </Typography>
                    </Box>
                );
              })}
            </Box>

            {/* Evaluation phase (15% width) */}
            <Box sx={{
              width: '15%',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      '& .timeline-node': {
                        transform: 'scale(1.1)',
                      },
                    },
                  }}
                  onClick={() => handlePhaseClick(interviewPhases.length - 1)}
              >
                <Box
                    className="timeline-node"
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      bgcolor: selectedPhase === interviewPhases.length - 1
                          ? theme.palette.success.main
                          : alpha(theme.palette.success.main, 0.2),
                      color: selectedPhase === interviewPhases.length - 1
                          ? 'white'
                          : theme.palette.success.main,
                      transition: 'all 0.2s',
                      border: `2px solid ${
                          selectedPhase === interviewPhases.length - 1
                              ? theme.palette.success.main
                              : alpha(theme.palette.success.main, 0.4)
                      }`,
                      zIndex: 2,
                    }}
                >
                  <EvalIcon fontSize="small"/>
                </Box>

                <Typography
                    variant="caption"
                    sx={{
                      mt: 1,
                      fontWeight: selectedPhase === interviewPhases.length - 1
                          ? 600
                          : 400,
                      color: theme.palette.success.main,
                      textAlign: 'center',
                    }}
                >
                  Evaluation
                </Typography>

                <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.65rem',
                      color: COLORS.text.secondary,
                      textAlign: 'center',
                    }}
                >
                  {interviewPhases[interviewPhases.length - 1].time}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Phase Details */}
        <Card
            elevation={0}
            sx={{
              border: `1px solid ${alpha(
                  getCategoryColor(selectedPhaseData.category), 0.3)}`,
              borderLeft: `4px solid ${getCategoryColor(
                  selectedPhaseData.category)}`,
              borderRadius: 1,
            }}
        >
          <CardContent>
            <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
              <Typography variant="subtitle1" sx={{
                fontWeight: 600,
                color: getCategoryColor(selectedPhaseData.category),
                display: 'flex',
                alignItems: 'center',
              }}>
                {selectedPhaseData.id && selectedPhaseData.category ===
                    'interview' &&
                    <Chip
                        label={selectedPhaseData.id}
                        size="small"
                        sx={{
                          mr: 1,
                          height: 20,
                          minWidth: 20,
                          fontSize: '0.7rem',
                          bgcolor: alpha(
                              getCategoryColor(selectedPhaseData.category),
                              0.1),
                          color: getCategoryColor(selectedPhaseData.category),
                        }}
                    />
                }
                {selectedPhaseData.phase}
              </Typography>
              <Chip
                  label={selectedPhaseData.time}
                  size="small"
                  sx={{
                    bgcolor: alpha(getCategoryColor(selectedPhaseData.category),
                        0.1),
                    color: getCategoryColor(selectedPhaseData.category),
                    fontWeight: 500,
                    fontSize: '0.7rem',
                  }}
              />
            </Box>

            <Typography variant="body2" sx={{
              fontWeight: 500,
              mb: 1,
              color: COLORS.text.primary,
            }}>
              {selectedPhaseData.description}
            </Typography>

            <Typography variant="body2" sx={{
              mb: 2,
              color: COLORS.text.secondary,
              fontSize: '0.85rem',
            }}>
              {selectedPhaseData.details}
            </Typography>

            {selectedPhaseData.tips && (
                <Box
                    sx={{
                      bgcolor: alpha(
                          getCategoryColor(selectedPhaseData.category), 0.05),
                      p: 1.5,
                      borderRadius: 1,
                    }}
                >
                  <Typography variant="body2" sx={{
                    fontWeight: 600,
                    mb: 0.5,
                    color: getCategoryColor(selectedPhaseData.category),
                    fontSize: '0.8rem',
                  }}>
                    Effective Approaches:
                  </Typography>

                  <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                    {selectedPhaseData.tips.map((tip, idx) => (
                        <li key={idx}>
                          <Typography variant="body2" sx={{
                            fontSize: '0.8rem',
                            color: COLORS.text.primary,
                          }}>
                            {tip}
                          </Typography>
                        </li>
                    ))}
                  </ul>
                </Box>
            )}
          </CardContent>
        </Card>
      </Box>
  );
};

export default InterviewTimeline;