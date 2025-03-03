// src/components/SidebarPanel.js
import {Box} from '@mui/material';
import React, {useMemo} from 'react';

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
  // Memoize box styles to prevent unnecessary recalculations
  const boxStyles = useMemo(() => ({
    width: isCollapsed ? collapsedWidth : expandedWidth,
    minWidth: isCollapsed ? collapsedWidth : expandedWidth,
    transition: 'width 0.3s ease, min-width 0.3s ease',
    height: '100%',
    backgroundColor: 'background.paper',
    borderRadius: 1,
    border: '1px solid rgba(0, 0, 0, 0.06)',
    // Removed box shadow and additional padding
    // Added proper margin based on position
    ...(position === 'left' ? {mr: 1.5} : {ml: 1.5}),
    ...sx,
  }), [isCollapsed, collapsedWidth, expandedWidth, position, sx]);

  return (
      <Box sx={boxStyles} {...otherProps}>
        {children}
      </Box>
  );
};

export default React.memo(SidebarPanel);