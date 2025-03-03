// src/themes/index.js
import createBaseTheme from './baseTheme';
import createUbsTheme from './ubsTheme';
import {getThemeName, isUbsTheme} from './themeUtils';

/**
 * Create theme based on configuration
 * @param {Object} options Additional theme options to pass
 * @returns {Object} The configured MUI theme
 */
export const createAppTheme = (options = {}) => {
  const themeName = getThemeName();

  // Select theme based on environment variable
  if (themeName.toLowerCase() === 'ubs') {
    console.log('Using UBS theme');
    return createUbsTheme(options);
  } else {
    console.log('Using base theme');
    return createBaseTheme(options);
  }
};

// Re-export theme constants for use in the app
export * from './baseTheme';

// Export isUbsTheme helper
export {isUbsTheme};

export default createAppTheme;