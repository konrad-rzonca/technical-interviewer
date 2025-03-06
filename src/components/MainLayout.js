// src/components/layout/MainLayout.js
import React, {useState} from 'react';
import {Box} from '@mui/material';
import TopNavbar from './TopNavbar';
import SettingsMenu from './SettingsMenu';
import {COLORS} from '../themes/baseTheme';

/**
 * MainLayout - Main application layout component
 * Handles the common layout elements (navigation, settings) for all pages
 */
const MainLayout = ({
  children,
  questions,
  categories,
  gradesMap,
  settings,
  onSettingChange,
  onQuestionSelect,
  onCategorySelect,
  onExportData,
  onClearData,
}) => {
  const [settingsMenuAnchor, setSettingsMenuAnchor] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const isMobile = window.innerWidth < 960; // Simple mobile detection

  // Settings menu handlers
  const handleSettingsMenuOpen = (event) => {
    setSettingsMenuAnchor(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchor(null);
  };

  return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: COLORS.background.light,
        overflow: 'auto',
      }}>
        {/* Top Navigation Bar - Rendered once at the top level */}
        <TopNavbar
            isMobile={isMobile}
            onMobileDrawerOpen={() => setMobileDrawerOpen(true)}
            onSettingsMenuOpen={handleSettingsMenuOpen}
            settings={settings}
            questions={questions}
            categories={categories}
            onQuestionSelect={onQuestionSelect}
            onCategorySelect={onCategorySelect}
            gradesMap={gradesMap}
            selectedCategory=""
            onExportData={onExportData}
            onClearData={onClearData}
        />

        {/* Settings Menu - Shared across the application */}
        <SettingsMenu
            anchorEl={settingsMenuAnchor}
            open={Boolean(settingsMenuAnchor)}
            onClose={handleSettingsMenuClose}
            settings={settings}
            onSettingChange={onSettingChange}
        />

        {/* Main Content Area */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          pt: 1, // Add a slight top padding to separate from navbar
        }}>
          {children}
        </Box>
      </Box>
  );
};

export default MainLayout;