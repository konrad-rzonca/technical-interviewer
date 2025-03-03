// src/utils/baseTheme.js
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

  'basic': {
    'main': '#00BCD4',    // Maintain core cyan
    'light': '#E0F7FA',
    'dark': '#00838F',
    'contrastText': '#000000',
  },
  'intermediate': {
    'main': '#FFB300',    // Brighter gold yellow
    'light': '#FFD700',
    'dark': '#f9a800',
    'contrastText': '#000000',
  },
  'advanced': {
    'main': '#FF1A1A',    // Bright scarlet
    'light': '#FFEBEB',
    'dark': '#D40000',
    'contrastText': '#FFFFFF',
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
    main: COLORS.basic.main,
    light: COLORS.basic.light,
    text: COLORS.basic.contrastText,
    border: `${COLORS.basic.main}60`,
    background: `${COLORS.basic.main}08`,
    hoverBg: `${COLORS.basic.main}15`,
    darkBorder: `${COLORS.basic.main}60`,
  },
  intermediate: {
    main: COLORS.intermediate.main,
    light: COLORS.intermediate.light,
    text: COLORS.intermediate.contrastText,
    border: `${COLORS.intermediate.main}60`,
    background: `${COLORS.intermediate.main}09`,
    hoverBg: `${COLORS.intermediate.main}15`,
    darkBorder: `${COLORS.intermediate.main}70`,
  },
  advanced: {
    main: COLORS.advanced.main,
    light: COLORS.advanced.light,
    text: COLORS.advanced.contrastText,
    border: `${COLORS.advanced.main}60`,
    background: `${COLORS.advanced.main}08`,
    hoverBg: `${COLORS.advanced.main}15`,
    darkBorder: `${COLORS.advanced.main}60`,
  },
};

// Spacing system - defines all spacing values used in the app
export const SPACING = {
  // Base unit in pixels
  unit: 6,

  // Commonly used spacing values
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 10,
  lg: 16,
  xl: 22,
  xxl: 28,

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
    h1: '1.2rem',
    h2: '1.10rem',
    h3: '1.08rem',
    h4: '1.04rem',
    h5: '1.00rem',
    h6: '0.96rem',
    body1: '0.92rem',
    body2: '0.8rem',
    caption: '0.7rem',
    button: '1.0rem',
    small: '0.8rem',
  },

  // Specific component sizes
  panelTitle: '1.15rem',   // Panel headers
  questionTitle: '1.1rem',  // Question titles in main panel
  itemTitle: '1.05rem',     // Question titles in lists, category names, etc.
  regularText: '1.05rem',   // Regular text in the application
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
  LEFT_SIDEBAR_WIDTH: 325,
  RIGHT_SIDEBAR_WIDTH: 325,
  COLLAPSED_SIDEBAR_WIDTH: 80,
  COLUMN_THRESHOLD: 2100, // Screen width threshold for multi-column layout

  // Heights
  TOP_HEADER_HEIGHT: 64,
  BOTTOM_NAV_HEIGHT: 64,
  ITEM_HEIGHT: 38, // Height for list items, question items, etc.

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
        border: `1px solid ${COLORS.basic.main}25`,
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

export const createBaseTheme = (options = {}) => {
  return createTheme({
    palette: {
      primary: COLORS.primary,
      secondary: COLORS.secondary,
      success: COLORS.basic,
      warning: COLORS.intermediate,
      info: COLORS.advanced,
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
};

export default createBaseTheme;