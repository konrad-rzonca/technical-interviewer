// src/components/InterviewPanel.js
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  Divider,
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
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

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
  const [hideAnsweredInRelated, setHideAnsweredInRelated] = useState(false);

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
  const handleLearningModeToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setLearningMode(!learningMode);
  };

  // Toggle hide answered questions
  const handleHideAnsweredToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setHideAnsweredQuestions(!hideAnsweredQuestions);
  };

  // Toggle hide answered in related
  const handleHideAnsweredInRelatedToggle = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    setHideAnsweredInRelated(!hideAnsweredInRelated);
  };

  // Handle settings menu
  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  // Get skill level color
  const getSkillLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#66bb6a'; // green
      case 'intermediate': return '#ffb300'; // amber/yellow - changed from #ffca28 to more intense #ffb300
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
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: { xs: '600px', sm: '700px', md: '800px' }
    }}>
      {/* Header (Minimal) */}
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar variant="dense" sx={{ minHeight: 48, justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'normal' }}>
            Technical Interviewer
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Settings Menu */}
            <Tooltip title="Settings">
              <IconButton
                size="small"
                onClick={handleSettingsMenuOpen}
                color="primary"
                sx={{ mr: 1 }}
              >
                <Badge
                  badgeContent={hideAnsweredQuestions || hideAnsweredInRelated || learningMode ? '1' : 0}
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

      {/* Settings Menu with improved styling and behavior */}
      <Menu
        anchorEl={settingsMenuAnchor}
        open={Boolean(settingsMenuAnchor)}
        onClose={handleSettingsMenuClose}
        PaperProps={{
          elevation: 3,
          style: {
            minWidth: 280,
            borderRadius: 8,
            padding: '8px 0'
          },
        }}
        MenuListProps={{
          style: {
            padding: 0
          }
        }}
      >
        {/* Settings Menu Title */}
        <Typography
          variant="subtitle2"
          sx={{
            p: 1.5,
            pl: 2,
            fontWeight: 500,
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            background: 'rgba(0, 0, 0, 0.02)'
          }}
        >
          Display Settings
        </Typography>

        {/* Learning Mode Toggle */}
        <MenuItem
          sx={{
            minWidth: 260,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.2,
            borderLeft: learningMode ? '3px solid #2196f3' : '3px solid transparent',
            backgroundColor: learningMode ? 'rgba(33, 150, 243, 0.04)' : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {learningMode ?
              <VisibilityOffIcon fontSize="small" sx={{ mr: 1.5, color: '#2196f3' }} /> :
              <VisibilityIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2">Learning Mode</Typography>
          </Box>
          <Switch
            checked={learningMode}
            size="small"
            color="primary"
            onClick={handleLearningModeToggle}
          />
        </MenuItem>

        {/* Question Visibility Section */}
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            px: 2,
            pt: 1.5,
            pb: 0.5,
            color: 'text.secondary',
            fontWeight: 500
          }}
        >
          QUESTION VISIBILITY
        </Typography>

        {/* Hide answered in Question Navigation - now using Switch */}
        <MenuItem
          sx={{
            minWidth: 260,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.2,
            px: 2,
            borderLeft: hideAnsweredQuestions ? '3px solid #2196f3' : '3px solid transparent',
            backgroundColor: hideAnsweredQuestions ? 'rgba(33, 150, 243, 0.04)' : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hideAnsweredQuestions ?
              <VisibilityOffOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: hideAnsweredQuestions ? '#2196f3' : 'text.secondary' }} /> :
              <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2">Hide answered in Navigation</Typography>
          </Box>
          <Switch
            checked={hideAnsweredQuestions}
            size="small"
            color="primary"
            onClick={handleHideAnsweredToggle}
          />
        </MenuItem>

        {/* Hide answered in Related Questions - now using Switch */}
        <MenuItem
          sx={{
            minWidth: 260,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.2,
            px: 2,
            borderLeft: hideAnsweredInRelated ? '3px solid #2196f3' : '3px solid transparent',
            backgroundColor: hideAnsweredInRelated ? 'rgba(33, 150, 243, 0.04)' : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hideAnsweredInRelated ?
              <VisibilityOffOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: hideAnsweredInRelated ? '#2196f3' : 'text.secondary' }} /> :
              <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2">Hide answered in Related Questions</Typography>
          </Box>
          <Switch
            checked={hideAnsweredInRelated}
            size="small"
            color="primary"
            onClick={handleHideAnsweredInRelatedToggle}
          />
        </MenuItem>
      </Menu>

      {/* Main Content - Three Column Layout */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        p: 2,
        // Change from fixed height to flexible with minimum height
        height: 'auto',
        minHeight: 'calc(100vh - 64px)',
        // Allow scrolling for smaller screens
        overflow: 'auto',
        '@media (max-height: 900px)': {
          minHeight: '600px',
          height: 'auto',
          overflow: 'auto'
        },
        // Add CSS containment to limit ResizeObserver scope
        contain: 'layout style',
        // Add maximum width constraint for very small screens
        maxWidth: '100vw',
        boxSizing: 'border-box'
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
            border: '1px solid #cccccc', // Changed from #e0e0e0 to more intense #cccccc
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
          hideAnswered={hideAnsweredInRelated} // Pass the filter setting
        />
      </Box>
    </Box>
  );
};

export default InterviewPanel;