// src/utils/sharedStyles.js
// This file contains shared styling helpers for components

import { SKILL_LEVELS, getBorderOpacity } from './constants';

// Create theme with larger text sizes (20% larger than previous)
export const createThemeWithLargerText = (baseTheme) => {
  return {
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      h6: {
        fontSize: '1.5rem', // Increased by 20%
        fontWeight: 500,
      },
      subtitle1: {
        fontSize: '1.25rem', // Increased by 20%
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: '1.2rem', // Increased by 20%
        fontWeight: 500,
      },
      body1: {
        fontSize: '1.2rem', // Increased by 20%
      },
      body2: {
        fontSize: '1.15rem', // Increased by 20%
      }
    },
    components: {
      ...baseTheme.components,
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            borderRadius: 8, // Slightly larger radius
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 30, // Larger chip height
            fontSize: '0.9rem', // Larger font in chips
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6, // Slightly larger button radius
            fontSize: '1.1rem', // Larger text in buttons
          },
        },
      },
    }
  };
};

// Sidebar styling (expanded)
export const expandedSidebarStyle = (width) => ({
  width: width,
  minWidth: width,
  transition: 'width 0.3s ease, min-width 0.3s ease',
  p: 3, // Larger padding
  border: '1px solid #cccccc',
  borderRadius: 2,
  overflow: 'auto',
  height: '100%'
});

// Sidebar styling (collapsed)
export const collapsedSidebarStyle = (width) => ({
  width: width,
  minWidth: width,
  p: 1.5, // Larger padding
  transition: 'width 0.3s ease, min-width 0.3s ease',
  border: '1px solid #cccccc',
  borderRadius: 2,
  overflow: 'auto',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

// Skill level section styling
export const skillLevelSectionStyle = (level) => ({
  p: 1.5, // Larger padding
  border: `1px solid ${SKILL_LEVELS[level].color}${getBorderOpacity(level)}`,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: `${SKILL_LEVELS[level].color}10`,
  height: '100%',
  minHeight: '120px', // Taller minimum height
});

// Question item styling
export const questionItemStyle = (isSelected, isAnswered, levelColor, borderOpacity) => ({
  p: '10px 10px 10px 28px', // Increased padding all around
  borderRadius: 1,
  cursor: 'pointer',
  backgroundColor: isSelected
    ? `${levelColor}15`
    : (isAnswered ? 'rgba(102, 187, 106, 0.08)' // Slightly stronger green
      : 'white'),
  border: isSelected
    ? `2px solid ${levelColor}${borderOpacity}` // Thicker border when selected
    : (isAnswered ? '1px solid rgba(102, 187, 106, 0.25)'
      : '1px solid #e0e0e0'),
  position: 'relative',
  paddingRight: isAnswered ? '28px' : '10px',
  '&:hover': {
    backgroundColor: `${levelColor}15`,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Stronger hover effect
  },
  minHeight: '50px', // Taller minimum height
  mb: 0.75, // More margin below
  display: 'flex',
  alignItems: 'center'
});

// Section header styling
export const sectionHeaderStyle = (color) => ({
  mb: 1.5,
  color: color,
  fontWeight: 500,
  textAlign: 'center',
  pb: 1,
  fontSize: '1.3rem', // Larger font for section headers
  borderBottom: `1px solid ${color}20`
});