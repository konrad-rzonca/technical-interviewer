// src/themes/ubs/ubsTheme.js
import {createBaseTheme, TYPOGRAPHY as BASE_TYPOGRAPHY} from './baseTheme';
import {mergeThemes} from './themeUtils';

/**
 * UBS Brand Theme
 * A theme based on UBS corporate identity with red as primary color.
 */

// UBS brand colors
export const UBS_COLORS = {
  primary: {
    main: '#EC0016', // UBS Red
    light: '#FF8080',
    dark: '#B30012',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#000000', // Black
    light: '#333333',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    light: '#F8F8F8',
  },
  text: {
    primary: '#000000',
    secondary: '#333333',
    disabled: '#999999',
  },
};

// UBS typography
export const UBS_TYPOGRAPHY = {
  fontFamily: '"Helvetica Neue", Arial, sans-serif',
  fontSize: {
    ...BASE_TYPOGRAPHY.fontSize,
    // Adjustments to font sizes if needed
  },
  fontWeight: {
    ...BASE_TYPOGRAPHY.fontWeight,
    medium: 500,
    bold: 700,
  },
};

// UBS-specific component overrides
export const UBS_COMPONENT_STYLES = {
  panel: {
    borderRadius: 4, // Smaller border radius
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  questionItem: {
    borderRadius: 4,
  },
};

// Create UBS theme by merging with base theme
export const createUbsTheme = (options = {}) => {
  // Deep merge of UBS overrides with base theme
  const ubsOverrides = {
    palette: {
      primary: UBS_COLORS.primary,
      secondary: UBS_COLORS.secondary,
      background: UBS_COLORS.background,
      text: UBS_COLORS.text,
    },
    typography: {
      fontFamily: UBS_TYPOGRAPHY.fontFamily,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: UBS_COMPONENT_STYLES.panel.borderRadius,
            boxShadow: UBS_COMPONENT_STYLES.panel.boxShadow,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            fontWeight: UBS_TYPOGRAPHY.fontWeight.medium,
          },
          contained: {
            backgroundColor: UBS_COLORS.primary.main,
            color: UBS_COLORS.primary.contrastText,
            '&:hover': {
              backgroundColor: UBS_COLORS.primary.dark,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#FFFFFF',
            color: '#000000',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            '&.Mui-selected': {
              color: UBS_COLORS.primary.main,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: UBS_COLORS.primary.main,
            height: 3,
          },
        },
      },
    },
  };

  // Create base theme with UBS overrides
  return createBaseTheme(mergeThemes({}, ubsOverrides));
};

export default createUbsTheme;