// src/components/InterviewPanel.js
import React, {useCallback, useEffect, useState} from 'react';
import {Box, Paper, useMediaQuery, useTheme} from '@mui/material';

import {
  categories,
  getCategoryForQuestion,
  getFilteredQuestions,
  getQuestionsByCategory,
  getQuestionSets,
  getRelatedQuestions,
  sortQuestionsByOrder,
} from '../data/questionLoader';

import {scrollbarStyles, usePanelStyles} from '../utils/styles';
import {LAYOUT} from '../themes/baseTheme';
import CategorySidebar from './CategorySidebar';
import QuestionDetailsPanel from './QuestionDetailsPanel';
import QuestionNavigation from './QuestionNavigation';
import RelatedQuestionsSidebar from './RelatedQuestionsSidebar';
import SidebarPanel from './SidebarPanel';
import {MobileBottomNav, MobileDrawer} from './MobileNavigation';

/**
 * InterviewPanel - Main interview interface component
 * Provides question navigation, details, and evaluation
 */
const InterviewPanel = ({
  interviewState,
  updateInterviewState,
  onAnswerPointSelect,
  settings,
  onSettingChange,
}) => {
  const {
    currentQuestion,
    notesMap,
    gradesMap,
    selectedAnswerPointsMap,
  } = interviewState;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  // Sidebar collapse state
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Mobile navigation state
  const [mobileView, setMobileView] = useState('question'); // 'category', 'question', 'related'
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Category state
  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [relatedQuestionsList, setRelatedQuestionsList] = useState([]);
  const [availableSets, setAvailableSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState({});
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [subcategoryFilter, setSubcategoryFilter] = useState(null);

  // Navigation state - Added for ordered navigation
  const [navigationState, setNavigationState] = useState({
    orderedQuestions: [],
    currentIndex: -1,
  });

  // Sidebar toggle handlers - optimized with useCallback
  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarCollapsed(prev => !prev);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarCollapsed(prev => !prev);
  }, []);

  // Initialize active categories
  useEffect(() => {
    setActiveCategories(categories);

    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [selectedCategory]);

  // Initialize subcategory selection
  useEffect(() => {
    const initialSelectedSubcategories = {};

    categories.forEach(category => {
      if (category.subcategories?.length > 0) {
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
    let baseQuestions = [];

    if (selectedCategory) {
      // Filter questions
      if (subcategoryFilter) {
        // Filter by specific subcategory if selected
        baseQuestions = getFilteredQuestions(
            selectedCategory,
            subcategoryFilter,
        );
      } else if (selectedSubcategories[selectedCategory]) {
        // Filter by multiple selected subcategories
        const activeSubcategories = Object.entries(
            selectedSubcategories[selectedCategory],
        ).
            filter(([_, isSelected]) => isSelected).
            map(([subcategory, _]) => subcategory);

        if (activeSubcategories.length > 0) {
          // Get questions from all active subcategories
          baseQuestions = [];
          activeSubcategories.forEach(subcategory => {
            const subcategoryQuestions = getFilteredQuestions(
                selectedCategory,
                subcategory,
            );
            baseQuestions.push(...subcategoryQuestions);
          });

          // Sort the combined questions for consistent ordering
          baseQuestions = sortQuestionsByOrder(baseQuestions);
        }
      } else {
        // Get all questions for the category if no subcategory filtering
        baseQuestions = getQuestionsByCategory(selectedCategory);
      }

      // If we have questions but no current question selected, select the first one
      if (baseQuestions.length > 0 && !currentQuestion) {
        updateInterviewState({currentQuestion: baseQuestions[0]});
      }
    }

    // Use a brand new array to ensure React detects state change
    setQuestions(baseQuestions);
  }, [
    selectedCategory,
    selectedSets,
    selectedSubcategories,
    subcategoryFilter,
    currentQuestion,
    updateInterviewState,
  ]);

  // Apply hide answered questions filter
  useEffect(() => {
    let filtered = [...questions];

    if (settings.hideAnsweredQuestions) {
      filtered = questions.filter(question => !gradesMap[question.id]);

      // If current question is filtered out, select first visible question
      if (
          filtered.length > 0 &&
          currentQuestion &&
          gradesMap[currentQuestion.id]
      ) {
        updateInterviewState({currentQuestion: filtered[0]});
      }
    }

    setFilteredQuestions(filtered);
  }, [
    questions,
    settings.hideAnsweredQuestions,
    gradesMap,
    currentQuestion,
    updateInterviewState,
  ]);

  // Update navigation state when filtered questions or current question changes
  useEffect(() => {
    let orderedQuestions = [];
    let currentIndex = -1;

    if (filteredQuestions.length > 0) {
      // Create ordered list for navigation
      orderedQuestions = sortQuestionsByOrder([...filteredQuestions]);

      currentIndex = currentQuestion
          ? orderedQuestions.findIndex(q => q.id === currentQuestion.id)
          : 0;

      if (currentIndex === -1) {
        currentIndex = 0;
      }
    }

    setNavigationState({
      orderedQuestions,
      currentIndex,
    });
  }, [filteredQuestions, currentQuestion]);

  // Load related questions when current question changes
  useEffect(() => {
    let related = [];

    if (currentQuestion) {
      related = getRelatedQuestions(currentQuestion.id);

      // Filter out any questions that point to themselves
      related = related.filter(q => q.id !== currentQuestion.id);

      // Enhance related questions with category name information
      related = related.map(q => {
        const categoryObj = categories.find(c => c.id === q.categoryId) || {};
        return {
          ...q,
          categoryName: categoryObj.name || '',
        };
      });
    }

    setRelatedQuestionsList(related);
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

  // Handle category selection - optimized with useCallback
  const handleCategorySelect = useCallback(
      (categoryId, explicitExpandedState = null) => {
        if (categoryId === selectedCategory) {
          // Toggle expansion if the category is already selected
          setExpandedCategory(prevExpanded =>
              explicitExpandedState !== null
                  ? explicitExpandedState
                  : prevExpanded === categoryId
                      ? null
                      : categoryId,
          );
          return;
        }

        setSelectedCategory(categoryId);
        const category = categories.find(c => c.id === categoryId);

        // If explicitExpandedState is provided, use it, otherwise use default logic
        setExpandedCategory(
            explicitExpandedState !== null
                ? explicitExpandedState
                : category && category.subcategories.length > 0
                    ? categoryId
                    : null,
        );

        setSubcategoryFilter(null);
        updateInterviewState({currentQuestion: null});

        // In mobile, switch to question view after selecting a category
        if (isMobile) {
          setMobileView('question');
        }
      }, [selectedCategory, isMobile, updateInterviewState]);

  // Subcategory handlers - optimized with useCallback
  const handleSubcategorySelect = useCallback(subcategory => {
    setSubcategoryFilter(prev => prev === subcategory ? null : subcategory);
  }, []);

  const handleSubcategoryToggle = useCallback((categoryId, subcategory) => {
    setSelectedSubcategories(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [subcategory]: !prev[categoryId][subcategory],
      },
    }));
    setSubcategoryFilter(null); // Clear any active filter
  }, []);

  // Handle question selection - optimized with useCallback
  const handleQuestionSelect = useCallback(question => {
    // Find the category for this question
    const category = getCategoryForQuestion(question);

    if (category && category.id !== selectedCategory) {
      // If question is from a different category, update category selection
      setSelectedCategory(category.id);
    }

    updateInterviewState({currentQuestion: question});

    // In mobile, switch to question view after selecting a question
    if (isMobile) {
      setMobileView('question');
    }
  }, [selectedCategory, isMobile, updateInterviewState]);

  // Navigate to next/previous question - optimized with useCallback
  const handleNavigateQuestion = useCallback(direction => {
    const {orderedQuestions, currentIndex} = navigationState;
    if (orderedQuestions.length <= 1) return;

    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % orderedQuestions.length;
    } else {
      newIndex = (currentIndex - 1 + orderedQuestions.length) %
          orderedQuestions.length;
    }

    updateInterviewState({currentQuestion: orderedQuestions[newIndex]});
  }, [navigationState, updateInterviewState]);

  // Handle notes change - optimized with useCallback
  const handleNotesChange = useCallback((questionId, value) => {
    updateInterviewState(prevState => ({
      ...prevState,
      notesMap: {
        ...prevState.notesMap,
        [questionId]: value,
      },
    }));
  }, [updateInterviewState]);

  // Handle grade change - optimized with useCallback
  const handleGradeChange = useCallback((questionId, value) => {
    updateInterviewState(prevState => ({
      ...prevState,
      gradesMap: {
        ...prevState.gradesMap,
        [questionId]: value,
      },
    }));
  }, [updateInterviewState]);

  // Set selection handlers - optimized with useCallback
  const handleSetToggle = useCallback(setId => {
    setSelectedSets(prev => ({
      ...prev,
      [setId]: !prev[setId],
    }));
  }, []);

  const handleSelectAllSets = useCallback(() => {
    const newSelection = {};
    availableSets.forEach(set => {
      newSelection[set.id] = true;
    });
    setSelectedSets(prev => ({...prev, ...newSelection}));
  }, [availableSets]);

  const handleDeselectAllSets = useCallback(() => {
    const newSelection = {};
    availableSets.forEach(set => {
      newSelection[set.id] = false;
    });
    setSelectedSets(prev => ({...prev, ...newSelection}));
  }, [availableSets]);

  // Subcategory selection handlers - optimized with useCallback
  const handleSelectAllSubcategories = useCallback(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setSelectedSubcategories(prev => {
      const newSelection = {...prev};
      if (!newSelection[categoryId]) {
        newSelection[categoryId] = {};
      }

      category.subcategories.forEach(subcategory => {
        newSelection[categoryId][subcategory] = true;
      });

      return newSelection;
    });

    setSubcategoryFilter(null);
  }, []);

  const handleDeselectAllSubcategories = useCallback(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    setSelectedSubcategories(prev => {
      const newSelection = {...prev};
      if (!newSelection[categoryId]) {
        newSelection[categoryId] = {};
      }

      category.subcategories.forEach(subcategory => {
        newSelection[categoryId][subcategory] = false;
      });

      return newSelection;
    });

    setSubcategoryFilter(null);
  }, []);

  // Handle settings changes - optimized with useCallback
  const handleSettingChange = useCallback(setting => {
    onSettingChange(setting);
  }, [onSettingChange]);

  // Direct style calculation instead of useMemo to avoid hook issues
  const mainPanelStyles = usePanelStyles(false, true, {
    flexGrow: 1,
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Container doesn't scroll
    width: isMobile ? 'calc(100% - 24px)' : 'auto',
    transition: 'margin 0.3s ease, width 0.3s ease',
    visibility: isMobile
        ? mobileView === 'question'
            ? 'visible'
            : 'hidden'
        : 'visible',
    // Very subtle edge shadows to help with panel separation
    boxShadow: '0 0 2px rgba(0,0,0,0.05)',
  });

  return (
      <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            minHeight: {xs: '600px', sm: '700px', md: '800px'},
          }}
      >
        {/* Mobile Drawer */}
        {isMobile && (
            <MobileDrawer
                open={mobileDrawerOpen}
                onClose={() => setMobileDrawerOpen(false)}
                onNavigationChange={setMobileView}
                settings={settings}
                onSettingChange={handleSettingChange}
            />
        )}

        {/* Main Content - Adaptive Three Column Layout */}
        <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              p: 2,
              height: 'calc(100vh - 64px)', // Fixed height to contain the content
              overflow: 'hidden', // Prevent unwanted scrolling at this level
              maxWidth: '100vw',
              boxSizing: 'border-box',
              position: 'relative',
              pb: isMobile ? '56px' : 2, // Space for bottom navigation on mobile
            }}
        >
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
                maxHeight: isMobile
                    ? 'calc(100vh - 120px)'
                    : 'calc(100vh - 100px)',
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
                onToggle={toggleLeftSidebar}
            />
          </SidebarPanel>

          {/* Main Content */}
          <Paper
              elevation={0}
              sx={mainPanelStyles}
          >
            {/* Question Details Panel - fixed height, no scrolling */}
            <Box sx={{
              flexShrink: 0, // Don't shrink
              overflow: 'visible', // Allow tooltips to overflow
            }}>
              <QuestionDetailsPanel
                  currentQuestion={currentQuestion}
                  notesMap={notesMap}
                  gradesMap={gradesMap}
                  selectedAnswerPointsMap={selectedAnswerPointsMap}
                  onAnswerPointSelect={onAnswerPointSelect}
                  learningMode={settings.learningMode}
                  onNotesChange={handleNotesChange}
                  onGradeChange={handleGradeChange}
                  onNavigateQuestion={handleNavigateQuestion}
              />
            </Box>

            {/* Question Navigation below - takes remaining space with scrolling */}
            <Box sx={{
              flexGrow: 1,
              overflow: 'auto', // Enable scrolling
              mt: 2, // Add margin for separation
              minHeight: '200px', // Ensure minimum visibility
              ...scrollbarStyles, // Apply modern scrollbar styles
            }}>
              <QuestionNavigation
                  filteredQuestions={filteredQuestions}
                  currentQuestion={currentQuestion}
                  gradesMap={gradesMap}
                  onQuestionSelect={handleQuestionSelect}
              />
            </Box>
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
                maxHeight: isMobile
                    ? 'calc(100vh - 120px)'
                    : 'calc(100vh - 100px)',
              }}
          >
            <RelatedQuestionsSidebar
                relatedQuestionsList={relatedQuestionsList}
                gradesMap={gradesMap}
                onQuestionSelect={handleQuestionSelect}
                hideAnswered={settings.hideAnsweredInRelated}
                isCollapsed={rightSidebarCollapsed && !isMobile}
                onToggle={toggleRightSidebar}
            />
          </SidebarPanel>
        </Box>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
            <MobileBottomNav currentView={mobileView}
                             onViewChange={setMobileView}/>
        )}
      </Box>
  );
};

export default InterviewPanel;