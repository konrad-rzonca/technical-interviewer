// src/components/SettingsMenu.js
import React from 'react';
import {
  Box,
  Divider,
  Menu,
  MenuItem,
  Switch,
  Typography,
  useTheme,
} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon
  from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import storageService from '../services/storageService';

const SettingsMenu = ({
  anchorEl,
  open,
  onClose,
  settings,
  onSettingChange,
}) => {
  const {learningMode, hideAnsweredQuestions, hideAnsweredInRelated} = settings;
  const theme = useTheme();

  // Handle toggle with prevention of event propagation
  const handleToggle = (setting, e) => {
    e.stopPropagation(); // Prevent menu from closing
    onSettingChange(setting);
  };

  // Handle clearing saved interview data
  const handleClearSavedData = (e) => {
    e.stopPropagation(); // Prevent menu from closing

    // Confirm with the user before clearing data
    if (window.confirm(
        'Are you sure you want to clear all saved interview data? This will refresh your page, and cannot be undone.')) {
      storageService.clearInterviewState();
      // Notify the user
      alert(
          'Your saved interview data has been cleared. Refresh the page to see the changes.');
    }

    onClose();
  };

  return (
      <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={onClose}
          PaperProps={{
            elevation: 3,
            style: {
              minWidth: 320,
              borderRadius: 8,
              padding: '8px 0',
            },
          }}
          MenuListProps={{
            style: {
              padding: 0,
            },
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
              background: 'rgba(0, 0, 0, 0.02)',
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
              px: 2,
              borderLeft: learningMode
                  ? `3px solid ${theme.palette.primary.main}`
                  : '3px solid transparent',
              backgroundColor: learningMode
                  ? `${theme.palette.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {learningMode
                ?
                <VisibilityOffIcon fontSize="small"
                                   sx={{
                                     mr: 1.5,
                                     color: theme.palette.primary.main,
                                   }}/>
                :
                <VisibilityIcon fontSize="small"
                                sx={{mr: 1.5, color: 'primary'}}/>
            }
            <Typography variant="body2" sx={{fontSize: '0.9rem'}}>Learning
              Mode</Typography>
          </Box>
          <Switch
              checked={learningMode}
              size="medium"
              color="primary"
              onClick={(e) => handleToggle('learningMode', e)}
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
              fontSize: '0.75rem',
            }}
        >
          QUESTION VISIBILITY
        </Typography>

        {/* Hide answered in Question Navigation */}
        <MenuItem
            sx={{
              minWidth: 320,
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              borderLeft: hideAnsweredQuestions
                  ? `3px solid ${theme.palette.primary.main}`
                  : '3px solid transparent',
              backgroundColor: hideAnsweredQuestions
                  ? `${theme.palette.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {hideAnsweredQuestions ?
                <VisibilityOffOutlinedIcon fontSize="small" sx={{
                  mr: 1.5,
                  color: hideAnsweredQuestions
                      ? theme.palette.primary.main
                      : 'text.secondary',
                }}/> :
                <VisibilityOutlinedIcon fontSize="small" sx={{
                  mr: 1.5,
                  color: 'text.secondary',
                }}/>
            }
            <Typography variant="body2" sx={{fontSize: '0.9rem'}}>Hide answered
              in Navigation</Typography>
          </Box>
          <Switch
              checked={hideAnsweredQuestions}
              size="medium"
              color="primary"
              onClick={(e) => handleToggle('hideAnsweredQuestions', e)}
          />
        </MenuItem>

        {/* Hide answered in Related Questions */}
        <MenuItem
            sx={{
              minWidth: 320,
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              borderLeft: hideAnsweredInRelated
                  ? `3px solid ${theme.palette.primary.main}`
                  : '3px solid transparent',
              backgroundColor: hideAnsweredInRelated
                  ? `${theme.palette.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {hideAnsweredInRelated ?
                <VisibilityOffOutlinedIcon fontSize="small" sx={{
                  mr: 1.5,
                  color: hideAnsweredInRelated
                      ? theme.palette.primary.main
                      : 'text.secondary',
                }}/> :
                <VisibilityOutlinedIcon fontSize="small" sx={{
                  mr: 1.5,
                  color: 'text.secondary',
                }}/>
            }
            <Typography variant="body2" sx={{fontSize: '0.9rem'}}>Hide answered
              in Related Questions</Typography>
          </Box>
          <Switch
              checked={hideAnsweredInRelated}
              size="medium"
              color="primary"
              onClick={(e) => handleToggle('hideAnsweredInRelated', e)}
          />
        </MenuItem>

        {/* Data Management Section */}
        <Divider sx={{my: 1}}/>

        <Typography
            variant="caption"
            sx={{
              display: 'block',
              px: 2,
              pt: 1,
              pb: 0.5,
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: '0.75rem',
            }}
        >
          DATA MANAGEMENT
        </Typography>

        {/* Clear Saved Data */}
        <MenuItem
            sx={{
              minWidth: 320,
              display: 'flex',
              justifyContent: 'space-between',
              py: 1.5,
              px: 2,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: `${theme.palette.error.main}10`,
              },
            }}
            onClick={handleClearSavedData}
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <DeleteOutlineIcon fontSize="small" sx={{
              mr: 1.5,
              color: theme.palette.error.main,
            }}/>
            <Typography variant="body2" sx={{
              fontSize: '0.9rem',
              color: theme.palette.error.main,
            }}>
              Clear Saved Interview Data
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
  );
};

export default React.memo(SettingsMenu);