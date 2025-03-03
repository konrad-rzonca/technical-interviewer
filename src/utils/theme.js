// src/utils/theme.js
import {createTheme} from '@mui/material/styles';

/**
 * DESIGN TOKENS
 * All design tokens (colors, spacing, typography, etc.) are defined here.
 * This allows for easily updating the entire design system in one place.
 */

// Color palette - all colors used throughout the app
export const COLORS = {
  // Primary colors
  primary: {
    main: '#2196f3',
    light: '#e3f2fd',
    dark: '#1976d2',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#757575',
    light: '#f5f5f5',
    dark: '#424242',
    contrastText: '#ffffff',
  },

  // Semantic colors
  success: {
    main: '#66bb6a', // Green for Basic level and success states
    light: '#e8f5e9',
    dark: '#388e3c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ffb300', // Amber for Intermediate level
    light: '#ffde74',
    dark: '#ffa000',
    contrastText: '#000000',
  },
  info: {
    main: '#fb8c00', // Orange for Advanced level
    light: '#fff3e0',
    dark: '#f57c00',
    contrastText: '#000000',
  },
  error: {
    main: '#f44336',
    light: '#ffebee',
    dark: '#d32f2f',
    contrastText: '#ffffff',
  },

  // Grays
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Background and text
  background: {
    default: '#ffffff',
    paper: '#ffffff',
    light: '#fafafa',
  },
  text: {
    primary: '#333333',
    secondary: '#757575',
    disabled: '#9e9e9e',
  },

  // Other UI colors
  divider: '#e0e0e0',
  border: '#cccccc',
  hover: 'rgba(0, 0, 0, 0.04)',
};

// Skill level colors - these map to the semantic colors above
export const SKILL_LEVEL_COLORS = {
  beginner: {
    main: COLORS.success.main,
    light: COLORS.success.light,
    text: COLORS.success.contrastText,
    border: `${COLORS.success.main}60`, // 50% opacity
    background: `${COLORS.success.main}08`, // 8% opacity
    hoverBg: `${COLORS.success.main}15`, // 15% opacity
    darkBorder: `${COLORS.success.main}60`, // 60% opacity
  },
  intermediate: {
    main: COLORS.warning.main,
    light: COLORS.warning.light,
    text: COLORS.warning.contrastText,
    border: `${COLORS.warning.main}70`, // 60% opacity - stronger for intermediate
    background: `${COLORS.warning.main}08`, // 8% opacity
    hoverBg: `${COLORS.warning.main}15`, // 15% opacity
    darkBorder: `${COLORS.warning.main}70`, // 70% opacity
  },
  advanced: {
    main: COLORS.info.main,
    light: COLORS.info.light,
    text: COLORS.info.contrastText,
    border: `${COLORS.info.main}60`, // 50% opacity
    background: `${COLORS.info.main}08`, // 8% opacity
    hoverBg: `${COLORS.info.main}15`, // 15% opacity
    darkBorder: `${COLORS.info.main}60`, // 60% opacity
  },
};

// Spacing system - defines all spacing values used in the app
export const SPACING = {
  // Base unit in pixels
  unit: 8,

  // Commonly used spacing values
  xs: 8,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Spacing for specific components
  panelPadding: 24,    // 3 units, corresponds to p: 3 in MUI
  itemPadding: 16,     // 2 units, corresponds to p: 2 in MUI
  sectionMargin: 24,   // Space between sections
  itemMargin: 8,       // Space between items in a list
  borderRadius: 8,     // Standard border radius
  cardBorderRadius: 8, // Border radius for cards
  buttonBorderRadius: 6, // Border radius for buttons

  // Function to convert a spacing value to MUI theme spacing units
  toUnits: (value) => value / 8,
};

// Font sizes and weights
export const TYPOGRAPHY = {
  // Font sizes
  fontSize: {
    h1: '2.25rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.45rem',
    h6: '1.35rem',
    body1: '1.25rem',
    body2: '1.15rem',
    caption: '1rem',
    button: '1.1rem',
    small: '0.9rem',
  },

  // Specific component sizes
  panelTitle: '1.35rem',   // Panel headers
  questionTitle: '1.3rem',  // Question titles in main panel
  itemTitle: '1.15rem',     // Question titles in lists, category names, etc.
  regularText: '1.15rem',   // Regular text in the application
  metadataText: '0.95rem',  // Metadata, subcategory names, etc.

  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },

  // Font family
  fontFamily: [
    'Roboto',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'sans-serif',
  ].join(','),
};

