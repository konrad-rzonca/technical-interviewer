// src/components/InterviewPanel.js
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  Paper
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SettingsIcon from '@mui/icons-material/Settings';

import {
  categories,
  getCategoryForQuestion,
  getFilteredQuestions,
  getQuestionsByCategory,
  getQuestionSets,
  getRelatedQuestions
} from '../data/questionLoader';

import CategorySidebar from './CategorySidebar';
import QuestionDetailsPanel from './QuestionDetailsPanel';
import QuestionNavigation from './QuestionNavigation';
import RelatedQuestionsSidebar from './RelatedQuestionsSidebar';

const InterviewPanel = ({ interviewState, updateInterviewState }) => {
  const { currentQuestion, notesMap, gradesMap } = interviewState;

  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [relatedQuestionsList, setRelatedQuestionsList] = useState([]);
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
  }, [selectedCategory, selectedSets, selectedSubcategories, subcategoryFilter, currentQuestion, updateInterviewState]);

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
  }, [questions, hideAnsweredQuestions, gradesMap, currentQuestion, updateInterviewState]);

  // Load related questions when current question changes
  useEffect(() => {
    if (currentQuestion) {
      const related = getRelatedQuestions(currentQuestion.id);
      // Filter out any questions that point to themselves
      const filteredRelated = related.filter(q => q.id !== currentQuestion.id);

      // Enhance related questions with category name information
      const enhancedRelated = filteredRelated.map(q => {
        const categoryObj = categories.find(c => c.id === q.categoryId) || {};
        return {
          ...q,
          categoryName: categoryObj.name || ''
        };
      });

      setRelatedQuestionsList(enhancedRelated);
    }
  }, [currentQuestion]);

  // Handle category selection
  const handleCategorySelect = (categoryId, explicitExpandedState = null) => {
    if (categoryId === selectedCategory) {
      // Toggle expansion if the category is already selected
      setExpandedCategory(explicitExpandedState !== null ? explicitExpandedState :
        (expandedCategory === categoryId ? null : categoryId));
      return;
    }

    setSelectedCategory(categoryId);
    const category = categories.find(c => c.id === categoryId);

    // If explicitExpandedState is provided, use it, otherwise use default logic
    if (explicitExpandedState !== null) {
      setExpandedCategory(explicitExpandedState);
    } else {
      setExpandedCategory(category && category.subcategories.length > 0 ? categoryId : null);
    }

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
  const handleNavigateQuestion = (direction) => {
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
  const handleNotesChange = (questionId, value) => {
    updateInterviewState({
      notesMap: {
        ...notesMap,
        [questionId]: value
      }
    });
  };

  // Handle grade change
  const handleGradeChange = (questionId, value) => {
    updateInterviewState({
      gradesMap: {
        ...gradesMap,
        [questionId]: value
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
        height: 'calc(100vh - 64px)',
        overflow: 'hidden' // Prevent outer container from scrolling
      }}>
        {/* Left Sidebar - Categories */}
        <CategorySidebar
          categories={activeCategories}
          selectedCategory={selectedCategory}
          expandedCategory={expandedCategory}
          selectedSubcategories={selectedSubcategories}
          subcategoryFilter={subcategoryFilter}
          availableSets={availableSets}
          selectedSets={selectedSets}
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          onSubcategoryToggle={handleSubcategoryToggle}
          onSelectAllSubcategories={handleSelectAllSubcategories}
          onDeselectAllSubcategories={handleDeselectAllSubcategories}
          onSetToggle={handleSetToggle}
          onSelectAllSets={handleSelectAllSets}
          onDeselectAllSets={handleDeselectAllSets}
        />

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            flexGrow: 1,
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            overflow: 'hidden', // Prevent entire content area from scrolling
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Question Details Panel - placed at the top */}
          <QuestionDetailsPanel
            currentQuestion={currentQuestion}
            notesMap={notesMap}
            gradesMap={gradesMap}
            learningMode={learningMode}
            onNotesChange={handleNotesChange}
            onGradeChange={handleGradeChange}
            onNavigateQuestion={handleNavigateQuestion}
          />

          {/* Question Navigation below the question details */}
          <QuestionNavigation
            filteredQuestions={filteredQuestions}
            currentQuestion={currentQuestion}
            gradesMap={gradesMap}
            onQuestionSelect={handleQuestionSelect}
            getSkillLevelColor={getSkillLevelColor}
          />
        </Paper>

        {/* Right Sidebar - Related Questions */}
        <RelatedQuestionsSidebar
          relatedQuestionsList={relatedQuestionsList}
          gradesMap={gradesMap}
          onQuestionSelect={handleQuestionSelect}
          getSkillLevelColor={getSkillLevelColor}
        />
      </Box>
    </Box>
  );
};

export default InterviewPanel;