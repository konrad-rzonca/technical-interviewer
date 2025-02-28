// src/utils/theme.js
import { createTheme } from '@mui/material/styles';

// Define a set of font sizes that will be used throughout the application
export const FONT_SIZES = {
  // Main typography sizes
  h1: '2rem',     // 32px
  h2: '1.75rem',  // 28px
  h3: '1.5rem',   // 24px
  h4: '1.35rem',  // 21.6px - Panel titles
  h5: '1.3rem',   // 20.8px - Question title
  body1: '1.15rem', // 18.4px - Main content, question titles, category names
  body2: '1rem',    // 16px - Secondary text
  caption: '0.95rem', // 15.2px - Small text, metadata
  small: '0.85rem',   // 13.6px - Very small text

  // Specific component sizes for reference
  panelTitle: '1.35rem',  // Panel headers (Categories, Question Details, etc.)
  questionTitle: '1.3rem', // Question titles in main panel
  itemTitle: '1.15rem',    // Question titles in lists, category names, etc.
  regularText: '1.15rem',  // Regular text in the application
  metadataText: '0.95rem'  // Metadata, subcategory names, etc.
};

// Define a set of font weights
export const FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700
};

// Define component-specific styles
export const COMPONENT_STYLES = {
  // Panel styles
  panel: {
    border: '1px solid #cccccc',
    borderRadius: 2,
    padding: 3, // 24px
    paddingCollapsed: 1.5 // 12px
  },

  // Title styles
  panelTitle: {
    marginBottom: 2, // 16px
    fontWeight: FONT_WEIGHTS.medium,
    fontSize: FONT_SIZES.panelTitle
  },

  // Question item styles
  questionItem: {
    padding: 2, // 16px
    paddingLeft: 3, // 24px for items with indicators
    marginBottom: 1, // 8px
    borderRadius: 1, // 8px
    minHeight: '50px',

    // Selected state
    selectedBorder: (color) => `2px solid ${color}60`,
    selectedBg: (color) => `${color}15`,

    // Answered state
    answeredBorder: '1px solid rgba(102, 187, 106, 0.25)',
    answeredBg: 'rgba(102, 187, 106, 0.08)',

    // Normal state
    normalBorder: '1px solid #e0e0e0',
    normalBg: 'white',

    // Hover state
    hoverBg: (color) => `${color}15`,
    hoverShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }
};

// Create a reusable theme with customizations for the application
export default function createAppTheme(options = {}) {
  return createTheme({
    palette: {
      primary: {
        main: '#2196f3',
        light: '#e3f2fd',
      },
      secondary: {
        main: '#757575',
      },
      background: {
        default: '#ffffff',
        paper: '#ffffff',
      },
      text: {
        primary: '#333333',
        secondary: '#757575',
      },
      success: {
        main: '#66bb6a',
        light: '#e8f5e9',
      },
      warning: {
        main: '#ffb300', // Updated to more intense yellow
        light: '#fff8e1',
      },
      ...options.palette
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      h6: {
        fontSize: FONT_SIZES.h4,
        fontWeight: FONT_WEIGHTS.medium,
      },
      subtitle1: {
        fontSize: FONT_SIZES.h4,
        fontWeight: FONT_WEIGHTS.medium,
      },
      subtitle2: {
        fontSize: FONT_SIZES.h5,
        fontWeight: FONT_WEIGHTS.medium,
      },
      body1: {
        fontSize: FONT_SIZES.body1,
      },
      body2: {
        fontSize: FONT_SIZES.body1,
      },
      caption: {
        fontSize: FONT_SIZES.caption,
      },
      ...options.typography
    },
    components: {
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
            fontSize: FONT_SIZES.caption,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 6, // Slightly larger button radius
            fontSize: FONT_SIZES.caption,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-input': {
              fontSize: FONT_SIZES.body1,
            }
          }
        }
      },
      ...options.components
    },
    ...options
  });
}