// src/components/SidebarPanel.js
import {Box, IconButton} from '@mui/material';
import React, {useMemo} from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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
    ...(position === 'left' ? {marginRight: 0} : {marginLeft: 0}),
    overflow: 'visible', // Ensure toggle button is visible
  }), [isCollapsed, collapsedWidth, expandedWidth, position]);

  // Content box styles
  const contentBoxStyles = useMemo(() => ({
    height: '100%',
    width: '100%',
    backgroundColor: 'background.paper',
    borderRadius: 1,
    border: '1px solid rgba(0, 0, 0, 0.06)',
    overflow: 'auto',
    ...sx,
  }), [sx]);

  // Toggle button styles - positioned at the extreme edge
  const toggleButtonStyles = useMemo(() => ({
    position: 'absolute',
    [position === 'left' ? 'right' : 'left']: '-18px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
    zIndex: 20,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: 36,
    height: 36,
    '&:hover': {
      backgroundColor: 'primary.light',
    },
  }), [position]);

  return (
      <Box sx={containerStyles}>
        {/* Content box */}
        <Box sx={contentBoxStyles} {...otherProps}>
          {children}
        </Box>

           {/* Toggle button */}
        <IconButton
            onClick={onToggle}
            sx={toggleButtonStyles}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {position === 'left' ? (
              isCollapsed ? <ChevronRightIcon/> : <ChevronLeftIcon/>
          ) : (
              isCollapsed ? <ChevronLeftIcon/> : <ChevronRightIcon/>
          )}
        </IconButton>
      </Box>
  );
};

export default React.memo(SidebarPanel);