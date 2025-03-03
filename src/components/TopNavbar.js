// src/components/TopNavbar.js
import React from 'react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link, useLocation} from 'react-router-dom';
import {SPACING} from '../themes/baseTheme';
import {NAVIGATION} from '../utils/constants';
import GlobalSearch from './GlobalSearch';
import Logo from './Logo';

/**
 * Get the active tab index based on the current route path
 */
const getTabIndexFromPath = (pathname) => {
  if (pathname.startsWith(NAVIGATION.ROUTES.CODING)) {
    return 1;
  } else if (pathname.startsWith(NAVIGATION.ROUTES.BEST_PRACTICES)) {
    return 2;
  } else {
    return 0;
  }
};

/**
 * TopNavbar - Main navigation component
 * Handles app-wide navigation, search, and settings access
 */
const TopNavbar = ({
  isMobile,
  onMobileDrawerOpen,
  onSettingsMenuOpen,
  settings,
  questions,
  categories,
  onQuestionSelect,
  onCategorySelect,
  gradesMap,
  selectedCategory,
}) => {
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Get active tab based on current route
  const currentTabIndex = getTabIndexFromPath(location.pathname);

  // Count active settings to show badge
  const activeSettingsCount =
      (settings.learningMode ? 1 : 0) +
      (settings.hideAnsweredQuestions ? 1 : 0) +
      (settings.hideAnsweredInRelated ? 1 : 0);

  return (
      <AppBar position="static" elevation={1} color="default">
        <Toolbar sx={{
          minHeight: 68,
          justifyContent: 'space-between',
          px: {xs: 1, sm: 2},
          gap: 2,
        }}>
          {/* Left section: Menu button (mobile) and Navigation Tabs */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            flexGrow: isSmallScreen ? 0 : 1,
            maxWidth: isSmallScreen ? 'auto' : '33%',
          }}>
            {isMobile && (
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onMobileDrawerOpen}
                    sx={{mr: 1}}
                >
                  <MenuIcon/>
                </IconButton>
            )}

            {/* Logo component - will use UBS logo or app name based on theme */}
            <Box sx={{display: {xs: 'none', md: 'block'}}}>
              <Logo/>
            </Box>

            <Tabs
                value={currentTabIndex}
                textColor="primary"
                indicatorColor="primary"
                variant={isSmallScreen ? 'scrollable' : 'standard'}
                scrollButtons={isSmallScreen ? 'auto' : false}
                sx={{
                  minHeight: 68,
                  '& .MuiTab-root': {
                    minHeight: 68,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: isSmallScreen ? '0.875rem' : '1rem',
                    px: {xs: 1, sm: 2},
                  },
                }}
            >
              <Tab
                  label={NAVIGATION.TAB_LABELS.INTERVIEW}
                  component={Link}
                  to={NAVIGATION.ROUTES.INTERVIEW}
              />
              <Tab
                  label={NAVIGATION.TAB_LABELS.CODING}
                  component={Link}
                  to={NAVIGATION.ROUTES.CODING}
              />
              <Tab
                  label={NAVIGATION.TAB_LABELS.BEST_PRACTICES}
                  component={Link}
                  to={NAVIGATION.ROUTES.BEST_PRACTICES}
              />
            </Tabs>
          </Box>

          {/* Center section: Global Search */}
          <Box sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '45%', // Wider search area
            my: 1, // Add vertical margin
          }}>
            {!isSmallScreen && currentTabIndex === 0 && questions &&
                categories && (
                    <GlobalSearch
                        questions={questions}
                        categories={categories}
                        onQuestionSelect={onQuestionSelect}
                        onCategorySelect={onCategorySelect}
                        gradesMap={gradesMap}
                        selectedCategory={selectedCategory}
                    />
                )}
          </Box>

          {/* Right section: Settings Button */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexGrow: isSmallScreen ? 0 : 1,
            maxWidth: isSmallScreen ? 'auto' : '33%',
          }}>
            <Tooltip title="Settings">
              <IconButton
                  size="large"
                  onClick={onSettingsMenuOpen}
                  color="primary"
                  sx={{
                    p: SPACING.toUnits(SPACING.sm),
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.75rem',
                    },
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    bgcolor: activeSettingsCount > 0
                        ? `${theme.palette.primary.main}10`
                        : 'transparent',
                    '&:hover': {
                      bgcolor: `${theme.palette.primary.main}20`,
                    },
                  }}
              >
                <Badge
                    badgeContent={activeSettingsCount > 0
                        ? activeSettingsCount
                        : 0}
                    color="primary"
                    variant={activeSettingsCount > 0 ? 'standard' : 'dot'}
                    invisible={activeSettingsCount === 0}
                >
                  <SettingsIcon/>
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default React.memo(TopNavbar);