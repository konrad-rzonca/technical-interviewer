// src/utils/globalStyles.js
import { COLORS, TYPOGRAPHY, SPACING } from './theme';

/**
 * GLOBAL STYLES
 * 
 * This file provides reusable style objects that can be applied consistently
 * across components. These are not hooks, so they can be used anywhere, including
 * in loops, conditionals, and nested components.
 */

// Scrollbar styling - migrated from CSS to JSS
export const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: COLORS.grey[300],
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: COLORS.grey[400],
  },
  scrollbarWidth: 'thin',
  scrollbarColor: `${COLORS.grey[300]} transparent`,
};

// Code formatting
export const codeStyles = {
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
  padding: '0.2em 0.4em',
  borderRadius: '3px',
  fontSize: '85%',
};

// Pre block for code examples - enhanced with styles from main.css
export const preStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  padding: SPACING.toUnits(SPACING.md),
  borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
  overflowX: 'auto',
  margin: `${SPACING.toUnits(SPACING.xs)} 0`,
  fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  fontSize: TYPOGRAPHY.fontSize.small,
  lineHeight: 1.5,
};

// Panel styling - basic container for content
export const panelStyles = {
  padding: SPACING.toUnits(SPACING.md),
  border: `1px solid ${COLORS.grey[200]}`,
  borderRadius: SPACING.toUnits(SPACING.borderRadius),
  backgroundColor: COLORS.background.paper,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  height: '100%',
  overflow: 'auto',
};

// Card styling - for interactive elements
export const cardStyles = {
  padding: SPACING.toUnits(SPACING.md),
  borderRadius: SPACING.toUnits(SPACING.borderRadius),
  backgroundColor: COLORS.background.paper,
  boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  transition: 'box-shadow 0.2s, transform 0.2s',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
    transform: 'translateY(-1px)',
  },
};

// Form element styles
export const formStyles = {
  input: {
    padding: SPACING.toUnits(SPACING.sm),
    border: `1px solid ${COLORS.grey[300]}`,
    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
    fontSize: TYPOGRAPHY.fontSize.regularText,
    '&:focus': {
      borderColor: COLORS.primary.main,
      outline: 'none',
    },
  },
  label: {
    display: 'block',
    marginBottom: SPACING.toUnits(SPACING.xs),
    fontSize: TYPOGRAPHY.fontSize.regularText,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
};

// Typography styles
export const typographyStyles = {
  heading1: {
    fontSize: TYPOGRAPHY.fontSize.h1,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.2,
    marginBottom: SPACING.toUnits(SPACING.md),
  },
  heading2: {
    fontSize: TYPOGRAPHY.fontSize.h2,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.3,
    marginBottom: SPACING.toUnits(SPACING.sm),
  },
  heading3: {
    fontSize: TYPOGRAPHY.fontSize.h3,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.4,
    marginBottom: SPACING.toUnits(SPACING.sm),
  },
  heading4: {
    fontSize: TYPOGRAPHY.fontSize.h4,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    lineHeight: 1.4,
    marginBottom: SPACING.toUnits(SPACING.xs),
  },
  body: {
    fontSize: TYPOGRAPHY.fontSize.regularText,
    lineHeight: 1.6,
  },
  metadata: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: COLORS.text.secondary,
  },
};

// Layout styles
export const layoutStyles = {
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// Animation styles
export const animationStyles = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animation: 'fadeIn 0.3s ease-in-out',
  },
  slideIn: {
    '@keyframes slideIn': {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    animation: 'slideIn 0.3s ease-out',
  },
};

// List styles
export const listStyles = {
  plain: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  spaced: {
    '& > li': {
      marginBottom: SPACING.toUnits(SPACING.sm),
    },
  },
  item: {
    padding: SPACING.toUnits(SPACING.sm),
    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
  },
};

// Tooltip styles
export const tooltipStyles = {
  container: {
    backgroundColor: COLORS.grey[800],
    color: 'white',
    borderRadius: SPACING.toUnits(SPACING.borderRadius / 2),
    padding: `${SPACING.toUnits(SPACING.xs)} ${SPACING.toUnits(SPACING.sm)}`,
    fontSize: TYPOGRAPHY.fontSize.small,
    maxWidth: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    zIndex: 1500,
  },
};

// Badge and indicator styles
export const indicatorStyles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
    height: '18px',
    minWidth: '18px',
    borderRadius: '9px',
    backgroundColor: COLORS.primary.main,
    color: 'white',
    fontSize: TYPOGRAPHY.fontSize.small,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  }
};

// Body styles migrated from main.css
export const bodyStyles = {
  margin: 0,
  padding: 0,
  fontFamily: TYPOGRAPHY.fontFamily,
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
  backgroundColor: COLORS.background.light,
  overflow: 'auto',
  height: '100vh',
  width: '100vw',
};

// Root styles migrated from main.css
export const rootStyles = {
  height: '100%',
  width: '100%',
  overflow: 'auto',
};

// Main container styles migrated from main.css
export const mainContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: {
    xs: '600px',
    sm: '700px',
    md: '800px'
  },
  backgroundColor: COLORS.background.light,
};

// Three column layout styles migrated from main.css
export const threeColumnLayoutStyles = {
  display: 'flex',
  height: 'calc(100vh - 48px)',
  overflow: 'auto',
};

// Panel container styles migrated from main.css
export const panelContainerStyles = {
  height: '100%',
  minHeight: '600px',
  overflow: 'auto',
};

// Media queries migrated from main.css
export const mediaQueries = {
  smallHeight: {
    '@media (max-height: 900px)': {
      'body, html, #root': {
        overflow: 'auto',
      },
      '.panel-container': {
        height: 'auto',
        minHeight: '600px',
      },
    },
  },
};

// Consolidated export of all global styles
const globalStyles = {
  scrollbar: scrollbarStyles,
  code: codeStyles,
  pre: preStyles,
  panel: panelStyles,
  card: cardStyles,
  form: formStyles,
  typography: typographyStyles,
  layout: layoutStyles,
  animation: animationStyles,
  list: listStyles,
  tooltip: tooltipStyles,
  indicator: indicatorStyles,
  body: bodyStyles,
  root: rootStyles,
  mainContainer: mainContainerStyles,
  threeColumnLayout: threeColumnLayoutStyles,
  panelContainer: panelContainerStyles,
  media: mediaQueries,
};

export default globalStyles;