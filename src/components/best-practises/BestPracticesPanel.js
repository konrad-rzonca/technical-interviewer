// src/components/best-practises/BestPracticesPanel.js
import React, {useState} from 'react';
import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';

// Icons
import {
  Code as CodeIcon,
  ContactSupport as SupportIcon,
  Engineering as EngineeringIcon,
  ErrorOutline as PitfallIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Insights as InsightsIcon,
  LightbulbOutlined as IdeaIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

import {COLORS} from '../../themes/baseTheme';
import {usePanelStyles} from '../../utils/styles';

const BestPracticesPanel = () => {
  const theme = useTheme();
  const panelStyles = usePanelStyles(false, true);

  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    timeline: true,
    philosophy: false,
    technical: false,
    interaction: false,
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Section component with toggle functionality
  const Section = ({id, title, icon, children}) => {
    const isExpanded = expandedSections[id];

    return (
        <Card
            elevation={0}
            sx={{
              mb: 3,
              border: `1px solid ${COLORS.grey[200]}`,
              overflow: 'visible',
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.3),
              },
              transition: 'border-color 0.2s ease',
            }}
        >
          <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                cursor: 'pointer',
                bgcolor: isExpanded
                    ? alpha(theme.palette.primary.main, 0.04)
                    : 'transparent',
                transition: 'background-color 0.2s ease',
              }}
              onClick={() => toggleSection(id)}
          >
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Box
                  sx={{
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    mr: 2,
                  }}
              >
                {icon}
              </Box>
              <Typography variant="h6"
                          sx={{fontWeight: 600, fontSize: '1.1rem'}}>
                {title}
              </Typography>
            </Box>

            <IconButton
                size="small"
                edge="end"
                sx={{
                  color: theme.palette.primary.main,
                  transition: 'transform 0.2s ease',
                  transform: isExpanded ? 'rotate(0deg)' : 'rotate(0deg)',
                }}
            >
              {isExpanded ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
            </IconButton>
          </Box>

          {isExpanded && (
              <CardContent sx={{pt: 0, pb: '16px !important'}}>
                {children}
              </CardContent>
          )}
        </Card>
    );
  };

  // Technique card component
  const TechniqueCard = ({title, icon, content, examples}) => (
      <Card
          elevation={0}
          sx={{
            height: '100%',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
              borderColor: alpha(theme.palette.primary.main, 0.3),
            },
            borderRadius: 2,
          }}
      >
        <CardContent>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 2}}>
            <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  mr: 2,
                }}
            >
              {icon}
            </Box>
            <Typography variant="subtitle1" sx={{fontWeight: 600}}>
              {title}
            </Typography>
          </Box>

          <Typography sx={{mb: 2, color: COLORS.text.primary}}>
            {content}
          </Typography>

          {examples && (
              <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    p: 2,
                    borderRadius: 1,
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                  }}
              >
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: theme.palette.primary.main,
                }}>
                  Effective Examples:
                </Typography>

                {examples.map((example, idx) => (
                    <Typography
                        key={idx}
                        variant="body2"
                        sx={{
                          mb: idx < examples.length - 1 ? 1 : 0,
                          fontStyle: 'italic',
                          fontSize: '0.9rem',
                          color: COLORS.text.primary,
                        }}
                    >
                      "{example}"
                    </Typography>
                ))}
              </Box>
          )}
        </CardContent>
      </Card>
  );

  // Dialog example component
  const DialogExample = ({title, exchanges}) => (
      <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.grey[200]}`,
            mb: 3,
            borderRadius: 2,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            transition: 'box-shadow 0.2s ease',
          }}
      >
        <CardContent>
          <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                mb: 1.5,
                display: 'flex',
                alignItems: 'center',
              }}
          >
            <QuestionIcon fontSize="small"
                          sx={{mr: 1, color: theme.palette.primary.main}}/>
            {title}
          </Typography>

          <Divider sx={{mb: 2}}/>

          <Box>
            {exchanges.map((exchange, idx) => (
                <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      mb: 2,
                      backgroundColor: exchange.you ? alpha(
                          theme.palette.primary.main, 0.04) : 'transparent',
                      borderRadius: 1,
                      p: 1,
                    }}
                >
                  <Typography
                      sx={{
                        fontWeight: exchange.you ? 600 : 400,
                        color: exchange.you
                            ? theme.palette.primary.main
                            : COLORS.text.primary,
                        minWidth: 100,
                        mr: 1,
                      }}
                  >
                    {exchange.you ? 'You:' : 'Candidate:'}
                  </Typography>
                  <Typography
                      sx={{
                        flex: 1,
                        fontSize: '0.95rem',
                      }}
                  >
                    {exchange.text}
                  </Typography>
                </Box>
            ))}
          </Box>

          {exchanges[exchanges.length - 1].note && (
              <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    p: 2,
                    borderRadius: 1,
                    mt: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
              >
                <IdeaIcon
                    fontSize="small"
                    sx={{
                      mr: 1.5,
                      color: theme.palette.primary.main,
                      mt: '2px',
                    }}
                />
                <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      fontStyle: 'italic',
                      color: COLORS.text.primary,
                    }}
                >
                  Why this works: {exchanges[exchanges.length - 1].note}
                </Typography>
              </Box>
          )}
        </CardContent>
      </Card>
  );

  // Phase card component for timeline
  const PhaseCard = ({phase, time, description, details, tips}) => (
      <Card
          elevation={0}
          sx={{
            mb: 2,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
            borderLeft: `4px solid ${theme.palette.primary.main}`,
            borderRadius: 1,
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transform: 'translateX(4px)',
            },
            transition: 'all 0.2s ease',
          }}
      >
        <CardContent>
          <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 1}}>
            <Typography variant="subtitle1" sx={{
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}>
              {phase}
            </Typography>
            <Chip
                label={time}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
            />
          </Box>

          <Typography variant="body2"
                      sx={{fontWeight: 500, mb: 1, color: COLORS.text.primary}}>
            {description}
          </Typography>

          <Typography variant="body2" sx={{
            mb: 2,
            color: COLORS.text.secondary,
            fontSize: '0.85rem',
          }}>
            {details}
          </Typography>

          {tips && (
              <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    p: 1.5,
                    borderRadius: 1,
                  }}
              >
                <Typography variant="body2" sx={{
                  fontWeight: 600,
                  mb: 0.5,
                  color: theme.palette.primary.main,
                  fontSize: '0.8rem',
                }}>
                  Effective Approaches:
                </Typography>

                <ul style={{margin: '0.5rem 0', paddingLeft: '1.5rem'}}>
                  {tips.map((tip, idx) => (
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
  );

  // Define interview phases for timeline
  const interviewPhases = [
    {
      phase: 'Preparation',
      time: '10-15 min',
      description: 'Review candidate materials and plan your approach',
      details: 'Thoughtful preparation significantly improves interview quality. Review the candidate\'s resume, portfolio or code samples, focusing on areas relevant to your team\'s needs. Prepare specific questions based on their background.',
      tips: [
        'Identify 1-2 projects in their background to dig into technically',
        'Prepare a calibrated coding/system design problem that fits their level',
        'Note potential areas of concern to address in the interview',
        'Consider how their background might complement your team\'s current composition',
      ],
    },
    {
      phase: 'Introduction & Rapport',
      time: '5-7 min',
      description: 'Establish psychological safety and set expectations',
      details: 'The first few minutes dramatically impact interview quality. A relaxed candidate will demonstrate their true capabilities better. Introduce yourself, explain the interview structure, and start with easy questions to build confidence.',
      tips: [
        'Share something authentic about your role to establish connection',
        'Telegraph the structure: "We\'ll explore your experience, work through some problems, then leave time for your questions"',
        'Start with a low-stakes technical warm-up that lets them experience early success',
        'Watch for and address signs of anxiety to improve response quality',
      ],
    },
    {
      phase: 'Experience Exploration',
      time: '15-20 min',
      description: 'Assess past work through targeted questioning',
      details: 'Dig deep into one or two recent projects instead of superficially covering many. Ask progressively more detailed questions to distinguish between genuine expertise and surface-level knowledge.',
      tips: [
        'Ask for a specific technical challenge they overcame and follow the STAR method (Situation, Task, Action, Result)',
        'Probe decisions they made by asking "Why did you choose X over alternatives?"',
        'Look for ownership signals: "I designed/implemented/advocated for..." vs. "We used/the team decided..."',
        'Note how they explain technical concepts - can they adjust to your level of understanding?',
      ],
    },
    {
      phase: 'Technical Assessment',
      time: '25-35 min',
      description: 'Evaluate problem-solving approach and technical depth',
      details: 'Focus on the candidate\'s problem-solving process rather than whether they reach a perfect solution. Pay close attention to how they respond to hints, structure their approach, and communicate their thinking.',
      tips: [
        'Choose problems relevant to your actual work - avoid algorithm puzzles unless directly applicable',
        'Normalize thinking out loud: "I\'m more interested in your thought process than a perfect answer"',
        'Provide incremental hints when needed rather than letting candidates struggle too long',
        'Evaluate code quality factors: organization, naming, error handling, and edge cases',
        'For senior roles, push on scalability, maintainability, and system design considerations',
      ],
    },
    {
      phase: 'Collaborative Scenario',
      time: '10-15 min',
      description: 'Evaluate teamwork and communication through simulation',
      details: 'Create a scenario that simulates real collaboration to evaluate how the candidate might actually work with your team. This reveals communication style, openness to feedback, and how they might collaborate day-to-day.',
      tips: [
        'Present a scenario: "Let\'s say I\'m a junior teammate asking for help with..."',
        'Create a code review scenario: "How would you give feedback on this approach?"',
        'Introduce a constraint halfway through to see adaptability: "What if we suddenly needed to..."',
        'Note how they receive your input - do they integrate it or dismiss it?',
      ],
    },
    {
      phase: 'Candidate Questions',
      time: '10-15 min',
      description: 'Reciprocal evaluation and closing impressions',
      details: 'The questions candidates ask reveal their priorities, values, and what they\'ve understood about your team. Reserve adequate time for this phase and take their questions as seriously as their answers.',
      tips: [
        'Note the focus of questions: technical challenges, growth opportunities, team dynamics',
        'Provide honest answers that give real insight into your team culture',
        'Watch for red flags: no questions, only questions about perks, or hostile/defensive questions',
        'End with clear next steps and timeline to maintain candidate interest',
      ],
    },
    {
      phase: 'Post-Interview Evaluation',
      time: '5-10 min',
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

  return (
      <Box sx={{
        p: 3,
        minHeight: 'calc(100vh - 68px)',
        bgcolor: COLORS.background.light,
      }}>
        <Paper elevation={0} sx={{...panelStyles, pb: 4}}>
          <Box sx={{mb: 4}}>
            <Typography
                variant="h5"
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                }}
            >
              <EngineeringIcon sx={{mr: 1}}/>
              Interview Excellence
            </Typography>
            <Typography variant="body1" sx={{color: COLORS.text.secondary}}>
              Proven techniques to conduct powerful technical interviews that
              identify the best talent for your team.
              Focus on assessing technical ability, problem-solving, and
              determining if the candidate is someone you'd want to work with.
            </Typography>
          </Box>

          {/* Interview Timeline Section */}
          <Section id="timeline" title="Interview Structure & Timeline"
                   icon={<TimelineIcon/>}>
            <Box sx={{px: 1, maxWidth: 900, mx: 'auto', pt: 3}}>
              {interviewPhases.map((phase, index) => (
                  <PhaseCard
                      key={index}
                      phase={phase.phase}
                      time={phase.time}
                      description={phase.description}
                      details={phase.details}
                      tips={phase.tips}
                  />
              ))}
            </Box>
          </Section>

          {/* Core Interview Philosophy Section */}
          <Section id="philosophy" title="Core Interview Philosophy"
                   icon={<InsightsIcon/>}>
            <Grid container spacing={3} sx={{pt: 3}}>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="The No Maybe Rule"
                    icon={<PersonIcon/>}
                    content="Trust your intuition. If you can\'t confidently say \'yes\' to having them on your team, it\'s a no. There are no maybes in hiring."
                    examples={[
                      'Would I personally want to work with this person?',
                      'Would I be confident assigning important work to them?',
                      'Do I believe they\'d elevate our team\'s capabilities?',
                    ]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Dynamic Assessment"
                    icon={<PsychologyIcon/>}
                    content="Focus on problem-solving aptitude and thought process rather than memorized answers. How they approach challenges reveals more than what they know."
                    examples={[
                      'I\'m interested in how you\'d approach this problem...',
                      'Walk me through your thought process as you work through this...',
                      'Let\'s explore how you\'d handle changing requirements...',
                    ]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Technical Intuition"
                    icon={<IdeaIcon/>}
                    content="Trust your technical judgment. You can sense when someone truly understands a technology versus when they\'re reciting memorized concepts."
                    examples={[
                      'Tell me about a technical decision you made that you later regretted',
                      'How would you explain [complex concept] to a junior developer?',
                      'What\'s your favorite feature of [technology] and why?',
                    ]}
                />
              </Grid>
            </Grid>
          </Section>

          {/* Technical Evaluation Section */}
          <Section id="technical" title="Technical Questioning Strategies"
                   icon={<CodeIcon/>}>
            <Grid container spacing={3} sx={{pt: 3}}>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Depth Probe Technique"
                    icon={<CodeIcon/>}
                    content="Use open-ended questions to expose decision-making rationale and technical understanding. These questions reveal depth beyond surface knowledge."
                    examples={[
                      'Walk me through your approach to troubleshooting the Kafka producer shutdown issue',
                      'You mentioned \'eventual consistency\'—what trade-offs did you consider?',
                      'What led you to choose that particular data structure?',
                    ]}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Scenario Adaptation"
                    icon={<CodeIcon/>}
                    content="Introduce hypothetical constraints to test adaptability and deeper understanding. This reveals how candidates handle changing requirements."
                    examples={[
                      'How would your solution change if the Kafka cluster were horizontally scaled?',
                      'What if we suddenly had a 10x increase in traffic to this service?',
                      'Imagine we need to ensure exactly-once message processing. How would that change your approach?',
                    ]}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Technical Mentoring"
                    icon={<CodeIcon/>}
                    content="Create a scenario where the candidate has to explain a technical concept or solution to a colleague. This reveals teaching ability and depth of understanding."
                    examples={[
                      'Let\'s say I\'m a junior developer. Could you explain how database indexing impacts query performance?',
                      'Pretend I\'m a new team member. How would you explain our message queue architecture to me?',
                      'If a colleague was confused about microservices, how would you describe the key benefits and challenges?',
                    ]}
                />
              </Grid>
            </Grid>
          </Section>


          {/* Common Pitfalls Section */}
          <Section id="pitfalls" title="Common Interview Pitfalls"
                   icon={<PitfallIcon/>}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="The Knowledge Quiz"
                    icon={<PitfallIcon/>}
                    content="Asking trivia-like questions about language features or API details. This tests memorization, not problem-solving ability or deeper understanding."
                    examples={[
                      'Instead of \'Name 5 HTTP status codes\', ask \'How would you troubleshoot this 403 error?\'',
                      'Replace \'Explain Big O notation\' with \'Why might this function become slow with large inputs?\'',
                      'Focus on applied knowledge: \'How would you refactor this to be more maintainable?\'',
                    ]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="The Sherlock Syndrome"
                    icon={<PitfallIcon/>}
                    content="Creating unnecessarily complex or trick-based problems designed to stump candidates rather than reveal their capabilities."
                    examples={[
                      'Choose problems representative of your actual day-to-day challenges',
                      'Test problem-solving process rather than ability to find the one clever trick',
                      'When a candidate struggles, consider whether the problem itself is unreasonable',
                    ]}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="Interrogation Mode"
                    icon={<PitfallIcon/>}
                    content="Rapid-fire questioning without building rapport creates anxiety and prevents candidates from showing their best work."
                    examples={[
                      'Allocate time for casual conversation to establish psychological safety',
                      'Signal your interest in their success: \'I\'m hoping to see how you approach problems\'',
                      'Share something about yourself first to create reciprocity and connection',
                    ]}
                />
              </Grid>
            </Grid>
          </Section>

          {/* Effective Interaction Guidelines */}
          <Section id="interaction" title="Effective Interaction Guidelines"
                   icon={<SupportIcon/>}>
            <Grid container spacing={3} sx={{pt: 3}}>
              <Grid item xs={12} md={6}>
                <TechniqueCard
                    title="Active Communication"
                    icon={<QuestionIcon/>}
                    content="Manage the conversation flow effectively. Clarify when needed, but also recognize when a candidate has sufficiently answered and move forward."
                    examples={[
                      'That\'s an excellent answer, thank you. Let\'s move on to discuss...',
                      'I appreciate that thorough explanation. Now I\'d like to explore a different area...',
                      'I see your approach clearly now. To be mindful of our time, let\'s shift to...',
                    ]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TechniqueCard
                    title="Genuine Engagement"
                    icon={<InsightsIcon/>}
                    content="Create space for candidates to be authentic. Open-ended follow-ups invite them to share real experiences and demonstrate their true capabilities."
                    examples={[
                      'That\'s an interesting approach. What led you to that solution?',
                      'I\'d love to hear more about your experience with that technology',
                      'What aspects of this problem do you find most interesting to explore?',
                    ]}
                />
              </Grid>
            </Grid>
          </Section>
        </Paper>
      </Box>
  );
};

export default BestPracticesPanel;