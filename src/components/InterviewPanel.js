// src/components/InterviewPanel.js
import CategoryIcon from '@mui/icons-material/Category';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinkIcon from '@mui/icons-material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SettingsIcon from '@mui/icons-material/Settings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {
  AppBar,
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
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

import { usePanelStyles } from '../utils/styleHooks';
import { COLORS, LAYOUT } from '../utils/theme';
import CategorySidebar from './CategorySidebar';
import QuestionDetailsPanel from './QuestionDetailsPanel';
import QuestionNavigation from './QuestionNavigation';
import RelatedQuestionsSidebar from './RelatedQuestionsSidebar';
import SidebarPanel from './SidebarPanel';

const InterviewPanel = ({ interviewState, updateInterviewState }) => {
  const { currentQuestion, notesMap, gradesMap } = interviewState;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Sidebar collapse state
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Mobile navigation view
  const [mobileView, setMobileView] = useState('question'); // 'category', 'question', 'related'

  // Original state
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

  // Mobile drawer state
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Get panel styles from hooks
  const mainPanelStyles = usePanelStyles(false, true, {
    flexGrow: 1,
    p: 3,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ml: !isMobile && leftSidebarCollapsed ? 10 : 0,
    mr: !isMobile && rightSidebarCollapsed ? 10 : 0,
    width: isMobile ? 'calc(100% - 24px)' : 'auto',
    transition: 'margin 0.3s ease, width 0.3s ease',
    display: isMobile ? (mobileView === 'question' ? 'flex' : 'none') : 'flex',
  });

  // Responsive sidebar management
  useEffect(() => {
    if (isMobile) {
      setLeftSidebarCollapsed(true);
      setRightSidebarCollapsed(true);
    } else if (isTablet) {
      setRightSidebarCollapsed(true);
      setLeftSidebarCollapsed(false);
    } else {
      // On wide screens, always expand sidebars
      setLeftSidebarCollapsed(false);
      setRightSidebarCollapsed(false);
    }
  }, [isMobile, isTablet]);

  // Sidebar toggle handlers
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(!leftSidebarCollapsed);
  const toggleRightSidebar = () => setRightSidebarCollapsed(!rightSidebarCollapsed);

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

  // Handle mobile view changes
  useEffect(() => {
    if (isMobile) {
      if (mobileView === 'category') {
        setLeftSidebarCollapsed(false);
        setRightSidebarCollapsed(true);
      } else if (mobileView === 'related') {
        setLeftSidebarCollapsed(true);
        setRightSidebarCollapsed(false);
      } else {
        setLeftSidebarCollapsed(true);
        setRightSidebarCollapsed(true);
      }
    }
  }, [mobileView, isMobile]);

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

    // In mobile, switch to question view after selecting a category
    if (isMobile) {
      setMobileView('question');
    }
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

    // In mobile, switch to question view after selecting a question
    if (isMobile) {
      setMobileView('question');
    }
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

  // Sidebar toggle button styles
  const sidebarToggleButtonStyle = (position, isCollapsed, width) => ({
    position: 'fixed',
    [position]: isCollapsed ? width + 10 : LAYOUT.LEFT_SIDEBAR_WIDTH + 10,
    top: '50%',
    transform: 'translateY(-50%)',
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    zIndex: theme.zIndex.drawer - 100,
    transition: `${position} 0.3s ease`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: 40,
    height: 40,
    '&:hover': {
      bgcolor: 'primary.light',
    }
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      minHeight: { xs: '600px', sm: '700px', md: '800px' }
    }}>
      {/* Header (Modified for mobile) */}
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar variant="dense" sx={{ minHeight: 56, justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

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
            minWidth: 320,
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
            minWidth: 320,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.5,
            borderLeft: learningMode ? `3px solid ${COLORS.primary.main}` : '3px solid transparent',
            backgroundColor: learningMode ? `${COLORS.primary.main}04` : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {learningMode ?
              <VisibilityOffIcon fontSize="medium" sx={{ mr: 1.5, color: COLORS.primary.main }} /> :
              <VisibilityIcon fontSize="medium" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Learning Mode</Typography>
          </Box>
          <Switch
            checked={learningMode}
            size="medium"
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
            fontWeight: 500,
            fontSize: '0.95rem'
          }}
        >
          QUESTION VISIBILITY
        </Typography>

        {/* Hide answered in Question Navigation - now using Switch */}
        <MenuItem
          sx={{
            minWidth: 320,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.5,
            px: 2,
            borderLeft: hideAnsweredQuestions ? `3px solid ${COLORS.primary.main}` : '3px solid transparent',
            backgroundColor: hideAnsweredQuestions ? `${COLORS.primary.main}04` : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hideAnsweredQuestions ?
              <VisibilityOffOutlinedIcon fontSize="medium" sx={{ mr: 1.5, color: hideAnsweredQuestions ? COLORS.primary.main : 'text.secondary' }} /> :
              <VisibilityOutlinedIcon fontSize="medium" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Hide answered in Navigation</Typography>
          </Box>
          <Switch
            checked={hideAnsweredQuestions}
            size="medium"
            color="primary"
            onClick={handleHideAnsweredToggle}
          />
        </MenuItem>

        {/* Hide answered in Related Questions - now using Switch */}
        <MenuItem
          sx={{
            minWidth: 320,
            display: 'flex',
            justifyContent: 'space-between',
            py: 1.5,
            px: 2,
            borderLeft: hideAnsweredInRelated ? `3px solid ${COLORS.primary.main}` : '3px solid transparent',
            backgroundColor: hideAnsweredInRelated ? `${COLORS.primary.main}04` : 'transparent'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {hideAnsweredInRelated ?
              <VisibilityOffOutlinedIcon fontSize="medium" sx={{ mr: 1.5, color: hideAnsweredInRelated ? COLORS.primary.main : 'text.secondary' }} /> :
              <VisibilityOutlinedIcon fontSize="medium" sx={{ mr: 1.5, color: 'text.secondary' }} />
            }
            <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>Hide answered in Related Questions</Typography>
          </Box>
          <Switch
            checked={hideAnsweredInRelated}
            size="medium"
            color="primary"
            onClick={handleHideAnsweredInRelatedToggle}
          />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '85%',
              maxWidth: 450,
              boxSizing: 'border-box',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Technical Interviewer</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Navigation</Typography>
              <MenuItem
                onClick={() => {
                  setMobileView('category');
                  setMobileDrawerOpen(false);
                }}
                sx={{ borderRadius: 1 }}
              >
                <CategoryIcon sx={{ mr: 2 }} />
                <Typography>Categories</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMobileView('question');
                  setMobileDrawerOpen(false);
                }}
                sx={{ borderRadius: 1 }}
              >
                <QuestionAnswerIcon sx={{ mr: 2 }} />
                <Typography>Current Question</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMobileView('related');
                  setMobileDrawerOpen(false);
                }}
                sx={{ borderRadius: 1 }}
              >
                <LinkIcon sx={{ mr: 2 }} />
                <Typography>Related Questions</Typography>
              </MenuItem>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Settings</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Learning Mode</Typography>
                <Switch
                  checked={learningMode}
                  size="medium"
                  color="primary"
                  onChange={handleLearningModeToggle}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Hide Answered Questions</Typography>
                <Switch
                  checked={hideAnsweredQuestions}
                  size="medium"
                  color="primary"
                  onChange={handleHideAnsweredToggle}
                />
              </Box>
            </Box>
          </Box>
        </Drawer>
      )}

      {/* Main Content - Adaptive Three Column Layout */}
      <Box sx={{
        flexGrow: 1,
        display: 'flex',
        p: 2,
        minHeight: 'calc(100vh - 64px)',
        overflow: 'auto',
        maxWidth: '100vw',
        boxSizing: 'border-box',
        position: 'relative', // For positioning toggle buttons
        pb: isMobile ? '56px' : 2, // Space for bottom navigation on mobile
      }}>
        {/* Left Sidebar - Categories */}
        <SidebarPanel
          isCollapsed={leftSidebarCollapsed}
          expandedWidth={LAYOUT.LEFT_SIDEBAR_WIDTH}
          collapsedWidth={LAYOUT.COLLAPSED_SIDEBAR_WIDTH}
          onToggle={toggleLeftSidebar}
          position="left"
          sx={{
            display: isMobile ?
              (mobileView === 'category' ? 'block' : 'none') :
              'block',
            position: isMobile ? 'fixed' : 'relative',
            zIndex: isMobile ? theme.zIndex.drawer : 'auto',
            height: isMobile ? '100%' : 'auto',
            top: isMobile ? 0 : 'auto',
            left: 0,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)'
          }}
        >
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
            isCollapsed={leftSidebarCollapsed && !isMobile}
          />
        </SidebarPanel>

        {/* Sidebar toggle buttons - always visible on desktop */}
        {!isMobile && (
          <>
            <IconButton
              onClick={toggleLeftSidebar}
              sx={sidebarToggleButtonStyle(
                'left',
                leftSidebarCollapsed,
                LAYOUT.COLLAPSED_SIDEBAR_WIDTH
              )}
            >
              {leftSidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>

            <IconButton
              onClick={toggleRightSidebar}
              sx={sidebarToggleButtonStyle(
                'right',
                rightSidebarCollapsed,
                LAYOUT.COLLAPSED_SIDEBAR_WIDTH
              )}
            >
              {rightSidebarCollapsed ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </>
        )}

        {/* Main Content */}
        <Paper
          elevation={0}
          sx={mainPanelStyles}
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
          />
        </Paper>

        {/* Right Sidebar - Related Questions */}
        <SidebarPanel
          isCollapsed={rightSidebarCollapsed}
          expandedWidth={LAYOUT.RIGHT_SIDEBAR_WIDTH}
          collapsedWidth={LAYOUT.COLLAPSED_SIDEBAR_WIDTH}
          onToggle={toggleRightSidebar}
          position="right"
          sx={{
            display: isMobile ?
              (mobileView === 'related' ? 'block' : 'none') :
              'block',
            position: isMobile ? 'fixed' : 'relative',
            zIndex: isMobile ? theme.zIndex.drawer : 'auto',
            height: isMobile ? '100%' : 'auto',
            top: isMobile ? 0 : 'auto',
            right: 0,
            bgcolor: 'background.paper',
            overflowY: 'auto',
            maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 100px)'
          }}
        >
          <RelatedQuestionsSidebar
            relatedQuestionsList={relatedQuestionsList}
            gradesMap={gradesMap}
            onQuestionSelect={handleQuestionSelect}
            hideAnswered={hideAnsweredInRelated}
            isCollapsed={rightSidebarCollapsed && !isMobile}
          />
        </SidebarPanel>
      </Box>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <BottomNavigation
          value={mobileView}
          onChange={(event, newValue) => {
            setMobileView(newValue);
          }}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: '1px solid',
            borderColor: 'divider',
            height: LAYOUT.BOTTOM_NAV_HEIGHT
          }}
        >
          <BottomNavigationAction
            label="Categories"
            value="category"
            icon={<CategoryIcon />}
            sx={{ py: 1 }}
          />
          <BottomNavigationAction
            label="Question"
            value="question"
            icon={<QuestionAnswerIcon />}
            sx={{ py: 1 }}
          />
          <BottomNavigationAction
            label="Related"
            value="related"
            icon={<LinkIcon />}
            sx={{ py: 1 }}
          />
        </BottomNavigation>
      )}
    </Box>
  );
};

export default InterviewPanel;