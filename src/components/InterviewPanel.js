// src/components/InterviewPanel.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  Divider,
  TextField,
  Rating,
  IconButton,
  Tooltip,
  Menu,
  ListItemText,
  Checkbox,
  ListItemIcon,
  Button,
  Switch,
  FormControlLabel
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
  languages,
  getCategoriesForLanguage,
  getFilteredQuestions,
  getRelatedQuestions,
  getQuestionsByLanguage,
  getCategoryForQuestion,
  getFileNamesForCategory,
  getQuestionsFromFile
} from '../data/questionLoader';
import AnswerLevelHorizontal from './AnswerLevelHorizontal';

const InterviewPanel = ({ interviewState, updateInterviewState }) => {
  const { selectedLanguage, currentQuestion, notesMap, gradesMap } = interviewState;

  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [relatedQuestionsList, setRelatedQuestionsList] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [learningMode, setLearningMode] = useState(false);

  // Load all available categories for the selected language
  useEffect(() => {
    const availableCategories = getCategoriesForLanguage(selectedLanguage);
    setActiveCategories(availableCategories);

    if (availableCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(availableCategories[0].id);
    }
  }, [selectedLanguage]);

  // Load available files for the selected category
  useEffect(() => {
    if (selectedCategory) {
      const files = getFileNamesForCategory(selectedLanguage, selectedCategory);
      setAvailableFiles(files);

      // Initialize all files as selected by default
      const initialSelection = {};
      files.forEach(file => {
        initialSelection[file] = true;
      });
      setSelectedFiles(initialSelection);
    }
  }, [selectedLanguage, selectedCategory]);

  // Load questions based on selected category and files
  useEffect(() => {
    if (selectedCategory) {
      // Get the list of selected file IDs
      const activeFiles = Object.entries(selectedFiles)
        .filter(([_, isSelected]) => isSelected)
        .map(([fileName, _]) => fileName);

      // For simplicity in this demo, we'll load all questions for the category
      // In a real app, you'd filter by selected files
      const filteredQuestions = getFilteredQuestions(selectedLanguage, selectedCategory);

      // Use a brand new array to ensure React detects state change
      setQuestions(Array.from(filteredQuestions));

      // If we have questions but no current question selected, select the first one
      if (filteredQuestions.length > 0 && !currentQuestion) {
        updateInterviewState({ currentQuestion: filteredQuestions[0] });
      }
    } else {
      // If no category is selected, load all questions for the language
      const allQuestions = getQuestionsByLanguage(selectedLanguage);
      setQuestions(Array.from(allQuestions));

      if (allQuestions.length > 0 && !currentQuestion) {
        updateInterviewState({ currentQuestion: allQuestions[0] });
      }
    }
  }, [selectedCategory, selectedLanguage, selectedFiles]);

  // Load related questions when current question changes
  useEffect(() => {
    if (currentQuestion) {
      const related = getRelatedQuestions(currentQuestion.id);
      // Filter out any questions that point to themselves
      const filteredRelated = related.filter(q => q.id !== currentQuestion.id);
      setRelatedQuestionsList(filteredRelated);
    }
  }, [currentQuestion]);

  // Handle language change (minimal UI)
  const handleLanguageChange = (event) => {
    updateInterviewState({
      selectedLanguage: event.target.value,
      currentQuestion: null
    });
    setSelectedCategory('');
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    if (categoryId === selectedCategory) return; // Don't reload if category is already selected

    setSelectedCategory(categoryId);
    updateInterviewState({ currentQuestion: null });
  };

  // Handle question selection
  const handleQuestionSelect = (question) => {
    // Find the category for this question
    const category = getCategoryForQuestion(question, selectedLanguage);

    if (category && category.id !== selectedCategory) {
      // If question is from a different category, update category selection
      setSelectedCategory(category.id);
    }

    updateInterviewState({ currentQuestion: question });
  };

  // Navigate to next/previous question
  const navigateQuestion = (direction) => {
    if (!currentQuestion || questions.length <= 1) return;

    const currentIndex = questions.findIndex(q => q.id === currentQuestion.id);
    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = currentIndex + 1 >= questions.length ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex - 1 < 0 ? questions.length - 1 : currentIndex - 1;
    }

    updateInterviewState({ currentQuestion: questions[newIndex] });
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

  // Get skill level color
  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#4caf50'; // green
      case 'intermediate': return '#ff9800'; // orange
      case 'advanced': return '#f44336'; // red
      default: return '#757575'; // gray
    }
  };

  // Handle file menu open/close
  const handleFileMenuOpen = (event) => {
    setFileMenuAnchor(event.currentTarget);
  };

  const handleFileMenuClose = () => {
    setFileMenuAnchor(null);
  };

  // Handle file selection changes
  const handleFileToggle = (fileName) => {
    setSelectedFiles(prev => ({
      ...prev,
      [fileName]: !prev[fileName]
    }));
  };

  // Handle select all files
  const handleSelectAllFiles = () => {
    const newSelection = {};
    availableFiles.forEach(file => {
      newSelection[file] = true;
    });
    setSelectedFiles(newSelection);
  };

  // Handle deselect all files
  const handleDeselectAllFiles = () => {
    const newSelection = {};
    availableFiles.forEach(file => {
      newSelection[file] = false;
    });
    setSelectedFiles(newSelection);
  };

  // Count selected files
  const selectedFileCount = Object.values(selectedFiles).filter(Boolean).length;

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

            {/* Language selector */}
            <FormControl
              variant="standard"
              size="small"
              sx={{ minWidth: 100 }}
              className="language-selector"
            >
              <Select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Select language' }}
              >
                {languages.filter(l => l.enabled).map((language) => (
                  <MenuItem key={language.id} value={language.id}>
                    {language.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content - Three Column Layout */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        p: 2,
        height: 'calc(100vh - 64px)'
      }}>
        {/* Left Sidebar - Categories (Fixed Width) */}
        <Paper
          elevation={0}
          sx={{
            width: 250,
            minWidth: 250,
            maxWidth: 250,
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
                  mb: 1,
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
                <Typography variant="body1">{category.name}</Typography>

                {/* Files dropdown */}
                <Tooltip title="Select Files">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect(category.id);
                      handleFileMenuOpen(e);
                    }}
                  >
                    <FolderOpenIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}

          {/* Files Selection Menu */}
          <Menu
            anchorEl={fileMenuAnchor}
            open={Boolean(fileMenuAnchor)}
            onClose={handleFileMenuClose}
            PaperProps={{
              style: {
                maxHeight: 300,
                width: 250,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                Files ({selectedFileCount}/{availableFiles.length})
              </Typography>
              <Box>
                <Button
                  size="small"
                  onClick={handleSelectAllFiles}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  All
                </Button>
                <Button
                  size="small"
                  onClick={handleDeselectAllFiles}
                  sx={{ minWidth: 'auto', px: 1 }}
                >
                  None
                </Button>
              </Box>
            </Box>
            <Divider />
            {availableFiles.map((file, index) => (
              <MenuItem
                key={index}
                dense
                onClick={() => handleFileToggle(file)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedFiles[file] || false}
                    tabIndex={-1}
                    disableRipple
                    size="small"
                  />
                </ListItemIcon>
                <ListItemText primary={file} />
              </MenuItem>
            ))}
            {availableFiles.length === 0 && (
              <MenuItem disabled>
                <ListItemText primary="No files in this category" />
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
          {questions.length > 0 && (
            <Box sx={{
              display: 'flex',
              flexWrap: 'wrap',
              mb: 3
            }}>
              {questions.map((question) => (
                <Tooltip
                  key={question.id}
                  title={
                    <Typography sx={{ fontSize: '1rem', p: 1 }}>
                      {question.question}
                    </Typography>
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
                      backgroundColor: currentQuestion && currentQuestion.id === question.id ? 'rgba(33, 150, 243, 0.08)' : 'white',
                      border: currentQuestion && currentQuestion.id === question.id ? '1px solid rgba(33, 150, 243, 0.2)' : '1px solid #e0e0e0',
                      minWidth: 180,
                      maxWidth: 230,
                      position: 'relative',
                      paddingLeft: '24px',
                      '&:hover': {
                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
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
              ))}
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

        {/* Right Sidebar - Related Questions (Fixed Width) */}
        <Paper
          elevation={0}
          sx={{
            width: 300,
            minWidth: 300,
            maxWidth: 300,
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
            relatedQuestionsList.map((relatedQ) => (
              <Tooltip
                key={relatedQ.id}
                title={
                  <Typography sx={{ fontSize: '1rem', p: 1 }}>
                    {relatedQ.question}
                  </Typography>
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
                    borderLeft: `3px solid ${getSkillLevelColor(relatedQ.skillLevel)}`
                  }}
                >
                  <Typography variant="body2" sx={{ textAlign: 'left' }}>
                    {relatedQ.shortTitle || relatedQ.question.split(' ').slice(0, 5).join(' ')}
                  </Typography>
                </Box>
              </Tooltip>
            ))
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