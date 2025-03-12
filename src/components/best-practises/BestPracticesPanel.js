// src/components/best-practises/BestPracticesPanel.js
import React, {useState} from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Code as CodeIcon,
  ContactSupport as SupportIcon,
  ExpandMore as ExpandMoreIcon,
  Insights as InsightsIcon,
  LightbulbOutlined as IdeaIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  QuestionAnswer as QuestionIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {usePanelStyles, useTitleStyles} from '../../utils/styles';
import {COLORS, TYPOGRAPHY} from '../../themes/baseTheme';

const BestPracticesPanel = () => {
  const theme = useTheme();
  const panelStyles = usePanelStyles(false, true);
  const titleStyles = useTitleStyles();

  // State to track expanded accordion sections
  const [expanded, setExpanded] = useState('timeline');
  // State for the phase being hovered in the timeline
  const [activePhase, setActivePhase] = useState(null);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Styled section header
  const SectionHeader = ({icon, title, subtitle}) => (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
      }}>
        <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              mr: 2,
            }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography
              variant="h6"
              sx={{
                fontWeight: TYPOGRAPHY.fontWeight.medium,
                fontSize: '1.1rem',
              }}
          >
            {title}
          </Typography>
          {subtitle && (
              <Typography
                  variant="body2"
                  sx={{
                    color: COLORS.text.secondary,
                    fontSize: '0.9rem',
                  }}
              >
                {subtitle}
              </Typography>
          )}
        </Box>
      </Box>
  );

  // Technique card component
  const TechniqueCard = ({title, content, examples, icon}) => (
      <Card
          elevation={0}
          sx={{
            border: `1px solid ${COLORS.grey[200]}`,
            height: '100%',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
            },
          }}
      >
        <CardContent>
          <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
          >
            <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  mr: 2,
                  width: 40,
                  height: 40,
                }}
            >
              {icon}
            </Avatar>
            <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                  fontSize: '1.05rem',
                }}
            >
              {title}
            </Typography>
          </Box>

          <Typography
              sx={{
                mb: 2,
                fontSize: TYPOGRAPHY.fontSize.regularText,
              }}
          >
            {content}
          </Typography>

          <Box
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                p: 2,
                borderRadius: 1,
                borderLeft: `4px solid ${theme.palette.primary.main}`,
              }}
          >
            <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  mb: 1,
                  color: theme.palette.primary.main,
                }}
            >
              Try This:
            </Typography>

            {examples.map((example, idx) => (
                <Typography
                    key={idx}
                    variant="body2"
                    sx={{
                      mb: idx < examples.length - 1 ? 1 : 0,
                      fontStyle: 'italic',
                      fontSize: '0.95rem',
                    }}
                >
                  "{example}"
                </Typography>
            ))}
          </Box>
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
          }}
      >
        <CardContent>
          <Typography
              variant="h6"
              sx={{
                fontWeight: 500,
                fontSize: '1.05rem',
                mb: 1.5,
              }}
          >
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
                    }}
                >
                  <Typography
                      sx={{
                        fontWeight: exchange.you ? 600 : 400,
                        color: exchange.you
                            ? theme.palette.primary.main
                            : COLORS.text.primary,
                        minWidth: 100,
                      }}
                  >
                    {exchange.you ? 'You:' : 'Candidate:'}
                  </Typography>
                  <Typography
                      sx={{
                        flex: 1,
                        fontSize: TYPOGRAPHY.fontSize.regularText,
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
                  }}
              >
                <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                    }}
                >
                  <IdeaIcon
                      fontSize="small"
                      sx={{
                        verticalAlign: 'middle',
                        mr: 1,
                        color: theme.palette.primary.main,
                      }}
                  />
                  Why this works: {exchanges[exchanges.length - 1].note}
                </Typography>
              </Box>
          )}
        </CardContent>
      </Card>
  );

  // Define interview phases for a better timeline
  const interviewPhases = [
    {
      phase: 'Opening',
      time: '5-10 min',
      description: 'Build rapport and set expectations',
      details: 'Start with a warm welcome and brief introductions. Explain the interview format and set a collaborative tone. This helps reduce candidate anxiety and creates a better environment for genuine responses.',
      tips: [
        'Share something about yourself to establish connection',
        'Explain the structure: \'We\'ll talk about your experience, work through some problems, then leave time for your questions\'',
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
        'Ask \'How would you approach...\' rather than expecting perfect answers',
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
        'Ask yourself: \'Would I want this person on my team?\'',
      ],
    },
  ];

  return (
      <Box sx={{p: 2, minHeight: 'calc(100vh - 64px)'}}>
        <Paper elevation={0} sx={{...panelStyles, pb: 4}}>

          {/* Core Philosophy */}
          <Accordion
              expanded={expanded === 'panel1'}
              onChange={handleAccordionChange('panel1')}
              elevation={0}
              sx={{
                mb: 2,
                border: `1px solid ${COLORS.grey[200]}`,
                '&:before': {
                  display: 'none',
                },
              }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <SectionHeader
                  icon={<InsightsIcon/>}
                  title="Core Interview Philosophy"
                  subtitle="The guiding principles behind effective technical interviews"
              />
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>

          {/* Technical Probing Techniques */}
          <Accordion
              expanded={expanded === 'panel2'}
              onChange={handleAccordionChange('panel2')}
              elevation={0}
              sx={{
                mb: 2,
                border: `1px solid ${COLORS.grey[200]}`,
                '&:before': {
                  display: 'none',
                },
              }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <SectionHeader
                  icon={<CodeIcon/>}
                  title="Technical Depth Techniques"
                  subtitle="Ways to explore candidates' real technical understanding"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="h6"
                          sx={{mb: 2, fontWeight: 500, fontSize: '1.05rem'}}>
                Follow-Up Question Strategy
              </Typography>

              <Grid container spacing={3} sx={{mb: 4}}>
                <Grid item xs={12} md={6}>
                  <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${COLORS.grey[200]}`,
                        height: '100%',
                      }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1"
                                  sx={{mb: 1.5, fontWeight: 500}}>
                        Depth Probe
                      </Typography>

                      <Typography sx={{mb: 2}}>
                        Use open-ended questions to expose decision-making
                        rationale and technical understanding.
                      </Typography>

                      <List dense>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="Walk me through your approach to troubleshooting the Kafka producer shutdown issue"/>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="You mentioned 'eventual consistency'—what trade-offs did you consider?"/>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="What led you to choose that particular data structure?"/>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${COLORS.grey[200]}`,
                        height: '100%',
                      }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1"
                                  sx={{mb: 1.5, fontWeight: 500}}>
                        Scenario Adaptation
                      </Typography>

                      <Typography sx={{mb: 2}}>
                        Introduce hypothetical constraints to test adaptability
                        and deeper understanding.
                      </Typography>

                      <List dense>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="How would your solution change if the Kafka cluster were horizontally scaled?"/>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="What if we suddenly had a 10x increase in traffic to this service?"/>
                        </ListItem>
                        <ListItem>
                          <ListItemIcon sx={{minWidth: 36}}>
                            <QuestionIcon color="primary" fontSize="small"/>
                          </ListItemIcon>
                          <ListItemText
                              primary="Imagine we need to ensure exactly-once message processing. How would that change your approach?"/>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Typography variant="h6"
                          sx={{mb: 2, fontWeight: 500, fontSize: '1.05rem'}}>
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
                    {note: 'Notice how this quickly explores their thought process without dragging through a full debugging session. Look for structured thinking and clear communication.'},
                  ]}
              />
            </AccordionDetails>
          </Accordion>

          {/* Experience-Tailored Questions */}
          <Accordion
              expanded={expanded === 'panel3'}
              onChange={handleAccordionChange('panel3')}
              elevation={0}
              sx={{
                mb: 2,
                border: `1px solid ${COLORS.grey[200]}`,
                '&:before': {
                  display: 'none',
                },
              }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <SectionHeader
                  icon={<TimelineIcon/>}
                  title="Experience-Tailored Questions"
                  subtitle="Adjusting technical questioning based on experience level"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${COLORS.grey[200]}`,
                        height: '100%',
                        borderLeft: `4px solid ${theme.palette.primary.dark}`,
                      }}
                  >
                    <CardContent>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 1.5,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                      >
                        <Box component="span" sx={{
                          bgcolor: theme.palette.primary.dark,
                          color: '#fff',
                          fontSize: '0.75rem',
                          py: 0.3,
                          px: 1,
                          borderRadius: 1,
                          mr: 1,
                        }}>
                          MID-SENIOR
                        </Box>
                        Systems Design & Scaling
                      </Typography>

                      <Typography sx={{mb: 2}}>
                        Focus on architectural decisions, trade-offs, and
                        lessons from experience.
                      </Typography>

                      <DialogExample
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
                              you: false,
                              note: 'Look for practical experience, how they collaborated with others, and their ability to explain technical concepts in a conversational way.',
                            },
                          ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card
                      elevation={0}
                      sx={{
                        border: `1px solid ${COLORS.grey[200]}`,
                        height: '100%',
                        borderLeft: `4px solid ${theme.palette.primary.main}`,
                      }}
                  >
                    <CardContent>
                      <Typography
                          variant="subtitle1"
                          sx={{
                            mb: 1.5,
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                      >
                        <Box component="span" sx={{
                          bgcolor: theme.palette.primary.main,
                          color: '#fff',
                          fontSize: '0.75rem',
                          py: 0.3,
                          px: 1,
                          borderRadius: 1,
                          mr: 1,
                        }}>
                          JUNIOR
                        </Box>
                        Troubleshooting & Fundamentals
                      </Typography>

                      <Typography sx={{mb: 2}}>
                        Focus on fundamentals, problem-solving approach, and
                        willingness to learn.
                      </Typography>

                      <DialogExample
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
                              you: false,
                              note: 'Focus on their troubleshooting approach and logical progression through a problem, not specific technical details. Look for curiosity and eagerness to learn.',
                            },
                          ]}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Interaction Guidelines */}
          <Accordion
              expanded={expanded === 'panel4'}
              onChange={handleAccordionChange('panel4')}
              elevation={0}
              sx={{
                mb: 2,
                border: `1px solid ${COLORS.grey[200]}`,
                '&:before': {
                  display: 'none',
                },
              }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <SectionHeader
                  icon={<SupportIcon/>}
                  title="Effective Interaction Guidelines"
                  subtitle="Creating the right interview dynamic for accurate assessment"
              />
            </AccordionSummary>
            <AccordionDetails>
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
            </AccordionDetails>
          </Accordion>
        </Paper>
      </Box>
  );
};

export default BestPracticesPanel;