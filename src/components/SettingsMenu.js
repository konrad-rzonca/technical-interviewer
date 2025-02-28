// src/components/SettingsMenu.js
import React from 'react';
import {Box, Menu, MenuItem, Switch, Typography} from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffOutlinedIcon
  from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import {COLORS} from '../utils/theme';

const SettingsMenu = ({
  anchorEl,
  open,
  onClose,
  settings,
  onSettingChange,
}) => {
  const {learningMode, hideAnsweredQuestions, hideAnsweredInRelated} = settings;

  // Handle toggle with prevention of event propagation
  const handleToggle = (setting, e) => {
    e.stopPropagation(); // Prevent menu from closing
    onSettingChange(setting);
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
              borderLeft: learningMode
                  ? `3px solid ${COLORS.primary.main}`
                  : '3px solid transparent',
              backgroundColor: learningMode
                  ? `${COLORS.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {learningMode
                ?
                <VisibilityOffIcon fontSize="medium"
                                   sx={{mr: 1.5, color: COLORS.primary.main}}/>
                :
                <VisibilityIcon fontSize="medium"
                                sx={{mr: 1.5, color: 'text.secondary'}}/>
            }
            <Typography variant="body2" sx={{fontSize: '1.1rem'}}>Learning
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
              fontSize: '0.95rem',
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
                  ? `3px solid ${COLORS.primary.main}`
                  : '3px solid transparent',
              backgroundColor: hideAnsweredQuestions
                  ? `${COLORS.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {hideAnsweredQuestions ?
                <VisibilityOffOutlinedIcon fontSize="medium" sx={{
                  mr: 1.5,
                  color: hideAnsweredQuestions
                      ? COLORS.primary.main
                      : 'text.secondary',
                }}/> :
                <VisibilityOutlinedIcon fontSize="medium" sx={{
                  mr: 1.5,
                  color: 'text.secondary',
                }}/>
            }
            <Typography variant="body2" sx={{fontSize: '1.1rem'}}>Hide answered
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
                  ? `3px solid ${COLORS.primary.main}`
                  : '3px solid transparent',
              backgroundColor: hideAnsweredInRelated
                  ? `${COLORS.primary.main}04`
                  : 'transparent',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent menu from closing
        >
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            {hideAnsweredInRelated ?
                <VisibilityOffOutlinedIcon fontSize="medium" sx={{
                  mr: 1.5,
                  color: hideAnsweredInRelated
                      ? COLORS.primary.main
                      : 'text.secondary',
                }}/> :
                <VisibilityOutlinedIcon fontSize="medium" sx={{
                  mr: 1.5,
                  color: 'text.secondary',
                }}/>
            }
            <Typography variant="body2" sx={{fontSize: '1.1rem'}}>Hide answered
              in Related Questions</Typography>
          </Box>
          <Switch
              checked={hideAnsweredInRelated}
              size="medium"
              color="primary"
              onClick={(e) => handleToggle('hideAnsweredInRelated', e)}
          />
        </MenuItem>
      </Menu>
  );
};

export default React.memo(SettingsMenu);