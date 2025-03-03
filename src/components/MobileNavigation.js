// src/components/MobileNavigation.js
import React from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Divider,
  Drawer,
  MenuItem,
  Switch,
  Typography,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LinkIcon from '@mui/icons-material/Link';
import {LAYOUT} from '../themes/baseTheme';

const MobileDrawer = ({
  open,
  onClose,
  onNavigationChange,
  settings,
  onSettingChange,
}) => {
  const {learningMode, hideAnsweredQuestions} = settings;

  const handleSettingChange = (setting) => {
    onSettingChange(setting);
  };

  return (
      <Drawer
          anchor="left"
          open={open}
          onClose={onClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: '85%',
              maxWidth: 450,
              boxSizing: 'border-box',
            },
          }}
      >
        <Box sx={{p: 2}}>
          <Typography variant="h6" sx={{mb: 2}}>Technical
            Interviewer</Typography>
          <Divider sx={{mb: 2}}/>
          <Box sx={{mb: 2}}>
            <Typography variant="subtitle2" sx={{mb: 1}}>Navigation</Typography>
            <MenuItem
                onClick={() => {
                  onNavigationChange('category');
                  onClose();
                }}
                sx={{borderRadius: 1}}
            >
              <CategoryIcon sx={{mr: 2}}/>
              <Typography>Categories</Typography>
            </MenuItem>
            <MenuItem
                onClick={() => {
                  onNavigationChange('question');
                  onClose();
                }}
                sx={{borderRadius: 1}}
            >
              <QuestionAnswerIcon sx={{mr: 2}}/>
              <Typography>Current Question</Typography>
            </MenuItem>
            <MenuItem
                onClick={() => {
                  onNavigationChange('related');
                  onClose();
                }}
                sx={{borderRadius: 1}}
            >
              <LinkIcon sx={{mr: 2}}/>
              <Typography>Related Questions</Typography>
            </MenuItem>
          </Box>
          <Divider sx={{mb: 2}}/>
          <Box>
            <Typography variant="subtitle2" sx={{mb: 1}}>Settings</Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}>
              <Typography variant="body2">Learning Mode</Typography>
              <Switch
                  checked={learningMode}
                  size="medium"
                  color="primary"
                  onChange={() => handleSettingChange('learningMode')}
              />
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}>
              <Typography variant="body2">Hide Answered Questions</Typography>
              <Switch
                  checked={hideAnsweredQuestions}
                  size="medium"
                  color="primary"
                  onChange={() => handleSettingChange('hideAnsweredQuestions')}
              />
            </Box>
          </Box>
        </Box>
      </Drawer>
  );
};

const MobileBottomNav = ({currentView, onViewChange}) => {
  return (
      <BottomNavigation
          value={currentView}
          onChange={(event, newValue) => {
            onViewChange(newValue);
          }}
          showLabels
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            borderTop: '1px solid',
            borderColor: 'divider',
            height: LAYOUT.BOTTOM_NAV_HEIGHT,
          }}
      >
        <BottomNavigationAction
            label="Categories"
            value="category"
            icon={<CategoryIcon/>}
            sx={{py: 1}}
        />
        <BottomNavigationAction
            label="Question"
            value="question"
            icon={<QuestionAnswerIcon/>}
            sx={{py: 1}}
        />
        <BottomNavigationAction
            label="Related"
            value="related"
            icon={<LinkIcon/>}
            sx={{py: 1}}
        />
      </BottomNavigation>
  );
};

// Export both components for use in InterviewPanel
export {MobileDrawer, MobileBottomNav};