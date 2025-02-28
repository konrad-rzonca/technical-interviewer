// src/components/SidebarPanel.js - Refactored with optimized JSS
import React from 'react';
import { Box, Paper } from '@mui/material';
import { usePanelStyles } from '../utils/styleHooks';

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
  // Get panel styles using the optimized custom hook
  const panelStyles = usePanelStyles(isCollapsed, true);

  // Additional styles for the Box container
  const boxStyles = {
    width: isCollapsed ? collapsedWidth : expandedWidth,
    minWidth: isCollapsed ? collapsedWidth : expandedWidth,
    transition: 'width 0.3s ease, min-width 0.3s ease',
    ...(position === 'left' ? { mr: 2 } : { ml: 2 }),
    ...sx
  };

  return (
    <Box sx={boxStyles} {...otherProps}>
      <Paper
        elevation={0}
        sx={{
          ...panelStyles,
          height: '100%',
          width: '100%'
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default SidebarPanel;