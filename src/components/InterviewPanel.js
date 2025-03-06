// src/components/InterviewPanel.js
import React, {useCallback, useEffect, useState} from 'react';
import {Box, Paper, useMediaQuery, useTheme} from '@mui/material';

import {scrollbarStyles, usePanelStyles} from '../utils/styles';
import {LAYOUT} from '../themes/baseTheme';
import CategorySidebar from './CategorySidebar';
import QuestionDetailsPanel from './QuestionDetailsPanel';
import QuestionNavigation from './QuestionNavigation';
import RelatedQuestionsSidebar from './RelatedQuestionsSidebar';
import SidebarPanel from './SidebarPanel';
import {MobileBottomNav, MobileDrawer} from './MobileNavigation';

// Import custom hooks for state management
import {useCategoryState} from '../hooks/useCategoryState';
import {useQuestionNavigation} from '../hooks/useQuestionNavigation';
import {useRelatedQuestions} from '../hooks/useRelatedQuestions';
import {useEvaluationState} from '../hooks/useEvaluationState';

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

  // Use custom hooks for state management
  const categoryState = useCategoryState(interviewState, updateInterviewState);

  const {
    handleNavigateQuestion,
    handleQuestionSelect,
  } = useQuestionNavigation(
      categoryState.filteredQuestions,
      currentQuestion,
      updateInterviewState,
  );

  const {filteredRelatedQuestions} = useRelatedQuestions(
      currentQuestion,
      gradesMap,
      settings.hideAnsweredInRelated,
  );

  const {
    handleNotesChange,
    handleGradeChange,
    handleAnswerPointSelect,
  } = useEvaluationState(interviewState, updateInterviewState);

  // Apply hide answered questions filter
  useEffect(() => {
    categoryState.applyAnsweredFilter(
        settings.hideAnsweredQuestions,
        gradesMap,
    );
  }, [settings.hideAnsweredQuestions, gradesMap, categoryState.questions]);

  // Sidebar toggle handlers - optimized with useCallback
  const toggleLeftSidebar = useCallback(() => {
    setLeftSidebarCollapsed(prev => !prev);
  }, []);

  const toggleRightSidebar = useCallback(() => {
    setRightSidebarCollapsed(prev => !prev);
  }, []);

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

  // Enhanced question selection handler for mobile view switching
  const handleQuestionSelectWithMobileView = useCallback((question) => {
    handleQuestionSelect(question);

    // In mobile, switch to question view after selecting a question
    if (isMobile) {
      setMobileView('question');
    }
  }, [handleQuestionSelect, isMobile]);

  // Enhanced category selection handler for mobile view switching
  const handleCategorySelectWithMobileView = useCallback(
      (categoryId, explicitExpandedState) => {
        categoryState.handleCategorySelect(categoryId, explicitExpandedState);

        // In mobile, switch to question view after selecting a category
        if (isMobile) {
          setMobileView('question');
        }
      }, [categoryState.handleCategorySelect, isMobile]);

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
                categories={categoryState.activeCategories || []}
                selectedCategory={categoryState.selectedCategory}
                expandedCategory={categoryState.expandedCategory}
                selectedSubcategories={categoryState.selectedSubcategories}
                subcategoryFilter={categoryState.subcategoryFilter}
                availableSets={categoryState.availableSets}
                selectedSets={categoryState.selectedSets}
                onCategorySelect={handleCategorySelectWithMobileView}
                onSubcategorySelect={categoryState.handleSubcategorySelect}
                onSubcategoryToggle={categoryState.handleSubcategoryToggle}
                onSelectAllSubcategories={categoryState.handleSelectAllSubcategories}
                onDeselectAllSubcategories={categoryState.handleDeselectAllSubcategories}
                onSetToggle={categoryState.handleSetToggle}
                onSelectAllSets={categoryState.handleSelectAllSets}
                onDeselectAllSets={categoryState.handleDeselectAllSets}
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
                  onAnswerPointSelect={handleAnswerPointSelect}
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
                  filteredQuestions={categoryState.filteredQuestions}
                  currentQuestion={currentQuestion}
                  gradesMap={gradesMap}
                  onQuestionSelect={handleQuestionSelectWithMobileView}
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
                relatedQuestionsList={filteredRelatedQuestions}
                gradesMap={gradesMap}
                onQuestionSelect={handleQuestionSelectWithMobileView}
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