// Layout dimensions
export const LAYOUT = {
  // Column widths
  LEFT_SIDEBAR_WIDTH: 450,
  RIGHT_SIDEBAR_WIDTH: 525,
  COLLAPSED_SIDEBAR_WIDTH: 80,
  COLUMN_THRESHOLD: 1800, // Screen width threshold for multi-column layout

  // Heights
  TOP_HEADER_HEIGHT: 64,
  BOTTOM_NAV_HEIGHT: 64,
  ITEM_HEIGHT: 44, // Height for list items, question items, etc.

  // Media query breakpoints
  breakpoints: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },

  // Standardize zIndex values
  zIndex: {
    drawer: 1200,
    modal: 1300,
    popup: 1400,
    tooltip: 1500,
  },
};

// Component-specific styles
export const COMPONENT_STYLES = {
  // Panel styles
  panel: {
    border: `1px solid ${COLORS.border}`,
    borderRadius: SPACING.borderRadius,
    padding: SPACING.panelPadding,
    paddingCollapsed: SPACING.panelPadding / 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },

  // Title styles
  title: {
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    marginBottom: SPACING.md,
  },

  // Question item styles
  questionItem: {
    padding: SPACING.itemPadding,
    paddingLeft: SPACING.itemPadding * 2, // For items with indicators
    marginBottom: SPACING.itemMargin,
    borderRadius: SPACING.borderRadius / 2,
    minHeight: LAYOUT.ITEM_HEIGHT,

    // Style variants
    variants: {

      // Answered state
      answered: {
        border: `1px solid ${COLORS.success.main}25`,
        backgroundColor: `${COLORS.success.main}08`,
      },

      // Normal state
      normal: {
        border: `1px solid ${COLORS.grey[300]}`,
        backgroundColor: COLORS.background.paper,
      },

    },
  },

  // Answer level styling
  answerLevel: (level) => {
    // Map level index to skill level
    const skillLevels = ['beginner', 'intermediate', 'advanced'];
    const skillLevel = skillLevels[level] || 'beginner';
    const colors = SKILL_LEVEL_COLORS[skillLevel];

    return {
      border: `1px solid ${colors.border}`,
      backgroundColor: colors.background,
      hoverBg: colors.hoverBg,
      color: colors.main,
    };
  },
};

// Create and export the theme function
export default function createAppTheme(options = {}) {
  return createTheme({
    palette: {
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      success: COLORS.success,
      warning: COLORS.warning,
      info: COLORS.info,
      error: COLORS.error,
      grey: COLORS.grey,
      background: COLORS.background,
      text: COLORS.text,
      ...options.palette,
    },
    typography: {
      fontFamily: TYPOGRAPHY.fontFamily,
      h1: {
        fontSize: TYPOGRAPHY.fontSize.h1,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      h2: {
        fontSize: TYPOGRAPHY.fontSize.h2,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      h3: {
        fontSize: TYPOGRAPHY.fontSize.h3,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      h4: {
        fontSize: TYPOGRAPHY.fontSize.h4,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      h5: {
        fontSize: TYPOGRAPHY.fontSize.h5,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      h6: {
        fontSize: TYPOGRAPHY.fontSize.h6,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      subtitle1: {
        fontSize: TYPOGRAPHY.fontSize.h4,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      subtitle2: {
        fontSize: TYPOGRAPHY.fontSize.h5,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
      },
      body1: {
        fontSize: TYPOGRAPHY.fontSize.body1,
      },
      body2: {
        fontSize: TYPOGRAPHY.fontSize.body1,
      },
      caption: {
        fontSize: TYPOGRAPHY.fontSize.caption,
      },
      button: {
        fontSize: TYPOGRAPHY.fontSize.button,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        textTransform: 'none',
      },
      ...options.typography,
    },
    spacing: SPACING.unit,
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: COMPONENT_STYLES.panel.boxShadow,
            borderRadius: SPACING.borderRadius,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 30,
            fontSize: TYPOGRAPHY.fontSize.caption,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: SPACING.buttonBorderRadius,
            fontSize: TYPOGRAPHY.fontSize.button,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              fontSize: TYPOGRAPHY.fontSize.body1,
            },
          },
        },
      },
      ...options.components,
    },
    ...options,
  });
}