// src/components/SidebarPanel.js
import {Box, IconButton} from '@mui/material';
import React, {useMemo} from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {COLORS} from '../utils/theme';

/**
 * A reusable sidebar panel component that handles collapsed/expanded states
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to display inside the sidebar
 * @param {boolean} props.isCollapsed - Whether the sidebar is collapsed
 * @param {number} props.expandedWidth - Width of the sidebar when expanded
 * @param {number} props.collapsedWidth - Width of the sidebar when collapsed
 * @param {Object} props.sx - Additional MUI sx props to apply
 * @param {string} props.position - Position of the sidebar ('left' or 'right')
 * @param {function} props.onToggle - Function to call when toggling the sidebar
 */
const SidebarPanel = ({
  children,
  isCollapsed,
  expandedWidth,
  collapsedWidth,
  sx = {},
  position = 'left',
  onToggle,
  ...otherProps
}) => {
  // Container style that determines overall width and positioning
  const containerStyles = useMemo(() => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: isCollapsed ? collapsedWidth : expandedWidth,
    minWidth: isCollapsed ? collapsedWidth : expandedWidth,
    transition: 'width 0.3s ease, min-width 0.3s ease',
    // Minimal margin based on position
    ...(position === 'left'
        ? {marginRight: 1}
        : {marginLeft: 1}),
    overflow: 'hidden',
  }), [isCollapsed, collapsedWidth, expandedWidth, position]);

  // Content box styles
  const contentBoxStyles = useMemo(() => ({
    height: '100%',
    width: '100%',
    backgroundColor: 'background.paper',
    borderRadius: 1,
    border: '1px solid rgba(0, 0, 0, 0.06)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...sx,
  }), [sx]);

  return (
      <Box sx={containerStyles}>
        <Box sx={contentBoxStyles} {...otherProps}>
          {isCollapsed ? (
              // Collapsed layout
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                {/* Toggle button at the top */}
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 1,
                  paddingTop: 1.5,
                  paddingBottom: 1.5,
                }}>
                  <IconButton
                      onClick={onToggle}
                      aria-label="Expand sidebar"
                      size="small"
                      sx={{
                        borderRadius: 1,
                        backgroundColor: COLORS.grey[100],
                        padding: 0.75,
                        '&:hover': {
                          backgroundColor: COLORS.grey[200],
                        },
                      }}
                  >
                    {position === 'left' ?
                        <ChevronRightIcon fontSize="small"/> :
                        <ChevronLeftIcon fontSize="small"/>
                    }
                  </IconButton>
                </Box>

                {/* Pass through the children for collapsed view */}
                {children}
              </Box>
          ) : (
              // Expanded layout
              children
          )}
        </Box>
      </Box>
  );
};

export default React.memo(SidebarPanel);