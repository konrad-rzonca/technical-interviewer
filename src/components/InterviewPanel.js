// src/components/InterviewPanel.js
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  categories,
  getCategoryForQuestion,
  getFilteredQuestions,
  getQuestionsByCategory,
  getQuestionSets,
  getRelatedQuestions
} from '../data/questionLoader';
import AnswerLevelHorizontal from './AnswerLevelHorizontal';

const InterviewPanel = ({ interviewState, updateInterviewState }) => {
  const { currentQuestion, notesMap, gradesMap } = interviewState;

  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [relatedQuestionsList, setRelatedQuestionsList] = useState([]);
  const [setMenuAnchor, setSetMenuAnchor] = useState(null);
  const [availableSets, setAvailableSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState({});
  const [learningMode, setLearningMode] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [hideAnsweredQuestions, setHideAnsweredQuestions] = useState(false);

  // Initialize active categories
  useEffect(() => {
    setActiveCategories(categories);

    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, []);

  // Initialize subcategory selection
  useEffect(() => {
    const initialSelectedSubcategories = {};

    categories.forEach(category => {
      if (category.subcategories.length > 0) {
        initialSelectedSubcategories[category.id] = {};
        category.subcategories.forEach(subcategory => {
          initialSelectedSubcategories[category.id][subcategory] = true;
        });
      }
    });

    setSelectedSubcategories(initialSelectedSubcategories);
  }, []);

  // Load available question sets for the selected category
  useEffect(() => {
    if (selectedCategory) {
      const sets = getQuestionSets(selectedCategory);
      setAvailableSets(sets);

      // Initialize all sets as selected by default
      const initialSelection = {};
      sets.forEach(set => {
        initialSelection[set.id] = true;
      });
      setSelectedSets(initialSelection);
    }
  }, [selectedCategory]);

  // Load questions based on selected category, subcategories, and sets
  useEffect(() => {
    if (selectedCategory) {
      // Get the list of selected set IDs
      const activeSets = Object.entries(selectedSets)
        .filter(([_, isSelected]) => isSelected)
        .map(([setId, _]) => setId);

      // Filter questions
      let baseQuestions;

      if (subcategoryFilter) {
        // Filter by specific subcategory if selected
        baseQuestions = getFilteredQuestions(selectedCategory, subcategoryFilter);
      } else if (selectedSubcategories[selectedCategory]) {
        // Filter by multiple selected subcategories
        const activeSubcategories = Object.entries(selectedSubcategories[selectedCategory])
          .filter(([_, isSelected]) => isSelected)
          .map(([subcategory, _]) => subcategory);

        if (activeSubcategories.length > 0) {
          // Get questions from all active subcategories
          baseQuestions = [];
          activeSubcategories.forEach(subcategory => {
            const subcategoryQuestions = getFilteredQuestions(selectedCategory, subcategory);
            baseQuestions.push(...subcategoryQuestions);
          });
        } else {
          baseQuestions = [];
        }
      } else {
        // Get all questions for the category if no subcategory filtering
        baseQuestions = getQuestionsByCategory(selectedCategory);
      }

      // Use a brand new array to ensure React detects state change
      setQuestions(Array.from(baseQuestions));

      // If we have questions but no current question selected, select the first one
      if (baseQuestions.length > 0 && !currentQuestion) {
        updateInterviewState({ currentQuestion: baseQuestions[0] });
      }
    } else {
      // If no category is selected, clear questions
      setQuestions([]);
    }
  }, [selectedCategory, selectedSets, selectedSubcategories, subcategoryFilter]);

  // Apply additional filters (hide answered questions)
  useEffect(() => {
    if (hideAnsweredQuestions) {
      const filtered = questions.filter(question => !gradesMap[question.id]);
      setFilteredQuestions(filtered);

      // If current question is filtered out, select first visible question
      if (filtered.length > 0 && currentQuestion && gradesMap[currentQuestion.id]) {
        updateInterviewState({ currentQuestion: filtered[0] });
      }
    } else {
      setFilteredQuestions(questions);
    }
  }, [questions, hideAnsweredQuestions, gradesMap, currentQuestion]);

  // Load related questions when current question changes
  useEffect(() => {
    if (currentQuestion) {
      const related = getRelatedQuestions(currentQuestion.id);
      // Filter out any questions that point to themselves
      const filteredRelated = related.filter(q => q.id !== currentQuestion.id);
      setRelatedQuestionsList(filteredRelated);
    }
  }, [currentQuestion]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategory) {
      // Toggle expansion if the category is already selected
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
      return;
    }

    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);
    setExpandedCategory(category && category.subcategories.length > 0 ? categoryId : null);
    setSubcategoryFilter(null);
    updateInterviewState({ currentQuestion: null });
  };

  // Toggle a single subcategory selection
  const handleSubcategorySelect = (subcategory) => {
    // If we have an active filter, change to this subcategory
    if (subcategoryFilter === subcategory) {
      setSubcategoryFilter(null);
    } else {
      setSubcategoryFilter(subcategory);
    }
  };

  // Toggle a subcategory's checked state
  const handleSubcategoryToggle = (categoryId, subcategory) => {
    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [subcategory]: !prev[categoryId][subcategory]
      }
    }));
    setSubcategoryFilter(null); // Clear any active filter
  };

  // Handle question selection
  const handleQuestionSelect = (question) => {
    // Find the category for this question
    const category = getCategoryForQuestion(question);

    if (category && category.id !== selectedCategory) {
      // If question is from a different category, update category selection
      setSelectedCategory(category.id);
    }

    updateInterviewState({ currentQuestion: question });
  };

  // Navigate to next/previous question
  const navigateQuestion = (direction) => {
    if (!currentQuestion || filteredQuestions.length <= 1) return;

    const currentIndex = filteredQuestions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= filteredQuestions.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? filteredQuestions.length - 1 : currentIndex - 1;
    }

    updateInterviewState({ currentQuestion: filteredQuestions[newIndex] });
  };

  // Handle notes change
  const handleNotesChange = (event) => {
    if (!currentQuestion) return;

    updateInterviewState({
      notesMap: {
        ...notesMap,
        [currentQuestion.id]: event.target.value
      }
    });
  };

  // Handle grade change
  const handleGradeChange = (event, newValue) => {
    if (!currentQuestion) return;

    updateInterviewState({
      gradesMap: {
        ...gradesMap,
        [currentQuestion.id]: newValue
      }
    });
  };

  // Toggle learning mode
  const handleLearningModeToggle = () => {
    setLearningMode(!learningMode);
  };

  // Handle settings menu
  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  // Toggle hide answered questions
  const handleToggleHideAnswered = () => {
    setHideAnsweredQuestions(!hideAnsweredQuestions);
    handleSettingsMenuClose();
  };

  // Get skill level color - completely redesigned color scheme
  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#66bb6a'; // green
      case 'intermediate': return '#ffca28'; // amber/yellow
      case 'advanced': return '#fb8c00'; // deeper orange (no red)
      default: return '#9e9e9e'; // gray
    }
  };

  // Handle set menu open/close
  const handleSetMenuOpen = (event) => {
    setSetMenuAnchor(event.currentTarget);
  };

  const handleSetMenuClose = () => {
    setSetMenuAnchor(null);
  };

  // Handle set selection changes
  const handleSetToggle = (setId) => {
    setSelectedSets(prev => ({
      ...prev,
      [setId]: !prev[setId]
    }));
  };

  // Handle select all sets
  const handleSelectAllSets = () => {
    const newSelection = {};
    availableSets.forEach(set => {
      newSelection[set.id] = true;
    });
    setSelectedSets(newSelection);
  };

  // Handle deselect all sets
  const handleDeselectAllSets = () => {
    const newSelection = {};
    availableSets.forEach(set => {
      newSelection[set.id] = false;
    });
    setSelectedSets(newSelection);
  };

  // Count selected sets
  const selectedSetCount = Object.values(selectedSets).filter(Boolean).length;

  // Select all subcategories for a category
  const handleSelectAllSubcategories = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newSelection = {};
    category.subcategories.forEach(subcategory => {
      newSelection[subcategory] = true;
    });

    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: newSelection
    }));

    setSubcategoryFilter(null);
  };

  // Deselect all subcategories for a category
  const handleDeselectAllSubcategories = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newSelection = {};
    category.subcategories.forEach(subcategory => {
      newSelection[subcategory] = false;
    });

    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: newSelection
    }));

    setSubcategoryFilter(null);
  };

  // Count answered questions
  const answeredCount = Object.keys(gradesMap).length;
  const totalQuestions = filteredQuestions.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100vh' }}>
      {/* Header (Minimal) */}
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar variant="dense" sx={{ minHeight: 48, justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
            Technical Interview
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Learning Mode Toggle */}
            <Tooltip title="Learning Mode: Hide answer details until hover">
              <FormControlLabel
                control={
                  <Switch
                    checked={learningMode}
                    onChange={handleLearningModeToggle}
                    size="small"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {learningMode ?
                      <VisibilityOffIcon fontSize="small" sx={{ mr: 0.5 }} /> :
                      <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
                    }
                    <Typography variant="body2">Learning Mode</Typography>
                  </Box>
                }
                sx={{ mr: 2 }}
              />
            </Tooltip>

            {/* Settings Menu */}
            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={handleSettingsMenuOpen}
                color="primary"
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={hideAnsweredQuestions ? '1' : 0}
                  color="primary"
                  variant="dot"
                >
                  <SettingsIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={handleSettingsMenuClose}
      >
        <MenuItem
          onClick={handleToggleHideAnswered}
          sx={{
            minWidth: 200,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="body2">Hide answered questions</Typography>
          <Checkbox
            checked={hideAnsweredQuestions}
            size="small"
            inputProps={{ 'aria-label': 'Hide answered questions' }}
          />
        </MenuItem>
      </Menu>

      {/* Main Content - Three Column Layout */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        p: 2,
        height: 'calc(100vh - 64px)'
      }}>
        {/* Left Sidebar - Categories (Wider Width) */}
        <Paper
          elevation={0}
          sx={{
            width: 300,
            minWidth: 300,
            maxWidth: 300,
            mr: 2,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'auto'
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Categories
          </Typography>

          {activeCategories.map((category) => (
            <Box key={category.id}>
              <Box
                onClick={() => handleCategorySelect(category.id)}
                sx={{
                  p: 1.5,
                  mb: 0.5,
                  borderRadius: 1,
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === category.id ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                  border: selectedCategory === category.id ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid transparent',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1">{category.name}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Sets dropdown */}
                  <Tooltip title="Select Question Sets">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategorySelect(category.id);
                        handleSetMenuOpen(e);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <FolderOpenIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Expand/collapse if it has subcategories */}
                  {category.subcategories.length > 0 && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedCategory(expandedCategory === category.id ? null : category.id);
                      }}
                    >
                      {expandedCategory === category.id ?
                        <ExpandLessIcon fontSize="small" /> :
                        <ExpandMoreIcon fontSize="small" />
                      }
                    </IconButton>
                  )}
                </Box>
              </Box>

              {/* Subcategories collapsible section */}
              {category.subcategories.length > 0 && (
                <Collapse
                  in={expandedCategory === category.id}
                  timeout={0} // Set timeout to 0 to disable animation
                  unmountOnExit // Fully unmount when collapsed for better performance
                >
                  <List dense sx={{ ml: 2, mt: 0, mb: 1 }}>
                    <ListItem
                      dense
                      sx={{ p: 0, mb: 0.5 }}
                    >
                      <Button
                        size="small"
                        onClick={() => handleSelectAllSubcategories(category.id)}
                        sx={{ mr: 1, minWidth: 'auto', fontSize: '0.7rem' }}
                      >
                        All
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleDeselectAllSubcategories(category.id)}
                        sx={{ minWidth: 'auto', fontSize: '0.7rem' }}
                      >
                        None
                      </Button>
                    </ListItem>

                    {category.subcategories.map((subcategory) => (
                      <ListItem
                        key={subcategory}
                        dense
                        sx={{
                          p: 0,
                          mb: 0.5,
                          bgcolor: subcategoryFilter === subcategory ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                          borderRadius: 1
                        }}
                      >
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          justifyContent: 'space-between',
                          pr: 1 // Extra padding on the right
                        }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flex: 1,
                              p: 0.5,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                                borderRadius: 1
                              }
                            }}
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                              {subcategory}
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: 28 }}>
                            <Checkbox
                              size="small"
                              checked={selectedSubcategories[category.id]?.[subcategory] || false}
                              onChange={() => handleSubcategoryToggle(category.id, subcategory)}
                              onClick={(e) => e.stopPropagation()}
                              sx={{ p: 0.5 }}
                            />
                          </Box>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}

          {/* Question Sets Selection Menu */}
          <Menu
            anchorEl={setMenuAnchor}
            open={Boolean(setMenuAnchor)}
            onClose={handleSetMenuClose}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: 300,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                Question Sets ({selectedSetCount}/{availableSets.length})
              </Typography>
              <Box>
                <Button
                  size="small"
                  onClick={handleSelectAllSets}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  All
                </Button>
                <Button
                  size="small"
                  onClick={handleDeselectAllSets}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  None
                </Button>
              </Box>
            </Box>
            <Divider />
            {availableSets.map((set) => (
              <MenuItem
                key={set.id}
                dense
                onClick={() => handleSetToggle(set.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedSets[set.id] || false}
                    tabIndex={-1}
                    disableRipple
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={set.name} />
              </MenuItem>
            ))}
            {availableSets.length === 0 && (
              <MenuItem disabled>
                <ListItemText primary="No question sets in this category" />
              </MenuItem>
            )}
          </Menu>
        </Paper>

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            flexGrow: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'auto'
          }}
        >
          {/* Questions navigation (horizontal) */}
          {filteredQuestions.length > 0 && (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              mb: 3
            }}>
              {filteredQuestions.map((question) => {
                const isAnswered = gradesMap[question.id] !== undefined;

                return (
                  <Tooltip
                    key={question.id}
                    title={
                      <Box>
                        <Typography sx={{ fontSize: '1rem', p: 1 }}>
                          {question.question}
                        </Typography>
                        {isAnswered && (
                          <Typography sx={{ fontSize: '0.8rem', p: 0.5, color: '#66bb6a' }}>
                            Answered with rating: {gradesMap[question.id]}
                          </Typography>
                        )}
                      </Box>
                    }
                    placement="top"
                    arrow
                  >
                    <Box
                      onClick={() => handleQuestionSelect(question)}
                      sx={{
                        p: 1.5,
                        m: 0.5,
                        borderRadius: 1,
                        cursor: 'pointer',
                        backgroundColor: currentQuestion && currentQuestion.id === question.id
                          ? 'rgba(33, 150, 243, 0.08)'
                          : (isAnswered ? 'rgba(102, 187, 106, 0.05)' : 'white'),
                        border: currentQuestion && currentQuestion.id === question.id
                          ? '1px solid rgba(33, 150, 243, 0.2)'
                          : (isAnswered ? '1px solid rgba(102, 187, 106, 0.2)' : '1px solid #e0e0e0'),
                        minWidth: 180,
                        maxWidth: 230,
                        position: 'relative',
                        paddingLeft: '24px',
                        paddingRight: isAnswered ? '24px' : '8px',
                        '&:hover': {
                          backgroundColor: currentQuestion && currentQuestion.id === question.id
                            ? 'rgba(33, 150, 243, 0.12)'
                            : 'rgba(33, 150, 243, 0.04)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }
                      }}
                    >
                      {/* Skill level indicator circle */}
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: getSkillLevelColor(question.skillLevel),
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
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        {/* Use short title if available */}
                        {question.shortTitle || question.question.split(' ').slice(0, 5).join(' ')}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          )}

          {/* Current Question Content */}
          {currentQuestion ? (
            <Box>
              {/* Question header with navigation and full question */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <IconButton
                  size="small"
                  onClick={() => navigateQuestion('prev')}
                >
                  <KeyboardArrowLeftIcon />
                </IconButton>

                <Typography variant="h6" sx={{ textAlign: 'center', flexGrow: 1 }}>
                  {currentQuestion.question}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() => navigateQuestion('next')}
                >
                  <KeyboardArrowRightIcon />
                </IconButton>
              </Box>

              {/* Answer insights horizontal layout */}
              <AnswerLevelHorizontal
                answerInsights={currentQuestion.answerInsights}
                learningMode={learningMode}
              />

              {/* Notes and Rating */}
              <Box sx={{ mt: 4 }}>
                <Divider sx={{ mb: 2 }} />

                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                  Candidate Evaluation
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2, color: 'text.secondary' }}>
                    Rating:
                  </Typography>
                  <Rating
                    name={`grade-${currentQuestion.id}`}
                    value={gradesMap[currentQuestion.id] || 0}
                    onChange={handleGradeChange}
                  />
                </Box>

                <TextField
                  placeholder="Add notes about candidate's response..."
                  multiline
                  rows={3}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={notesMap[currentQuestion.id] || ''}
                  onChange={handleNotesChange}
                />
              </Box>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 300
            }}>
              <Typography variant="subtitle1" color="text.secondary">
                Select a question to begin
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Right Sidebar - Related Questions (Wider Width) */}
        <Paper
          elevation={0}
          sx={{
            width: 350,
            minWidth: 350,
            maxWidth: 350,
            ml: 2,
            p: 2,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'auto',
            display: 'block'
          }}
        >
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
            Related Questions
          </Typography>

          {relatedQuestionsList.length > 0 ? (
            relatedQuestionsList.map((relatedQ) => {
              // Determine if this question has been answered
              const isAnswered = gradesMap[relatedQ.id] !== undefined;
              // Get category info
              const categoryObj = categories.find(c => c.id === relatedQ.categoryId) || {};
              const categoryName = categoryObj.name || '';

              return (
                <Tooltip
                  key={relatedQ.id}
                  title={
                    <Box>
                      <Typography sx={{ fontSize: '1rem', p: 1 }}>
                        {relatedQ.question}
                      </Typography>
                      {isAnswered && (
                        <Typography sx={{ fontSize: '0.8rem', p: 0.5, color: '#66bb6a' }}>
                          Answered with rating: {gradesMap[relatedQ.id]}
                        </Typography>
                      )}
                    </Box>
                  }
                  placement="left"
                  arrow
                >
                  <Box
                    onClick={() => handleQuestionSelect(relatedQ)}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      borderRadius: 1,
                      cursor: 'pointer',
                      position: 'relative',
                      paddingLeft: '24px',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                      },
                      borderLeft: `3px solid ${getSkillLevelColor(relatedQ.skillLevel)}`,
                      // Add subtle background if answered
                      backgroundColor: isAnswered ? 'rgba(102, 187, 106, 0.05)' : 'transparent'
                    }}
                  >
                    {/* Answered indicator - checkmark */}
                    {isAnswered && (
                      <Box
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: '#66bb6a'
                        }}
                      >
                        <CheckCircleIcon fontSize="small" style={{ fontSize: '14px' }} />
                      </Box>
                    )}

                    <Typography variant="body2" sx={{ textAlign: 'left' }}>
                      {relatedQ.shortTitle || relatedQ.question.split(' ').slice(0, 5).join(' ')}
                    </Typography>

                    {/* Category indicator */}
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        mt: 0.5,
                        opacity: 0.7
                      }}
                    >
                      {categoryName} • {relatedQ.subcategoryName}
                    </Typography>
                  </Box>
                </Tooltip>
              );
            })
          ) : (
            <Typography variant="body2" color="text.secondary">
              No related questions for this topic
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default InterviewPanel;