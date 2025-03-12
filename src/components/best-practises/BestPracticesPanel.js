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
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';

// Icons
import {
  Code as CodeIcon,
  ContactSupport as SupportIcon,
  Engineering as EngineeringIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Insights as InsightsIcon,
  LightbulbOutlined as IdeaIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  School as SchoolIcon,
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
    philosophy: true,
    technical: false,
    timeline: false,
    examples: false,
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
                  Effective Questions:
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

  // Experience level tab panel component
  const ExperienceLevelTabPanel = ({value, index, children}) => (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`experience-level-tabpanel-${index}`}
          aria-labelledby={`experience-level-tab-${index}`}
      >
        {value === index && (
            <Box sx={{py: 2}}>
              {children}
            </Box>
        )}
      </div>
  );

  // Define interview phases for timeline
  const interviewPhases = [
    {
      phase: 'Opening',
      time: '5-10 min',
      description: 'Build rapport and set expectations',
      details: 'Start with a warm welcome and brief introductions. Explain the interview format and set a collaborative tone. This helps reduce candidate anxiety and creates a better environment for genuine responses.',
      tips: [
        'Share something about yourself to establish connection',
        'Explain the structure: "We\'ll talk about your experience, work through some problems, then leave time for your questions"',
        'Consider a light technical warm-up question to ease in',
      ],
    },
    {
      phase: 'Technical Background',
      time: '10-15 min',
      description: 'Explore past projects and experience',
      details: 'Ask about recent technical work and challenges they\'ve overcome. Listen for how they articulate complex technical concepts and their specific contributions to projects.',
      tips: [
        'Ask what they\'re most proud of technically',
        'Focus on technologies relevant to the position',
        'Note how they explain their role vs. team contributions',
      ],
    },
    {
      phase: 'Problem Solving',
      time: '20-30 min',
      description: 'Work through technical scenarios',
      details: 'Present practical problems related to your team\'s work. The goal is to observe their thinking process, how they approach ambiguity, and communication style when tackling technical challenges.',
      tips: [
        'Start with a straightforward problem then increase complexity',
        'Use real scenarios you\'ve encountered in your work',
        'Ask "How would you approach..." rather than expecting perfect answers',
      ],
    },
    {
      phase: 'System Design',
      time: '15-20 min',
      description: 'Discuss architectural approaches',
      details: 'For mid-level and senior roles, explore how they think about larger system design questions. Focus on trade-offs, scalability considerations, and their reasoning process.',
      tips: [
        'Start with a simple requirement then gradually add constraints',
        'Ask about trade-offs between different approaches',
        'For junior roles, keep this section lighter or theoretical',
      ],
    },
    {
      phase: 'Candidate Questions',
      time: '10-15 min',
      description: 'Answer their questions about the role/team',
      details: 'Reserve adequate time for their questions. This shows respect and allows you to assess what\'s important to them. The questions they ask can reveal a lot about their priorities and interests.',
      tips: [
        'Be transparent about team challenges and culture',
        'Note if they ask thoughtful questions about the work itself',
        'This is often when candidates are most genuine',
      ],
    },
    {
      phase: 'Closing',
      time: '5 min',
      description: 'Thank them and explain next steps',
      details: 'End on a positive note regardless of your assessment. Clearly communicate the next steps in the process and timeline for feedback. This creates a good candidate experience.',
      tips: [
        'Thank them for their time and insights',
        'Be specific about when they\'ll hear back',
        'Ask yourself: "Would I want this person on my team?"',
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
              Interview Best Practises
            </Typography>
          </Box>

          {/* Core Interview Philosophy Section */}
          <Section id="philosophy" title="Core Interview Philosophy"
                   icon={<InsightsIcon/>}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TechniqueCard
                    title="The No Maybe Rule"
                    icon={<PersonIcon/>}
                    content="Trust your intuition. If you can't confidently say 'yes' to having them on your team, it's a no. There are no maybes in hiring."
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
                    content="Trust your technical judgment. You can sense when someone truly understands a technology versus when they're reciting memorized concepts."
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${COLORS.grey[200]}`,
                      borderRadius: 2,
                    }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.primary.main,
                    }}>
                      Depth Probe Technique
                    </Typography>

                    <Typography sx={{mb: 2}}>
                      Use open-ended questions to expose decision-making
                      rationale and technical understanding. These questions
                      reveal depth beyond surface knowledge.
                    </Typography>

                    <Box
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          p: 2,
                          borderRadius: 1,
                        }}
                    >
                      <Typography variant="body2" sx={{fontWeight: 500, mb: 1}}>
                        Example Questions:
                      </Typography>

                      <ul style={{margin: 0, paddingLeft: '1.5rem'}}>
                        <li>
                          <Typography variant="body2" sx={{mb: 1}}>
                            "Walk me through your approach to troubleshooting
                            the Kafka producer shutdown issue"
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" sx={{mb: 1}}>
                            "You mentioned 'eventual consistency'—what
                            trade-offs did you consider?"
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            "What led you to choose that particular data
                            structure?"
                          </Typography>
                        </li>
                      </ul>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${COLORS.grey[200]}`,
                      borderRadius: 2,
                    }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 600,
                      mb: 2,
                      color: theme.palette.primary.main,
                    }}>
                      Scenario Adaptation
                    </Typography>

                    <Typography sx={{mb: 2}}>
                      Introduce hypothetical constraints to test adaptability
                      and deeper understanding. This reveals how candidates
                      handle changing requirements.
                    </Typography>

                    <Box
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          p: 2,
                          borderRadius: 1,
                        }}
                    >
                      <Typography variant="body2" sx={{fontWeight: 500, mb: 1}}>
                        Example Questions:
                      </Typography>

                      <ul style={{margin: 0, paddingLeft: '1.5rem'}}>
                        <li>
                          <Typography variant="body2" sx={{mb: 1}}>
                            "How would your solution change if the Kafka cluster
                            were horizontally scaled?"
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2" sx={{mb: 1}}>
                            "What if we suddenly had a 10x increase in traffic
                            to this service?"
                          </Typography>
                        </li>
                        <li>
                          <Typography variant="body2">
                            "Imagine we need to ensure exactly-once message
                            processing. How would that change your approach?"
                          </Typography>
                        </li>
                      </ul>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{mt: 2, mb: 3, fontWeight: 600}}>
                  Technical Mentoring Scenario
                </Typography>

                <DialogExample
                    title="Database Performance Problem"
                    exchanges={[
                      {
                        you: true,
                        text: 'Let\'s say I\'m a developer on your team. We have a REST API endpoint that\'s suddenly much slower than usual. What would you suggest I look at first?',
                      },
                      {
                        you: false,
                        text: 'I\'d start by checking if the database queries changed. Maybe we\'re doing a table scan now instead of using an index.',
                      },
                      {
                        you: true,
                        text: 'Good thought. What metrics or tools would you use to confirm that?',
                      },
                      {
                        you: false,
                        text: 'I\'d look at the query execution plan and check for \'Seq Scan\' operations or high-cost operations that should be using indexes.',
                      },
                      {
                        note: 'This technique quickly reveals their troubleshooting approach and technical depth without being a quiz. Look for structured thinking, clear communication, and command of their domain.',
                      },
                    ]}
                />
              </Grid>
            </Grid>
          </Section>

          {/* Interview Timeline Section */}
          <Section id="timeline" title="Interview Structure & Timeline"
                   icon={<TimelineIcon/>}>
            <Box sx={{px: 1, maxWidth: 900, mx: 'auto'}}>
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

          {/* Example Scenarios Section */}
          <Section id="examples" title="Experience-Tailored Questions"
                   icon={<SchoolIcon/>}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      minWidth: 120,
                    },
                  }}
              >
                <Tab
                    label={
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: theme.palette.primary.dark,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                        />
                        Senior / Lead
                      </Box>
                    }
                />
                <Tab
                    label={
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: theme.palette.primary.main,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                        />
                        Mid-Level
                      </Box>
                    }
                />
                <Tab
                    label={
                      <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <Box
                            sx={{
                              width: 8,
                              height: 8,
                              bgcolor: COLORS.basic.main,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                        />
                        Junior
                      </Box>
                    }
                />
              </Tabs>
            </Box>

            {/* Senior Level Panel */}
            <ExperienceLevelTabPanel value={activeTab} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="System Design & Architecture"
                      exchanges={[
                        {
                          you: true,
                          text: 'We need to redesign our notification service to handle 10x growth. How would you approach this?',
                        },
                        {
                          you: false,
                          text: 'I\'d first analyze the current bottlenecks. Are we limited by database throughput, message broker capacity, or something else?',
                        },
                        {
                          you: true,
                          text: 'Assume our message broker is the main bottleneck.',
                        },
                        {
                          you: false,
                          text: 'In that case, I\'d recommend moving to a distributed streaming platform like Kafka or Pulsar. We could shard by customer ID to distribute load and ensure ordered delivery within each customer\'s context.',
                        },
                        {
                          you: true,
                          text: 'What operational challenges would you anticipate with that approach?',
                        },
                        {
                          note: 'This tests both technical depth and the ability to consider real-world operational implications. Look for discussions of monitoring, scaling challenges, and disaster recovery.',
                        },
                      ]}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="Team Leadership & Technical Direction"
                      exchanges={[
                        {
                          you: true,
                          text: 'Tell me about a time when you had to change technical direction mid-project.',
                        },
                        {
                          you: false,
                          text: 'We were building a real-time analytics dashboard using a traditional RDBMS, but as the data volume grew, query performance degraded significantly.',
                        },
                        {
                          you: true,
                          text: 'How did you handle the transition?',
                        },
                        {
                          you: false,
                          text: 'First, I gathered metrics to quantify the problem. Then I prototyped two alternative approaches: one using a columnar database and another with a time-series DB. After testing with our actual workload, I presented the options with tradeoffs to the team.',
                        },
                        {
                          you: true,
                          text: 'How did you manage the team through this change?',
                        },
                        {
                          note: 'Listen for their approach to both the technical and people aspects of leadership. Strong candidates will discuss how they communicated the change, addressed resistance, and managed the transition risks.',
                        },
                      ]}
                  />
                </Grid>
              </Grid>
            </ExperienceLevelTabPanel>

            {/* Mid-Level Panel */}
            <ExperienceLevelTabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="Systems Design & Scaling"
                      exchanges={[
                        {
                          you: true,
                          text: 'So I see you\'ve worked on scaling that payment processing system. What kind of challenges did you run into?',
                        },
                        {
                          you: false,
                          text: 'Yeah, that was tricky. We kept hitting these weird latency spikes during peak hours. We initially thought it was our database, but...',
                        },
                        {
                          you: true,
                          text: 'What made you realize it wasn\'t the database?',
                        },
                        {
                          you: false,
                          text: 'Well, we added some monitoring and saw that the DB utilization was actually fine. Turned out our message broker was the real bottleneck.',
                        },
                        {
                          you: true,
                          text: 'That\'s a good catch. How did your team end up addressing that?',
                        },
                        {
                          note: 'Look for practical experience, how they collaborated with others, and their ability to explain technical concepts in a conversational way.',
                        },
                      ]}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="Code Quality & Refactoring"
                      exchanges={[
                        {
                          you: true,
                          text: 'Tell me about a time you had to refactor poorly written code. How did you approach it?',
                        },
                        {
                          you: false,
                          text: 'We inherited this authentication module that was a 3000-line class with multiple responsibilities. It had poor error handling and duplicated code everywhere.',
                        },
                        {
                          you: true,
                          text: 'That sounds painful. What strategy did you use to tackle it?',
                        },
                        {
                          you: false,
                          text: 'First, I added comprehensive tests to capture current behavior. Then, I identified the different responsibilities and created smaller, single-purpose classes. I refactored incrementally, keeping the code working at each step.',
                        },
                        {
                          you: true,
                          text: 'How did you ensure you didn\'t introduce new bugs?',
                        },
                        {
                          note: 'Look for disciplined approaches to refactoring, understanding of testing as a safety net, and pragmatic decision-making about what to change vs. leave alone.',
                        },
                      ]}
                  />
                </Grid>
              </Grid>
            </ExperienceLevelTabPanel>

            {/* Junior Panel */}
            <ExperienceLevelTabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="Troubleshooting & Fundamentals"
                      exchanges={[
                        {
                          you: true,
                          text: 'Let\'s talk about a situation you might encounter. Say you pushed some code that\'s supposed to process messages, but nothing seems to be happening. How would you start troubleshooting?',
                        },
                        {
                          you: false,
                          text: 'First thing I\'d do is check the logs to see if there are any errors or exceptions being thrown.',
                        },
                        {
                          you: true,
                          text: 'That\'s a good start. Let\'s say the logs show the application is starting fine, but just not processing anything.',
                        },
                        {
                          you: false,
                          text: 'I\'d probably check if the messages are actually making it to the queue. Maybe there\'s a connection issue?',
                        },
                        {
                          you: true,
                          text: 'Good thinking. What tools would help you verify that?',
                        },
                        {
                          note: 'Focus on their troubleshooting approach and logical progression through a problem, not specific technical details. Look for curiosity and eagerness to learn.',
                        },
                      ]}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <DialogExample
                      title="Learning & Growth Mindset"
                      exchanges={[
                        {
                          you: true,
                          text: 'Tell me about the most challenging thing you\'ve learned recently in programming.',
                        },
                        {
                          you: false,
                          text: 'I was struggling with understanding how promises and async/await work in JavaScript. I kept running into race conditions in my code.',
                        },
                        {
                          you: true,
                          text: 'That\'s something many developers find challenging. How did you go about learning it?',
                        },
                        {
                          you: false,
                          text: 'I started by reading MDN docs, but what really helped was building a small project where I deliberately used different patterns. I also drew diagrams to visualize the execution flow.',
                        },
                        {
                          you: true,
                          text: 'Nice approach. What\'s one insight that finally made it click for you?',
                        },
                        {
                          note: 'Listen for their learning process, not just what they learned. Great junior candidates will show persistence, creativity in their learning approaches, and the ability to apply concepts practically.',
                        },
                      ]}
                  />
                </Grid>
              </Grid>
            </ExperienceLevelTabPanel>
          </Section>

          <Section id="interaction" title="Effective Interaction Guidelines"
                   icon={<SupportIcon/>}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TechniqueCard
                    title="Proactive Clarification"
                    icon={<QuestionIcon/>}
                    content="Don't let confusion or ambiguity persist. Politely interrupt to clarify points when needed."
                    examples={[
                      'Let me pause you here—could you clarify how you validated the consumer offset?',
                      'I want to make sure I understand your approach correctly. Are you suggesting...?',
                      'Before we move on, I\'d like to clarify what you mean by \'optimized\' in this context.',
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