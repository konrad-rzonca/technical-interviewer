// src/components/TopNavbar.js
import React from 'react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';

const TopNavbar = ({
  isMobile,
  onMobileDrawerOpen,
  onSettingsMenuOpen,
  settings,
}) => {
  const {learningMode, hideAnsweredQuestions, hideAnsweredInRelated} = settings;

  // Count active settings to show badge
  const activeSettingsCount =
      (learningMode ? 1 : 0) +
      (hideAnsweredQuestions ? 1 : 0) +
      (hideAnsweredInRelated ? 1 : 0);

  return (
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar variant="dense"
                 sx={{minHeight: 56, justifyContent: 'space-between'}}>
          {isMobile && (
              <IconButton
                  edge="start"
                  color="inherit"
                  onClick={onMobileDrawerOpen}
                  sx={{mr: 2}}
              >
                <MenuIcon/>
              </IconButton>
          )}

          <Typography variant="h6" sx={{fontWeight: 'normal'}}>
            Technical Interviewer
          </Typography>

          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {/* Settings Menu */}
            <Tooltip title="Settings">
              <IconButton
                  size="small"
                  onClick={onSettingsMenuOpen}
                  color="primary"
                  sx={{mr: 1}}
              >
                <Badge
                    badgeContent={activeSettingsCount > 0
                        ? activeSettingsCount
                        : 0}
                    color="primary"
                    variant={activeSettingsCount > 0 ? 'standard' : 'dot'}
                    invisible={activeSettingsCount === 0}
                >
                  <SettingsIcon fontSize="small"/>
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
  );
};

export default React.memo(TopNavbar);